import type { SteamGetOwnedGamesSchema } from '@/schemas.js';
import type z from 'zod';

export interface UserCredentials {
    username?: string | null;
    steamid?: string | null;
}

export interface GameData {
    appinfo: {
        common: {
            name: string;
            supported_languages?: {
                ukrainian?: {
                    supported?: string;
                    subtitles?: number;
                    full_audio?: number;
                };
            };
        };
    };
}

export type SteamGetOwnedGamesResponse = z.infer<
    typeof SteamGetOwnedGamesSchema
>['response']['games'];
