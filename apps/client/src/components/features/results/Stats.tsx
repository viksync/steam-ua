import TextCard from '@/components/features/results/TextCard';
import type { GamesWithUA } from '@shared/types';

export default function Statistics({ games }: GamesWithUA) {
    return (
        <section>
            <div className='grid grid-cols-5 gap-4'>
                <TextCard header={'Всього ігор'} content={games.all} />
                <TextCard header={'Є українська'} content={games.ua.length} />
                <TextCard header={'Українською'} content={`${games.ratio}%`} />
                <TextCard header={'Є озвучка'} content={games.withFull} />
                <TextCard header={'Є субтитири'} content={games.withSubs} />
            </div>
        </section>
    );
}
