
const tryGetNumber = (name: string, defaultValue: number): number => {
    const env = process.env[name] || '';
    const parsed = parseInt(env);
    return isNaN(parsed) ? defaultValue : parsed;
};

export const env = {
    tryGetNumber,
};
