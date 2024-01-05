const {desc, task} = require('jake');
const {execOrExit} = require('../build-support/ExecOrExit');
const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const rootDir = path.dirname(__dirname);
const buildDir = path.join(projectDir, 'build');
const appBuildDir = path.join(buildDir, 'app');
const frontendDist = path.join(rootDir, 'frontend', 'dist')
const backendProjectDir = path.join(rootDir, 'backend')
const backendDist = path.join(backendProjectDir, 'dist')

task('clean', () => {
    fs.rmSync(appBuildDir, {recursive: true, force: true})
    fs.mkdirSync(appBuildDir, {recursive: true});
});

const buildPackageJson = () => {
    const rootPackageJsonString = fs.readFileSync(path.join(rootDir, 'package.json'), {encoding: 'utf-8'});
    const rootPackageJson = JSON.parse(rootPackageJsonString)
    const newPackageJson = {
        dependencies: rootPackageJson['dependencies'],
        scripts: {
            installBackend: 'npm --prefix backend clean-install',
            start: 'node backend/index.js'
        },
    }
    const newPackageJsonString = JSON.stringify(newPackageJson);

    fs.writeFileSync(path.join(appBuildDir, 'package.json'), newPackageJsonString)
};

task('app-container-only', async () => {
    fs.cpSync(path.join(projectDir, 'app'), path.join(appBuildDir), {recursive: true})

    fs.cpSync(frontendDist, path.join(appBuildDir, 'frontend'), {recursive: true})

    fs.cpSync(backendDist, path.join(appBuildDir, 'backend'), {recursive: true})

    buildPackageJson();

    fs.cpSync(path.join(rootDir, 'package-lock.json'), path.join(appBuildDir, 'package-lock.json'))
    fs.cpSync(path.join(backendProjectDir, 'package.json'), path.join(appBuildDir, 'backend', 'package.json'))
    fs.cpSync(path.join(backendProjectDir, 'package-lock.json'), path.join(appBuildDir, 'backend', 'package-lock.json'))

    await execOrExit('pack build starter-app ' +
        `--path ${appBuildDir} ` +
        '--env BP_NODE_VERSION=20 ' +
        '--env BP_NODE_RUN_SCRIPTS=installBackend ' +
        '--builder paketobuildpacks/builder:base ' +
        '--buildpack gcr.io/paketo-buildpacks/nginx ' +
        '--buildpack gcr.io/paketo-buildpacks/nodejs ' +
        '--buildpack gcr.io/paketo-buildpacks/node-run-script '
    );

    process.chdir(buildDir)

    await execOrExit('tar czf app.tgz app')
    await execOrExit(`docker save starter-app:latest | gzip > app-container.tgz`)
});

desc('app - Create container')
task('app', ['frontend:build', 'backend:build', 'app-container-only']);
