let {namespace, task, desc} = require('jake');
let exec = require('child_process').exec;

const execOrExit = cmd => {
    let resolve = () => {};
    const promise = new Promise(r => { resolve = r });
    const print = data => console.log(data.replace('\n', ''));

    try {
        const child = exec(cmd)
        child.stdout.on('data', print);
        child.stderr.on('data', print);
        child.on('close', resolve);
    } catch (err) {
        process.exit(1);
        resolve();
    }

    return promise;
};

const projectNpmCommand = (projectName, command) => {
    const taskName = command.split(' ').reverse()[0];
    desc(taskName);
    task(taskName, async () => await execOrExit(`npm ${command} --prefix ${projectName}`));
};

const project = (projectName) => {
    namespace(projectName, () => {
        projectNpmCommand(projectName, 'install')
        projectNpmCommand(projectName, 'run lint')
        projectNpmCommand(projectName, 'run test')
        projectNpmCommand(projectName, 'run build')
    });
};

project('prelude');
project('backend');
project('frontend');

desc('install')
task('install', ['prelude:install', 'backend:install', 'frontend:install']);

desc('lint')
task('lint', ['prelude:lint', 'backend:lint', 'frontend:lint']);

desc('test')
task('test', ['prelude:test', 'backend:test', 'frontend:test']);

task('build', ['install', 'lint', 'test', 'backend:build', 'frontend:build']);
task('default', ['build'])