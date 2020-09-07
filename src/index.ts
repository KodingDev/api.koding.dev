import fastify, { FastifyError } from 'fastify';
import { web } from './config';
import { logger } from './util/logging';
import { buildSpotifyRoutes, buildRootRoutes, buildAboutRoutes } from './routes/routes';
import { failed } from './util/response';
import { start as startTasks } from './tasks/index';

setTimeout(() => startTasks(), 5000);

// Create a new fastify server
const server = fastify();

// Register the routes
server.register(buildSpotifyRoutes);
server.register(buildRootRoutes);
server.register(buildAboutRoutes);

server.setErrorHandler((error, _request, reply) => {
    // If this is a fastify error
    if ('code' in error || 'validation' in error) {
        // Get the real error and do a custom status
        const real = error as FastifyError;
        failed(reply, real.statusCode ?? 400, real.code, {
            code: real.message,
            validation: real.validation?.map((validation) => {
                return {
                    message: validation.message,
                    parameters: validation.params,
                };
            }),
        });
    } else {
        // Otherwise log as an internal server error
        logger.error(error);
        failed(reply, 500, 'Internal server error');
    }
});

// Bind to the port
server.listen(web.port, '0.0.0.0', (err, address) => {
    if (err) return logger.error(err);
    logger.info(`Bound at ${address}`);
});
