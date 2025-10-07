import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/shadcn/card';
import { Input } from '@/components/ui/shadcn/input';

interface SteamIdInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function SteamIdInput({ value, onChange }: SteamIdInputProps) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    Найпростіше знайти свій Steam ID на цьому сайті:{' '}
                    <a
                        href='https://steamid.xyz'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 underline hover:text-blue-600'
                    >
                        steamid.xyz
                    </a>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Input
                    id='form-steamid'
                    name='steamid'
                    placeholder='Вставляй його сюди'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    minLength={17}
                    maxLength={17}
                    pattern='[0-9]{17}'
                    title='Steam ID has to contain exactly 17 numbers'
                    required
                />
            </CardContent>
        </Card>
    );
}
