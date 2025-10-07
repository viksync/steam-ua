import { useLocation, Navigate } from 'react-router-dom';
import Stats from '@/components/features/results/Stats';
import GameTable from '@/components/features/results/GameTable';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { games } = location.state || {};

    if (!games) {
        return <Navigate to='/' replace />;
    }

    return (
        <div className='w-full max-w-5xl space-y-8'>
            <div className='flex items-center gap-3'>
                <button
                    onClick={() => navigate(-1)}
                    className='-ml-12 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                    aria-label='Go back'
                >
                    <ArrowLeft className='h-6 w-6' />
                </button>
                <h1 className='text-3xl font-bold'>Результати</h1>
            </div>
            <Stats games={games} />
            <GameTable games={games.ua} />
        </div>
    );
}
