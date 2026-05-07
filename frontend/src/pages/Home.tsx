import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import HomePublic from './HomePublic';
import { FightCard } from '../components';

function GottaPay() {
    return <></>;
}

function Home() {
    const { isAuthenticated, login, isPremium } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (access && refresh) {
            login(access, refresh);
            window.history.replaceState({}, '', '/home');
        }
    }, []);

    //idk why is this here
    if (isAuthenticated === null) return null;
    if (!isAuthenticated) return <HomePublic />;

    return (
        <div>
            <FightCard />
        </div>
    );
}

export default Home;
