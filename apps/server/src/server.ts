import fastify, {
    type FastifyInstance,
    type FastifyReply,
    type FastifyRequest,
} from 'fastify';
import type { GameService } from '@/gameService.js';
import z from 'zod';
import {
    SteamApiError,
    SteamUserNotFoundError,
    SteamValidationError,
} from '@/errors.js';
import { IdentifierParamsSchema } from '@/schemas.js';

let gameService: GameService;
let server: FastifyInstance;

export async function serverInit(g: GameService) {
    gameService = g;
    await createServer();
    setRoutes();
    startServer();

    return server;
}

async function createServer() {
    server = fastify({
        logger:
            process.env.NODE_ENV === 'dev' ?
                {
                    level: 'info',
                    transport: { target: 'pino-pretty' },
                }
            :   { level: 'info' },
    });

    await server.register(import('@fastify/cors'), {
        origin: true,
    });
}

function setRoutes() {
    server.get('/users/:identifier/games', getGamesList);
}

async function startServer() {
    try {
        await server.listen({ port: 3001, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

async function getGamesList(
    request: FastifyRequest<{ Params: { identifier: string } }>,
    reply: FastifyReply,
) {
    try {
        const credentials = IdentifierParamsSchema.parse(request.params);

        const games = await gameService.getUAgames(credentials);

        return games;
    } catch (err) {
        if (err instanceof z.ZodError) {
            reply.status(400);
            return { error: err.message };
        }

        if (err instanceof SteamUserNotFoundError) {
            server.log.warn(err.message);
            return reply.status(404).send({ error: err.message });
        }

        if (err instanceof SteamApiError) {
            return reply.status(err.statusCode ?? 500).send({ error: err.message });
        }

        if (err instanceof SteamValidationError) {
            return reply
                .status(502)
                .send({ error: 'Steam API returned invalid data' });
        }

        return reply.status(500).send({ error: 'Failed to fetch games data' });
    }
}
