import z from 'zod';
import {
    SteamApiError,
    SteamValidationError,
    SteamUserNotFoundError,
} from '@/errors.js';
import { SteamGetOwnedGamesSchema, SteamVanityUrlSchema } from '@/schemas.js';
import type { SteamGetOwnedGamesResponse } from '@/types/index.js';

export class SteamService {
    private API_KEY: string;

    constructor() {
        const apiKey = process.env.STEAM_API_KEY;
        if (!apiKey) {
            throw new Error('STEAM_API_KEY environment variable is required');
        }
        this.API_KEY = apiKey;
    }

    public async getOwnedGames(
        steamId: string,
    ): Promise<SteamGetOwnedGamesResponse> {
        const url = new URL(
            'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/',
        );
        url.searchParams.set('key', this.API_KEY);
        url.searchParams.set('steamid', steamId);
        url.searchParams.set('include_appinfo', '1');
        url.searchParams.set('include_played_free_games', '1');

        const response = await this.fetchSteamApi(url);

        if (!response.ok) {
            throw new SteamApiError(
                `GetOwnedGames failed: ${response.status}`,
                response.status,
            );
        }

        return (
            await this.validateSteamApiResponse(
                response,
                'GetOwnedGames',
                SteamGetOwnedGamesSchema,
            )
        ).response.games;
    }

    public async resolveVanityUrl(username: string) {
        const url = new URL(
            'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/',
        );
        url.searchParams.set('key', this.API_KEY);
        url.searchParams.set('vanityurl', username);

        console.log(url);
        const response = await this.fetchSteamApi(url);

        if (!response.ok) {
            throw new SteamApiError(
                `ResolveVanityURL — ${response.status}`,
                response.status,
            );
        }

        const validated = (
            await this.validateSteamApiResponse(
                response,
                'ResolveVanityURL',
                SteamVanityUrlSchema,
            )
        ).response;

        if (validated.success !== 1 || !validated.steamid) {
            throw new SteamUserNotFoundError(username, validated.message);
        }

        return validated;
    }

    private async fetchSteamApi(url: URL) {
        try {
            return await fetch(url);
        } catch (err) {
            throw new SteamApiError(
                `Network error during GetOwnedGames: ${
                    err instanceof Error ? err.message : 'Unknown error'
                }`,
            );
        }
    }

    private async validateSteamApiResponse<T>(
        res: Response,
        method: string,
        schema: z.ZodSchema<T>,
    ): Promise<T> {
        try {
            const data = await res.json();
            return schema.parse(data);
        } catch (err) {
            throw new SteamValidationError(
                `${method} returned unexpected data: ${err}`,
            );
        }
    }
}
