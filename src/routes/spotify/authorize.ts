import { FastifyRequest, FastifyReply } from 'fastify';
import { authorizeSpotify } from '../../services/spotify';

export default async function buildSpotifyAuthorizeRoute(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return await authorizeSpotify(res);
}
