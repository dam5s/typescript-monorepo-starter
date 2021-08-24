declare global {
    interface Window { env: Record<string, string> }
}

const env = (name: string): string | undefined =>
    window.env[name];

const missingConfig = (name: string): string => {
    throw `missing env configuration: ${name}`;
};

const requireEnv = (name: string) => (): string =>
    env(name) || missingConfig(name);

export default {
    baseUrl: requireEnv('baseUrl')
};
