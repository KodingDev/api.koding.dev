import { FastifyRequest, FastifyReply } from 'fastify';
import { getCurrentlyPlaying } from '../../services/spotify';
import { JSDOM } from 'jsdom';
import * as d3 from 'd3';

export default async function buildSpotifyPlayingEmbedRoute(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    const song = await getCurrentlyPlaying();

    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    const body = d3.select(dom.window.document.querySelector('body'));
    const svg = body.append('svg').attr('width', 250).attr('height', 100).attr('xmlns', 'http://www.w3.org/2000/svg');
    const defs = svg.append('defs');

    const linearGradient = defs
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0.5')
        .attr('x2', '0.5')
        .attr('y2', '1')
        .attr('gradientUnits', 'objectBoundingBox');
    linearGradient.append('stop').attr('offset', '0').attr('stop-color', '#212121');
    linearGradient.append('stop').attr('offset', '1').attr('stop-color', '#191414');

    defs.append('clipPath').attr('id', 'clip-Custom_Size_1').append('rect').attr('width', '250').attr('height', '100');

    const graphic = svg.append('g').attr('clip-path', 'url(#clip-Custom_Size_1)');
    graphic.append('rect').attr('width', '250').attr('height', '100').attr('fill', '#fff');
    graphic.append('rect').attr('width', '250').attr('height', '100').attr('fill', 'url(#linear-gradient)');

    const group = graphic.append('g').attr('transform', 'translate(19 6)');
    group
        .append('text')
        .attr('transform', 'translate(65 33)')
        .attr('fill', '#fff')
        .attr('font-size', '7')
        .attr('font-family', 'ArialMT, Arial')
        .append('tspan')
        .attr('x', '0')
        .attr('y', '0')
        .html(song.item ? 'Currently Playing' : 'Paused');
    group
        .append('text')
        .attr('transform', 'translate(65 47)')
        .attr('fill', '#fff')
        .attr('font-size', '12')
        .attr('font-family', 'Arial-BoldMT, Arial')
        .append('tspan')
        .attr('x', '0')
        .attr('y', '0')
        .html(song.item ? song.item.name : 'No music');
    group
        .append('text')
        .attr('transform', 'translate(65 59)')
        .attr('fill', '#fff')
        .attr('font-size', '10')
        .attr('font-family', 'ArialMT, Arial')
        .append('tspan')
        .attr('x', '0')
        .attr('y', '0')
        .html(song.item ? `By ${song.item.artists[0].name}` : 'is being played');

    if (song.item)
        graphic
            .append('image')
            .attr('href', song.item.album.images[0].url)
            .attr('transform', 'translate(9.747 18.658)')
            .attr('width', '62')
            .attr('height', '62');

    return res.code(200).type('image/svg+xml').send(body.html());
}
