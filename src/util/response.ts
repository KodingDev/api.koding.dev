import { FastifyReply } from 'fastify';

/**
 * Sends a successful response to the provided reply object.
 *
 * @param reply  - Fastify response data which we use to apply the code and send the response
 * @param status - The HTTP status code
 * @param data   - Optional JSON data to attach
 */
export function success(reply: FastifyReply, status: number, data?: Record<string, unknown>): void {
    reply.code(status).send({
        success: true,
        data,
    });
}

/**
 * Sends a failure response to the provided reply class.
 *
 * @param reply  - Fastify response data which we use to apply the code and send the response
 * @param status - The HTTP status code
 * @param code   - Message which should tell the user about the error
 * @param data   - Optional JSON data to attach
 */
export function failed(reply: FastifyReply, status: number, code: string, data?: Record<string, unknown>): void {
    reply.code(status).send({
        success: false,
        code,
        data,
    });
}
