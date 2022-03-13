const {desc, task} = require('jake');
const {execOrExit} = require('../build-support/ExecOrExit');
const fs = require("fs");
const path = require("path");

const projectDir = __dirname;
const rootDir = path.dirname(__dirname);
const buildDir = path.join(projectDir, 'build');
const appBuildDir = path.join(buildDir, 'app');
const frontendDist = path.join(rootDir, 'frontend', 'dist')
const backendProjectDir = path.join(rootDir, 'backend')
const backendDist = path.join(backendProjectDir, 'dist')

desc('app - Create container')
task('app', [], async () => {
    fs.rmSync(appBuildDir, {recursive: true, force: true})
    fs.mkdirSync(appBuildDir, {recursive: true});
    fs.cpSync(path.join(projectDir, 'app'), path.join(appBuildDir), {recursive: true})
    fs.cpSync(frontendDist, path.join(appBuildDir, 'frontend'), {recursive: true})
    fs.cpSync(backendDist, path.join(appBuildDir, 'backend'), {recursive: true})
    fs.cpSync(backendDist, path.join(appBuildDir, 'backend'), {recursive: true})
    fs.cpSync(path.join(backendProjectDir, 'package.json'), path.join(appBuildDir, 'package.json'))
    fs.cpSync(path.join(backendProjectDir, 'package-lock.json'), path.join(appBuildDir, 'package-lock.json'))

    await execOrExit('pack build starter-app ' +
        `--path ${appBuildDir} ` +
        '--env BP_NODE_VERSION=16 ' +
        '--builder paketobuildpacks/builder:base ' +
        '--buildpack gcr.io/paketo-buildpacks/nginx ' +
        '--buildpack gcr.io/paketo-buildpacks/nodejs '
    );
});
