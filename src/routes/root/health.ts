import { FastifyRequest, FastifyReply } from 'fastify';
import { success } from '../../util/response';

export default async function buildHealthRoute(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return success(res, 200, { healthy: true });
}
