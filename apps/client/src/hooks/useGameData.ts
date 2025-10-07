import { useState } from 'react';
import type { FormData } from '@/hooks/useFormData';

export default function useGameData(serverUrl: string) {
    const [gamesData, setGamesData] = useState(null);

    async function fetchGames(formData: FormData) {
        const username = formData.username;
        const steamid = formData.steamid;

        if (!steamid && !username) {
            throw new Error('Either steamid or username is required');
        }

        const identifier = steamid || username;
        const url = `${serverUrl}/users/${identifier}/games`;

        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.error || `HTTP error! status: ${response.status}`,
            );
        }
        const games = await response.json();

        setGamesData(games);
        return games;
    }

    return { gamesData, fetchGames };
}
