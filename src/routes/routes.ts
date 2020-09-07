import { FastifyInstance, RegisterOptions } from 'fastify';
import buildSpotifyAuthorizeRoute from './spotify/authorize';
import buildSpotifyCallbackRoute from './spotify/callback';
import buildSpotifyPlayingRoute from './spotify/playing';
import buildHealthRoute from './root/health';
import buildMeRoute from './root/me';
import buildWeatherRoute from './about/weather';
import buildDiscordRoute from './about/discord';
import buildAvatarRoute from './about/avatar';

/**
 * Registers the Spotify API routes.
 *
 * @param server   - The Fastify server instance which we are registering this to
 * @param _options - Unused options variable.
 * @param next     - Optional next function to move onto the next item in the pipeline.
 */
export function buildSpotifyRoutes(server: FastifyInstance, _options: RegisterOptions, next?: () => void): void {
    server.get('/spotify/authorize', buildSpotifyAuthorizeRoute);
    server.get('/spotify/callback', buildSpotifyCallbackRoute);
    server.get('/spotify/playing', buildSpotifyPlayingRoute);
    // server.get('/spotify/playing-embed', buildSpotifyPlayingEmbedRoute);
    if (next) next();
}

/**
 * Registers the Spotify API routes.
 *
 * @param server   - The Fastify server instance which we are registering this to
 * @param _options - Unused options variable.
 * @param next     - Optional next function to move onto the next item in the pipeline.
 */
export function buildRootRoutes(server: FastifyInstance, _options: RegisterOptions, next?: () => void): void {
    server.get('/health', buildHealthRoute);
    server.get('/', buildMeRoute);
    if (next) next();
}

/**
 * Registers the about routes.
 *
 * @param server   - The Fastify server instance which we are registering this to
 * @param _options - Unused options variable.
 * @param next     - Optional next function to move onto the next item in the pipeline.
 */
export function buildAboutRoutes(server: FastifyInstance, _options: RegisterOptions, next?: () => void): void {
    server.get(
        '/about/weather',
        {
            schema: {
                querystring: {
                    required: ['format'],
                    properties: {
                        format: {
                            type: 'string',
                            enum: ['metric', 'imperial'],
                        },
                    },
                },
            },
        },
        buildWeatherRoute,
    );
    server.get('/about/discord', buildDiscordRoute);
    server.get('/about/avatar', buildAvatarRoute);
    if (next) next();
}
