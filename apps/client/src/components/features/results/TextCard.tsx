import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/shadcn/card';

interface TextCardProps {
    header: string;
    content: string | number;
}

export default function TextCard({ header, content }: TextCardProps) {
    return (
        <>
            <Card className='flex flex-col'>
                <CardHeader>
                    <CardTitle>{header}</CardTitle>
                </CardHeader>

                <CardContent className='flex flex-col'>
                    <h1 className='text-4xl font-extrabold tracking-tight'>
                        {content}
                    </h1>
                </CardContent>
            </Card>
        </>
    );
}
