import http from 'http';
import net from 'net';

export interface MockWebServer {
    stop: () => void;
    start: () => void;
    url: (path: string) => string,
    stub: (newCode: number, newResponse: Record<string, unknown>) => void;
    lastRequest: () => http.IncomingMessage | undefined;
}

export const mockWebServer = (): MockWebServer => {

    let code = 200;
    let body = 'Hello, World!';
    let lastRequest: http.IncomingMessage | undefined;
    let server: http.Server | undefined;

    const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
        lastRequest = req;

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
        res.end(body);
    };

    return {
        stop: () => server?.close(),
        start: () => {
            server = http.createServer(requestListener);
            server.listen(0);
        },
        url: (path: string) => {
            const address = server?.address() as net.AddressInfo;
            return `http://localhost:${address.port}${path}`;
        },
        stub: (newCode: number, newBody: Record<string, unknown>) => {
            code = newCode;
            body = JSON.stringify(newBody);
        },
        lastRequest: () => lastRequest,
    };
};
