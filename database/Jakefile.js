const {fail, task, namespace, desc} = require('jake');
const {execOrExit} = require('../build-support/ExecOrExit');
const path = require('path');

const projectDir = __dirname;
const srcDir = path.join(projectDir, 'src');

/**
 * @param {string} name
 * @returns {string}
 */
const srcFile = (name) => path.join(srcDir, name)

task('fromProjectDir', () => process.chdir(projectDir));

desc('database - install dependencies')
task('install', ['fromProjectDir'], () => execOrExit('npm install'));

desc('database - create local databases')
task('create', () => execOrExit(`psql postgres -f ${srcFile('create_local_databases.sql')}`));

namespace('migrate', () => {
    desc('database - migrate tests database')
    task('tests', ['fromProjectDir'], () => execOrExit('npx db-migrate up -e tests'));

    desc('database - migrate dev database')
    task('dev', ['fromProjectDir'], () => execOrExit('npx db-migrate up -e dev'));
});

desc('database - migrate local databases')
task('migrate', ['install', 'migrate:tests', 'migrate:dev']);

desc('database - create new migration')
task('new-migration', ['fromProjectDir'], async (name) => {
    if (name === undefined) {
        fail('Expected name of migration passed as argument');
    }

    await execOrExit(`npx db-migrate create ${name}`);
});
