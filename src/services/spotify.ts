import { spotifyConfig, web } from '../config';
import qs from 'querystring';
import axios, { Method } from 'axios';
import { FastifyReply } from 'fastify';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { failed } from '../util/response';
import { logger } from '../util/logging';
import { SpotifyPlayerResponse } from '../models/spotify';

// The relative file path to the Spotify configuration
const configFile = '.config/spotify.json';

/**
 * Checks if the config file is present, and if so will load it into
 * memory. Otherwise this will return undefined. This config file stores
 * both the access and refresh tokens required to use the Spotify API.
 */
export let config: { access: string; refresh: string } = existsSync(configFile)
    ? JSON.parse(readFileSync(configFile).toString())
    : undefined;

// Authentication header which is used when logging in to Spotify using OAuth2
const authHeader = Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64');

/**
 * Updates the config file in memory and saves it to the disk.
 *
 * @param access  - The access token Spotify provided which we use to fetch data
 * @param refresh - The refresh token Spotify provided so we can obtain a new access token
 */
function updateConfig(access: string, refresh: string) {
    config = { access, refresh };
    writeFileSync(configFile, JSON.stringify({ access, refresh }));
}

/**
 * Creates an authorization URL for Spotify OAuth and redirects
 * the user to it.
 *
 * @param res - The Fastify response object which redirects the user
 */
export function authorizeSpotify(res: FastifyReply): void {
    // If we have already got credentials saved, fail this
    if (config) return failed(res, 401, 'Unauthorized');

    // Create the query parameters and redirect the user
    const query = qs.stringify({
        client_id: spotifyConfig.clientId,
        response_type: 'code',
        redirect_uri: `${web.baseUrl}/spotify/callback`,
        scope: encodeURIComponent('user-read-playback-state user-read-currently-playing'),
    });
    res.redirect(302, `https://accounts.spotify.com/authorize?${query}`);
}

/**
 * Handles the code from the callback route so we can obtain and save
 * an access and refresh token.
 *
 * @param code - The code provided by Spotify so we can obtain an access and refresh token
 */
export async function callbackSpotify(code: string): Promise<void> {
    // Request from the token endpoint
    const response = await axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        data: qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${web.baseUrl}/spotify/callback`,
        }),
        headers: {
            authorization: `Basic ${authHeader}`,
            'content-type': 'application/x-www-form-urlencoded',
        },
    });

    // Read the access and refresh tokens and save them into the config
    const { access_token: access, refresh_token: refresh } = response.data;
    updateConfig(access, refresh);
}

/**
 * Refreshes our current Spotify access token when it has expired, saving
 * it to the config for future use.
 */
export async function refreshSpotify(): Promise<void> {
    logger.info('Refreshing Spotify access token');

    // Request a new access token from Spotify
    const response = await axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        data: qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: config.refresh,
        }),
        headers: {
            authorization: `Basic ${authHeader}`,
            'content-type': 'application/x-www-form-urlencoded',
        },
    });

    // Save it to the config file
    const { access_token: access } = response.data;
    updateConfig(access, config.refresh);
}

/**
 * Requests the Spotify API using the provided URL and method, automatically
 * refreshing our access token if it is required.
 *
 * @param url    - The URL we should be requesting from Spotify
 * @param method - HTTP method to use when requesting
 */
async function wrapRequest<T>(url: string, method: Method): Promise<T> {
    // If the config is not available then ignore this
    if (!config) return null;

    try {
        // Request from the URL and return the data
        const response = await axios({
            url,
            method,
            headers: {
                authorization: `Bearer ${config.access}`,
            },
        });
        return response.data as T;
    } catch (error) {
        // Refresh our Spotify access token and re-run this function
        await refreshSpotify();
        return await wrapRequest<T>(url, method);
    }
}

/**
 * Requests the currently playing song from Spotify and returns it
 * in the interface form.
 */
export async function getCurrentlyPlaying(): Promise<SpotifyPlayerResponse> {
    return await wrapRequest<SpotifyPlayerResponse>('https://api.spotify.com/v1/me/player/currently-playing', 'GET');
}
