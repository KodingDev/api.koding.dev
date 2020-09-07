import { FastifyRequest, FastifyReply } from 'fastify';
import { success } from '../../util/response';

export default async function buildMeRoute(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return success(res, 200, {
        about: {
            name: 'Sophia',
            username: 'KodingDev',
            pronouns: ['she', 'her'],
        },
        socials: {
            twitter: 'https://twitter.com/KodingDev_',
            github: 'https://github.com/KodingDev',
            reddit: 'https://reddit.com/u/TotallyNotKoding',
            spotify: 'https://open.spotify.com/user/djitechdude',
            steam: 'https://steamcommunity.com/id/Koding_/',
            twitch: 'https://www.twitch.tv/kodingdev',
            youtube: 'https://www.youtube.com/channel/UCVcSk0hHQH5gmcvi5cOKgnw',
        },
    });
}
