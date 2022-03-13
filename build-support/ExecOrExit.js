const {exec} = require('child_process');

const execOrExit = cmd => {
    console.log('Executing command:', cmd);

    let resolve = () => {};
    const promise = new Promise(r => { resolve = r; });
    const print = data => console.log(data.replace('\n', ''));

    try {
        const child = exec(cmd);
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
    execOrExit,
};
