import 'dotenv/config';
import { GameService } from '@/gameService.js';
import { SteamService } from '@/steamService.js';
import { serverInit } from '@/server.js';

(async function main() {
    const steamService = new SteamService();
    const gameService = new GameService(steamService);
    await serverInit(gameService);
})();
