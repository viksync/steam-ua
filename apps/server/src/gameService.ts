import type { SteamService } from '@/steamService.js';
import type { UaSupportInfo, GameWithUa, UAdata } from '@shared/types';
import type { UserCredentials, GameData } from '@/types/index.js';
import fs from 'node:fs';
import path from 'node:path';

export class GameService {
    private steamService: SteamService;

    constructor(s: SteamService) {
        this.steamService = s;
    }

    private getGameData(appid: number): GameData {
        const data = fs.readFileSync(
            path.join(import.meta.dirname, '../data/apps', `${appid}.json`),
            'utf8',
        );
        return JSON.parse(data);
    }

    private getUaSupportInfo(gameData: GameData): UaSupportInfo | null {
        const supported_languages = gameData.appinfo.common.supported_languages;
        const ua = supported_languages?.ukrainian;

        if (!ua) return null;
        // some games have only supported field and the internet says it's not true
        if (String(Object.keys(ua)) == 'supported') return null;

        return {
            subtitles: ua?.subtitles ? 1 : 0,
            full_audio: ua?.full_audio || 0,
        };
    }

    public async getUAgames(credentials: UserCredentials): Promise<UAdata> {
        const steamid = await this.getSteamId(credentials);

        const ownedGames = await this.steamService.getOwnedGames(steamid!);

        const ua: GameWithUa[] = [];
        const failed: number[] = [];
        let withFull = 0;
        let withSubs = 0;

        for (const game of ownedGames) {
            try {
                const gameData = this.getGameData(game.appid);
                const name = gameData.appinfo.common.name;
                const uaSupportInfo = this.getUaSupportInfo(gameData);

                if (uaSupportInfo) {
                    ua.push({ name, supports: uaSupportInfo });
                    if (uaSupportInfo.full_audio) withFull++;
                    if (uaSupportInfo.subtitles) withSubs++;
                }
            } catch {
                failed.push(game.appid);
            }
        }
        // TODO: check if file exists and log without blocking response
        if (failed.length) {
            setImmediate(() => {
                const missing: number[] = [];
                const invalid: number[] = [];

                failed.forEach((appid) => {
                    const filePath = path.join(
                        import.meta.dirname,
                        '../data/apps',
                        `${appid}.json`,
                    );
                    if (!fs.existsSync(filePath)) {
                        missing.push(appid);
                    } else {
                        invalid.push(appid);
                    }
                });

                if (missing.length)
                    console.warn(`[WARN] Missing json: ${missing}`);
                if (invalid.length)
                    console.warn(`[WARN] Invalid json: ${invalid}`);
            });
        }

        return {
            all: ownedGames.length,
            ua,
            ratio: Math.floor((ua.length / ownedGames.length) * 100),
            withFull,
            withSubs,
        };
    }

    private async getSteamId(credentials: UserCredentials) {
        if (credentials.steamid) return credentials.steamid;

        const vanityUrl = await this.steamService.resolveVanityUrl(
            credentials.username!,
        );

        return vanityUrl.steamid;
    }
}
