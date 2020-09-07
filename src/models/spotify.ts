/**
 * Structures the Spotify player response data which we fetch from
 * the web API so it can be easily used later.
 */
export interface SpotifyPlayerResponse {
    is_playing: boolean;
    progress_ms: number;
    item: {
        name: string;
        duration_ms: number;
        explicit: boolean;
        album: {
            name: string;
            external_urls: {
                spotify: string;
            };
            images: {
                height: number;
                width: number;
                url: string;
            }[];
        };
        artists: {
            name: string;
            external_urls: {
                spotify: string;
            };
        }[];
        external_urls: {
            spotify: string;
        };
    };
}
