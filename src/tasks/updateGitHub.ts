import { github } from '../services/github';
import { getOwner } from '../services/discord';
import { getWeather } from '../services/openweathermap';
import { getCurrentlyPlaying } from '../services/spotify';

/**
 * Mappings for Discord statuses to prettier names.
 */
const statuses = {
    offline: 'Offline',
    invisible: 'Invisible',
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
};

export default async function run(): Promise<void> {
    const user = await getOwner();
    const weather = await getWeather('metric');
    const playing = await getCurrentlyPlaying();

    // Update the bio on GitHub
    await github.users.updateAuthenticated({
        bio: `👋 ${statuses[user.presence.status] ?? 'Offline'} on Discord
    🌥 ${weather.weather.length ? weather.weather[0].main : 'Unknown weather'} (${weather.main.temp}°C)
    🎶 ${playing.item ? `${playing.item.name} by ${playing.item.artists[0].name}` : 'Not listening to music'}`,
    });
}
