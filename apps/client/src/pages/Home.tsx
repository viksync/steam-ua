import { useNavigate } from 'react-router-dom';
import UserForm from '@/components/features/form/UserForm';
import useFormData from '@/hooks/useFormData';
import useGameData from '@/hooks/useGameData';
import config from '@/constants/appConfig';
import { useState } from 'react';

export default function HomePage() {
    const navigate = useNavigate();
    const { fetchGames } = useGameData(config.serverUrl);
    const [error, setError] = useState<string | null>(null);

    const userForm = useFormData({
        onSubmit: async (formData) => {
            setError(null);
            try {
                const games = await fetchGames(formData);
                if (games) {
                    navigate('/results', {
                        state: {
                            games,
                        },
                    });
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                setError(errorMessage);
                console.error(errorMessage);
            }
        },
    });

    return (
        <div className='flex flex-col items-center space-y-12 pt-8'>
            <h1 className='text-4xl font-bold'>
                Скільки твоїх ігор мають українську?
            </h1>
            <UserForm {...userForm} error={error} />
        </div>
    );
}
