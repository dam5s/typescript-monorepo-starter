declare global {
    interface Window { readonly env: Record<string, string> }
}

const getEnv = (name: string): string | undefined =>
    window.env[name];

const missingConfig = (name: string): string => {
    // eslint-disable-next-line functional/no-throw-statements
    throw `missing env configuration: ${name}`;
};

const requireEnv = (name: string): string => {
    const value = getEnv(name);
    return value !== undefined
        ? value
        : missingConfig(name);
};

export const env = {
    require: requireEnv,
};
