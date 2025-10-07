import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function Header() {
    return (
        <header className='flex items-center justify-between p-4'>
            <div className='logo'>
                <a href='https://pawer.tools/'>
                    <img
                        src='/images/paw.png'
                        alt='Pawer Tools logo'
                        width='20'
                        height='20'
                        className='object-contain dark:invert'
                    />
                </a>
            </div>
            <ThemeSwitcher />
        </header>
    );
}
