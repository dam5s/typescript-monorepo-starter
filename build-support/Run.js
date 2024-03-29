const {exec} = require('child_process');

/**
 * Runs command, exits process if subprocess fails
 * @param {string} cmd Command to run
 * @param {Record<string, string>} env Environment for the run command
 * @returns {Promise<void>}
 */
const run = (cmd, env = {}) => {
    console.log('Executing command:', cmd);

    let resolve = () => {};
    const promise = new Promise(r => { resolve = r; });
    const print = data => console.log(data.replace('\n', ''));

    try {
        const child = exec(cmd, {env: {...process.env, ...env}});
        child.stdout.on('data', print);
        child.stderr.on('data', print);
        child.on('close', exitCode => {
            if (exitCode > 0) {
                process.exit(exitCode);
            }
            resolve();
        });
    } catch (err) {
        process.exit(1);
    }

    return promise;
};

module.exports = {
    run,
    npm: (cmd, env = {}) => run(`npm ${cmd}`, env),
    npx: (cmd, env = {}) => run(`npx ${cmd}`, env),
};
