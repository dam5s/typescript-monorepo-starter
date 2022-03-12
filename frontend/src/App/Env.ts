declare global {
    interface Window { env: Record<string, string> }
}

const getEnv = (name: string): string | undefined =>
    window.env[name];

const missingConfig = (name: string): string => {
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
