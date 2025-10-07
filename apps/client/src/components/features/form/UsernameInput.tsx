import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/shadcn/card';
import { Input } from '@/components/ui/shadcn/input';

interface UsernameInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function UsernameInput({ value, onChange }: UsernameInputProps) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    Це не логін, а нік з публічного посилання на профіль.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Input
                    id='from-username'
                    name='username'
                    placeholder='Вставляй його сюди'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    minLength={3}
                    maxLength={32}
                    autoCapitalize='none'
                    spellCheck='false'
                    pattern='[a-zA-Z0-9_\-]+'
                    title='Steam username can only contain letters, numbers, underscores, and dashes'
                    required
                />
            </CardContent>
        </Card>
    );
}
