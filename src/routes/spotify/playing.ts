import { FastifyRequest, FastifyReply } from 'fastify';
import { getCurrentlyPlaying } from '../../services/spotify';
import { success } from '../../util/response';

export default async function buildSpotifyPlayingRoute(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Fetch the current song, returning a fallback request if
    // a song isn't being played
    const song = await getCurrentlyPlaying();
    if (!song || !song.item) return success(res, 200, { playing: false, active: false });

    // Return a successful response
    return success(res, 200, {
        active: true,
        playing: song.is_playing,
        name: song.item.name,
        explicit: song.item.explicit,
        duration: song.item.duration_ms,
        progress: song.progress_ms ? song.progress_ms : 0,
        album: {
            name: song.item.album.name,
        },
        artists: song.item.artists.map((artist) => {
            return {
                name: artist.name,
            };
        }),
    });
}
