import type { GameWithUa } from '@ua/shared';

interface GamesTableProps {
    games: GameWithUa[];
}

function sortGamesAlphabetically(games: GameWithUa[]): GameWithUa[] {
    return [...games].sort((a, b) => a.name.localeCompare(b.name));
}

export default function GameTable({ games }: GamesTableProps) {
    const sortedGames = sortGamesAlphabetically(games);

    return (
        <section>
            <table className='w-full'>
                <thead>
                    <tr className='border-b'>
                        <th className='px-4 py-2 text-left'>Назва гри</th>
                        <th className='px-4 py-2 text-center'>Субтитри</th>
                        <th className='px-4 py-2 text-center'>Озвучка</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedGames.map((game, index) => (
                        <tr key={index} className='border-b'>
                            <td className='px-4 py-2'>{game.name}</td>
                            <td className='px-4 py-2 text-center'>
                                {game.supports.subtitles ? '✓' : '—'}
                            </td>
                            <td className='px-4 py-2 text-center'>
                                {game.supports.full_audio ? '✓' : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
