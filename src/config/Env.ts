declare global {
    interface Window { env: Record<string, string> }
}

const getEnv = (name: string): string | undefined =>
    window.env[name];

const missingConfig = (name: string): string => {
    throw `missing env configuration: ${name}`;
};

const requireEnv = (name: string) => (): string =>
    getEnv(name) || missingConfig(name);

export const env = {
    baseUrl: requireEnv('baseUrl')
};
