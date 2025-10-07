import { Card, CardContent, CardFooter } from '@/components/ui/shadcn/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/shadcn/tabs';
import { UsernameInput } from '@/components/features/form/UsernameInput';
import { SteamIdInput } from '@/components/features/form/SteamIdInput';
import { Button } from '@/components/ui/shadcn/button';
import type { UseFormDataReturn } from '@/hooks/useFormData';

interface UserFormProps extends UseFormDataReturn {
    error?: string | null;
}

export default function UserForm(props: UserFormProps) {
    const { formData, onChange, onSubmit, isLoading, error } = props;

    return (
        <Card className='w-96 shadow-xl'>
            <form onSubmit={onSubmit}>
                <CardContent>
                    <Tabs defaultValue='username'>
                        <TabsList>
                            <TabsTrigger value='username'>Юзернейм</TabsTrigger>
                            <TabsTrigger value='steamid'>Steam ID</TabsTrigger>
                        </TabsList>

                        <TabsContent value='username'>
                            <UsernameInput
                                value={formData.username}
                                onChange={(value) =>
                                    onChange('username', value)
                                }
                            />
                        </TabsContent>

                        <TabsContent value='steamid'>
                            <SteamIdInput
                                value={formData.steamid}
                                onChange={(value) => onChange('steamid', value)}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className='flex-col items-center space-y-4 pt-6'>
                    <Button type='submit' disabled={isLoading}>
                        {isLoading ? 'Аналізую...' : 'Показати'}
                    </Button>
                    {error && <p className='text-sm text-red-400'>{error}</p>}
                </CardFooter>
            </form>
        </Card>
    );
}
