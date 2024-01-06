const {task, desc} = require('jake');
const {npm} = require('./Run');
const path = require("path");

const projectTasks = (projectDir) => {

    const projectName = path.basename(projectDir);

    task('fromProjectDir', () => process.chdir(projectDir));

    desc(`${projectName} - install dependencies`)
    task('install', ['fromProjectDir'], async () => {
        await npm('install');
    });

    desc(`${projectName} - run linter`)
    task('lint', ['install'], async () => {
        await npm('run lint');
    });

    desc(`${projectName} - run tests`)
    task('test', ['lint'], async () => {
        await npm('run test');
    });

    desc(`${projectName} - build javascript from typescript`)
    task('build', ['test'], async () => {
        await npm('run build');
    });

    desc(`${projectName} - start server`)
    task('start', ['fromProjectDir'], async () => {
        await npm('run start');
    });
};

module.exports = {
    projectTasks,
};
