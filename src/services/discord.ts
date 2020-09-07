import discord from 'discord.js';
import { discordConfig } from '../config';

// Create a new client and login to Discord
export const client = new discord.Client();
client.login(discordConfig.token);

/**
 * Gets the owner's Discord user using the config values.
 */
export async function getOwner(): Promise<discord.User> {
    return await client.users.fetch(discordConfig.owner);
}
