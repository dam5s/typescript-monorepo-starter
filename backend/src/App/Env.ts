
const tryGetNumber = (name: string, defaultValue: number): number => {
    const env = process.env[name] || '';
    const parsed = parseInt(env);
    return isNaN(parsed) ? defaultValue : parsed;
};

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (value === undefined) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(`Expected environment variable ${name} to be set`);
    }
    return value;
};

export const env = {
    tryGetNumber,
    require: requireEnv,
};
