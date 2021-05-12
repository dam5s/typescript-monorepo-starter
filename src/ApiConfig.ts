const env = (name: string): string | undefined =>
    process.env[name];

const missingConfig = (name: string): string => {
    throw `missing env configuration: ${name}`;
};

const requireEnv = (name: string) => (): string =>
    env(name) || missingConfig(name);

export default {
    baseUrl: requireEnv('API_BASE_URL')
};
