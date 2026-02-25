import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';

function Home() {
    const { isAuthenticated, login, user } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (access && refresh) {
            console.debug('access token from social: ', access);
            login(access, refresh);
            window.history.replaceState({}, '', '/home');
        }
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <div>
                {isAuthenticated ? (
                    <h2> You are authenticated as {user}</h2>
                ) : (
                    <h2> You are NOT authenticated </h2>
                )}
            </div>
        </div>
    );
}

export default Home;
