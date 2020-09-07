import { cache } from '../util/app';
import axios from 'axios';
import { openWeatherMapConfig } from '../config';
import { Weather } from '../models/openweathermap';

export async function getWeather(system: 'metric' | 'imperial'): Promise<Weather> {
    // Attempt to fetch the cached data
    let cached: Weather = cache.get(`weather:response:${system}`);

    if (!cached) {
        // Set the cached value and update it
        cached = (
            await axios({
                url: 'http://api.openweathermap.org/data/2.5/weather',
                method: 'GET',
                params: {
                    q: openWeatherMapConfig.query,
                    appid: openWeatherMapConfig.key,
                    units: system,
                },
            })
        ).data as Weather;
        cache.set(`weather:response:${system}`, cached, 120);
    }

    // Return the saved value
    return cached;
}
