const {task, desc} = require('jake');
const {execOrExit} = require('./ExecOrExit');
const path = require("path");

const projectTasks = (projectDir) => {

    const projectName = path.basename(projectDir);

    task('fromProjectDir', () => process.chdir(projectDir));

    desc(`${projectName} - install dependencies`)
    task('install', ['fromProjectDir'], async () => {
        await execOrExit('npm install');
    });

    desc(`${projectName} - lint`)
    task('lint', ['install'], async () => {
        await execOrExit('npm run lint');
    });

    desc(`${projectName} - test`)
    task('test', ['lint'], async () => {
        await execOrExit('npm run test');
    });

    desc(`${projectName} - build`)
    task('build', ['test'], async () => {
        await execOrExit('npm run build');
    });

    desc(`${projectName} - start`)
    task('start', ['fromProjectDir'], async () => {
        await execOrExit('npm run start');
    });
};

module.exports = {
    projectTasks,
};
