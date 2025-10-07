import z from 'zod';

export const SteamGetOwnedGamesSchema = z.object({
    response: z.object({
        game_count: z.number(),
        games: z.array(
            z
                .object({
                    appid: z.number(),
                })
                .loose(),
        ),
    }),
});

export const SteamVanityUrlSchema = z.object({
    response: z.object({
        success: z.number(),
        steamid: z.string().optional(),
        message: z.string().optional(),
    }),
});

export const IdentifierParamsSchema = z
    .object({
        identifier: z
            .string()
            .refine(
                (val) => /^\d{17}$/.test(val) || /^[a-zA-Z0-9_-]+$/.test(val),
                {
                    message: 'Must be a valid 17-digit Steam ID or username',
                },
            ),
    })
    .transform((data) => {
        const isSteamId = /^\d{17}$/.test(data.identifier);
        return {
            username: isSteamId ? null : data.identifier,
            steamid: isSteamId ? data.identifier : null,
        };
    });
