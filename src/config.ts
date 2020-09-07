import dotenv from 'dotenv';

// Load the environment variables from the .env file
dotenv.config();

export const web = {
    port: parseInt(process.env.WEB_PORT || '8080'),
    baseUrl: process.env.WEB_BASE_URL || `http://localhost:8080`,
};

export const spotifyConfig = {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
};

export const openWeatherMapConfig = {
    query: process.env.OPEN_WEATHER_MAP_QUERY || 'Sydney',
    key: process.env.OPEN_WEATHER_MAP_KEY || '',
};

export const discordConfig = {
    token: process.env.DISCORD_TOKEN,
    owner: process.env.DISCORD_OWNER,
};

export const gitHubConfig = {
    token: process.env.GITHUB_ACCESS_TOKEN || '',
};
