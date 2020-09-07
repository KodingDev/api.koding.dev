import { FastifyRequest, FastifyReply } from 'fastify';
import { getWeather } from '../../services/openweathermap';
import { success } from '../../util/response';

export default async function buildWeatherRoute(
    req: FastifyRequest<{ Querystring: { format: 'metric' | 'imperial' } }>,
    res: FastifyReply,
): Promise<void> {
    // Get the weather using the given format
    const data = await getWeather(req.query.format);

    // Return a successful response with the
    return success(res, 200, {
        format: req.query.format,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        temperature: {
            current: data.main.temp,
            min: data.main.temp_min,
            max: data.main.temp_max,
        },
        wind: {
            speed: data.wind.speed,
            angle: data.wind.deg,
        },
    });
}
