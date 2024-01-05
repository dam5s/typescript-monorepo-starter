const {fail, task, namespace} = require('jake');
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

task('create', async () => {
    await execOrExit(`psql postgres -f ${srcFile('create_local_databases.sql')}`)
});

namespace('migrate', () => {
    task('tests', ['fromProjectDir'], () => execOrExit('npx db-migrate up -e tests'));
    task('dev', ['fromProjectDir'], () => execOrExit('npx db-migrate up -e dev'));
});

task('migrate', ['migrate:tests', 'migrate:dev']);

task('new-migration', ['fromProjectDir'], async (name) => {
    if (name === undefined) {
        fail('Expected name of migration passed as argument');
    }

    await execOrExit(`npx db-migrate create ${name}`);
});
