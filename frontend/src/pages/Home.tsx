import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import HomePublic from './HomePublic';
import { FightCard } from '../components';

function Home() {
    const { isAuthenticated, login, user } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (access && refresh) {
            login(access, refresh);
            window.history.replaceState({}, '', '/home');
        }
    }, []);

    if (isAuthenticated === null) return null;

    if (!isAuthenticated) return <HomePublic />;

    return (
        <div>
            <h1>Home</h1>
            <h2>You are authenticated as {user}</h2>
            <FightCard />
        </div>
    );
}

export default Home;
