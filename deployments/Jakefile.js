const {task} = require('jake');
const {execOrExit} = require('../build-support/ExecOrExit');
const fs = require("fs");
const path = require("path");

const projectDir = __dirname;
const rootDir = path.basename(__dirname);
const buildDir = path.join(projectDir, 'build');
const appBuildDir = path.join(buildDir, 'app');
const frontendDist = path.join(rootDir, 'frontend', 'dist')
const backendDist = path.join(rootDir, 'backend', 'dist')

desc('app - Create container')
task('app', ['backend:build', 'frontend:build'], async () => {
    fs.rmSync(appBuildDir, {recursive: true, force: true})
    fs.mkdirSync(appBuildDir, {recursive: true});
    fs.cpSync(frontendDist, path.join(appBuildDir, 'frontend'), {recursive: true})
    fs.cpSync(backendDist, path.join(appBuildDir, 'backend'), {recursive: true})

    // await execOrExit('pack build starter-app ' +
    //     `--path ${appBuildDir} ` +
    //     '--env BP_NODE_VERSION=16 ' +
    //     '--builder paketobuildpacks/builder:base ' +
    //     '--buildpack gcr.io/paketo-buildpacks/nginx ' +
    //     '--buildpack gcr.io/paketo-buildpacks/node ');
});
