import {DatabaseGateway, databaseGateway} from '../DatabaseSupport';

export declare namespace TestDatabase {

    type Gateway = DatabaseGateway & {
        readonly clear: () => Promise<void>,
    }
}

const gateway = (): TestDatabase.Gateway => {
    const workerId = process.env['JEST_WORKER_ID'];
    const dbHost = process.env['DB_HOST'] || 'localhost';
    const url = `postgres://ts_monorepo_db_user:secret@${dbHost}/ts_monorepo_db_tests_${workerId}`;
    const db = databaseGateway.create(url);

    return {
        ...db,
        clear: async () => {
            await db.execute('truncate jokes');
        },
    };
};

export const testDatabase = {
    gateway,
};
