import { SteamService } from '@/steamService.js';
import { GameService } from '@/gameService.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PlayerInfo {
    personaname?: string;
    loccountrycode?: string;
}

interface FriendResult {
    steamid: string;
    playerInfo?: PlayerInfo;
    all?: number;
    hasUa?: Array<{
        name: string;
        ua: { subtitles: number; full_audio: number };
    }>;
    percentage?: number;
    full?: number;
    subs?: number;
    error?: string;
}

async function getPlayerSummaries(
    steamids: string[],
    apiKey: string,
): Promise<Map<string, PlayerInfo>> {
    const url = new URL(
        'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
    );
    url.searchParams.set('key', apiKey);
    url.searchParams.set('steamids', steamids.join(','));

    const playerMap = new Map<string, PlayerInfo>();

    try {
        const res = await fetch(url);
        const data = (await res.json()) as { response?: { players?: any[] } };
        const players = data.response?.players || [];

        for (const player of players) {
            playerMap.set(player.steamid, {
                personaname: player.personaname,
                loccountrycode: player.loccountrycode,
            });
        }
    } catch (error) {
        console.error('Error fetching player summaries:', error);
    }

    return playerMap;
}

async function testFriendComparison() {
    // Read mock friend list
    const friendListData = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../data/mockapi/GetFriendList.json'),
            'utf8',
        ),
    );

    const friends = friendListData.friendslist.friends;
    console.log(
        `\n📊 Testing Ukrainian language support across ${friends.length} friends\n`,
    );

    const steamService = new SteamService();
    const gameService = new GameService(steamService);

    // Fetch player info for all friends
    const steamids = friends.map((f: { steamid: string }) => f.steamid);
    const playerInfoMap = await getPlayerSummaries(
        steamids,
        'BDD9CCB873FE240E2CC04E6FDEBC82C1',
    );

    const results: FriendResult[] = [];
    let openProfiles = 0;
    let closedProfiles = 0;

    for (const friend of friends) {
        const playerInfo = playerInfoMap.get(friend.steamid);
        const displayName = playerInfo?.personaname || friend.steamid;
        console.log(`Checking ${displayName}...`);

        try {
            const result = await gameService.getUAgames({
                steamid: friend.steamid,
            });

            results.push({
                steamid: friend.steamid,
                playerInfo,
                ...result,
            });

            openProfiles++;
            console.log(
                `  ✓ ${result.all} games, ${result.ratio}% with UA support`,
            );
        } catch (error) {
            closedProfiles++;
            results.push({
                steamid: friend.steamid,
                playerInfo,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            console.log(`  ✗ Private profile or error`);
        }
    }

    // Sort by percentage (highest first)
    const successfulResults = results
        .filter((r) => r.percentage !== undefined)
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESULTS SUMMARY');
    console.log('='.repeat(60) + '\n');

    console.log(`Total friends: ${friends.length}`);
    console.log(`Open profiles: ${openProfiles}`);
    console.log(`Closed profiles: ${closedProfiles}\n`);

    if (successfulResults.length > 0) {
        console.log('🏆 TOP UKRAINIAN LANGUAGE SUPPORTERS:\n');

        successfulResults.forEach((result, index) => {
            const name = result.playerInfo?.personaname || result.steamid;
            const country =
                result.playerInfo?.loccountrycode ?
                    ` [${result.playerInfo.loccountrycode}]`
                :   '';
            console.log(
                `${index + 1}. ${name}${country} — ${result.all} games, ${result.percentage}% UA`,
            );
        });

        const best = successfulResults[0]!;
        const bestName = best.playerInfo?.personaname || best.steamid;
        console.log(
            `\n🥇 Best supporter: ${bestName} with ${best.percentage!}% UA games`,
        );

        const avgPercentage = Math.round(
            successfulResults.reduce((sum, r) => sum + (r.percentage || 0), 0)
                / successfulResults.length,
        );
        console.log(`📊 Average UA support: ${avgPercentage}%\n`);
    }
}

testFriendComparison().catch(console.error);
