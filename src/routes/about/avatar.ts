import { FastifyRequest, FastifyReply } from 'fastify';
import { getOwner } from '../../services/discord';

export default async function buildAvatarRoute(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Fetch the user from Discord and redirect to their avatar
    const user = await getOwner();
    res.redirect(302, user.avatarURL({ format: 'png', size: 2048 }));
}
