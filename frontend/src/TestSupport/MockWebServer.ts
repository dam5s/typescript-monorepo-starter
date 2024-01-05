import http from 'http';
import net from 'net';
import {createHttpTerminator} from 'http-terminator';

export type MockWebServer = {
    readonly stop: () => Promise<void>;
    readonly url: (path: string) => string,
    readonly baseUrl: () => string,
    readonly stub: (newCode: number, newResponse: Record<string, unknown>) => void;
    readonly lastRequest: () => RecordedRequest | undefined;
    readonly asyncLastRequest: () => Promise<RecordedRequest>;
}

export type RecordedRequest = {
    readonly method: string | undefined,
    readonly path: string | undefined,
    // eslint-disable-next-line functional/prefer-readonly-type
    body: string,
}

const create = (): MockWebServer => {

    let code = 200;
    let body = 'Hello, World!';
    let lastRequest: RecordedRequest | undefined;
    let resolve: ((request: RecordedRequest) => void);
    const promise = new Promise<RecordedRequest>(r => {
        resolve = r;
    });

    const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
        const recordedRequest: RecordedRequest = {
            method: req.method,
            path: req.url,
            body: '',
        };

        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(code);

        req.on('data', chunk => {
            recordedRequest.body += chunk;
        });

        req.on('end', () => {
            lastRequest = recordedRequest;
            resolve(recordedRequest);
            res.end(body);
        });
    };

    const server = http.createServer(requestListener);
    const terminator = createHttpTerminator({server});
    server.listen(0);

    const url = (path: string) => {
        const address = server.address() as net.AddressInfo;
        return `http://localhost:${address.port}${path}`;
    };

    return {
        stop: () => terminator.terminate(),
        url,
        baseUrl: () => url(''),
        stub: (newCode: number, newBody: Record<string, unknown>) => {
            code = newCode;
            body = JSON.stringify(newBody);
        },
        lastRequest: () => lastRequest,
        asyncLastRequest: () => promise,
    };
};

export const mockWebServer = {
    create,
};
