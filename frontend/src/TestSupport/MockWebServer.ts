import http from 'http';
import net from 'net';
import {createHttpTerminator} from 'http-terminator';

export interface MockWebServer {
    stop: () => Promise<void>;
    url: (path: string) => string,
    baseUrl: () => string,
    stub: (newCode: number, newResponse: Record<string, unknown>) => void;
    lastRequest: () => RecordedRequest | undefined;
    asyncLastRequest: () => Promise<RecordedRequest>;
}

export type RecordedRequest = {
    method: string | undefined,
    path: string | undefined,
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
