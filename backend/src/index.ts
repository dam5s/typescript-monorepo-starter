import {appRoutes, appServer, env} from './App';


const init = async () => {
    const server = appServer.create({
        port: env.tryGetNumber('PORT', 3001),
        routes: appRoutes.build(),
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

(async () => await init())();
