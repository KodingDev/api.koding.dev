import { FastifyRequest, FastifyReply } from 'fastify';
import { getOwner } from '../../services/discord';
import { success } from '../../util/response';

export default async function buildDiscordRoute(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Fetch the owner from Discords API and return it
    const user = await getOwner();
    return success(res, 200, {
        profile: {
            username: user.username,
            discriminator: user.discriminator,
            id: user.id,
            avatar: user.displayAvatarURL({ format: 'gif' }),
        },
        presence: user.presence
            ? {
                  status: user.presence.status,
                  activities: user.presence.activities.map((activity) => {
                      return {
                          name: activity.name,
                          type: activity.type,
                          details: activity.details,
                          state: activity.state,
                          emoji: activity.emoji
                              ? {
                                    name: activity.emoji.name,
                                    id: activity.emoji.id,
                                    url: activity.emoji.url,
                                }
                              : undefined,
                          timestamps: activity.timestamps
                              ? {
                                    start: activity.timestamps?.start,
                                    end: activity.timestamps?.end,
                                }
                              : undefined,
                      };
                  }),
              }
            : undefined,
    });
}
