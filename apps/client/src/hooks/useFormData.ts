import { useState } from 'react';
import appConfig from '@/constants/appConfig';

type FormEvent = React.FormEvent<HTMLFormElement>;

export interface FormData {
    username: string;
    steamid: string;
}

interface UseFormDataConfig {
    onSubmit: (formData: FormData) => Promise<void>;
}

export interface UseFormDataReturn {
    formData: FormData;
    onChange: (name: string, value: string) => void;
    onSubmit: (e: FormEvent) => Promise<void>;
    isLoading: boolean;
}

export default function useFormData(
    options: UseFormDataConfig,
): UseFormDataReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [lastActiveField, setLastActiveField] = useState<
        'username' | 'steamid' | null
    >(null);

    const [formData, setFormData] = useState<FormData>(
        appConfig.defaultFormData,
    );

    const onChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (value) {
            setLastActiveField(name as 'username' | 'steamid');
        }
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const submitData: FormData = {
            username: lastActiveField === 'username' ? formData.username : '',
            steamid: lastActiveField === 'steamid' ? formData.steamid : '',
        };

        try {
            await options.onSubmit(submitData);
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, onChange, onSubmit, isLoading };
}
