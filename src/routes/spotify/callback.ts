import { FastifyRequest, FastifyReply } from 'fastify';
import { callbackSpotify, config } from '../../services/spotify';
import { success, failed } from '../../util/response';

export default async function buildSpotifyCallbackRoute(
    req: FastifyRequest<{ Querystring: { code: string } }>,
    res: FastifyReply,
): Promise<void> {
    // If we already have Spotify credentials saved then fail this
    if (config) return failed(res, 401, 'Unauthorized');

    // Run the Spotify callback and return success
    await callbackSpotify(req.query.code);
    return success(res, 200);
}
