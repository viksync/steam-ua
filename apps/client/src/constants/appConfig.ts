import type { FormData } from '@/hooks/useFormData';

const env = 'dev';
const serverUrl = env === 'dev' ? 'http://localhost:3001' : '';

const defaultFormData: FormData =
    env === 'dev' ?
        { username: 'unicode2929', steamid: '' }
    :   { username: '', steamid: '' };

export default { serverUrl, defaultFormData };
