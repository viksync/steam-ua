import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex flex-1 justify-center gap-8 p-8'>
                {children}
            </main>
            <Footer />
        </div>
    );
}
