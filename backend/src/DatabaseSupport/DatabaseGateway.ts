import * as schema from 'schemawax';
import {Pool, PoolConfig, QueryResult} from 'pg';

export type DatabaseGateway = {
    readonly queryOne: <T>(sql: string, decoder: schema.Decoder<T>, values?: readonly unknown[]) => Promise<T>
    readonly tryQueryOne: <T>(sql: string, decoder: schema.Decoder<T>, values?: readonly unknown[]) => Promise<T | null>
    readonly queryMany: <T>(sql: string, decoder: schema.Decoder<T>, values?: readonly unknown[]) => Promise<readonly T[]>
    readonly execute: (sql: string, values?: readonly unknown[]) => Promise<void>
    readonly close: () => Promise<void>
}

const create = (databaseUrl: string): DatabaseGateway => {
    const poolConfig: PoolConfig = {
        connectionString: databaseUrl,
        min: 2,
        max: 10,
    };

    const pool = new Pool(poolConfig);

    const query = async (
        sql: string,
        values: readonly unknown[] | undefined,
        countPredicate: (count: number | null) => boolean,
    ): Promise<QueryResult> => {

        // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
        const result = await pool.query(sql, values as any[]);

        if (countPredicate(result.rowCount)) {
            return result;
        }

        // eslint-disable-next-line functional/no-throw-statements
        throw new Error(`Unexpected row count, got ${result.rowCount}`);
    };

    return {
        queryOne: async (sql, decoder, values) => {
            const requireExactlyOne = (count: number | null) => count == 1;
            const result = await query(sql, values, requireExactlyOne);
            return decoder.forceDecode(result.rows[0]);
        },
        tryQueryOne: async (sql, decoder, values) => {
            const requireAtMostOne = (count: number | null) => count !== null && count <= 1;
            const result = await query(sql, values, requireAtMostOne);
            const count = result.rowCount ?? 0;

            if (count === 0) {
                return null;
            }

            return decoder.forceDecode(result.rows[0]);
        },
        queryMany: async (sql, decoder, values) => {
            const acceptMany = () => true;
            const result = await query(sql, values, acceptMany);
            return result.rows.map(decoder.forceDecode);
        },
        execute: async (sql, values) => {
            const acceptAny = () => true;
            await query(sql, values, acceptAny);
        },
        close: () => pool.end(),
    };
};

export const databaseGateway = {
    create,
};
