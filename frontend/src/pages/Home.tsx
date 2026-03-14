import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

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

        console.log('onLoad');
        console.log('isAuthenticated', isAuthenticated);
        console.log('user', user);
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
            <div>
                <nav>
                    <Link to="/home">| Home |</Link>
                    <Link to="/login">| login |</Link>
                    <Link to="/register">| Register |</Link>
                    <Link to="/terms-of-service">| terms-of-service |</Link>
                    <Link to="/privacy-policy">| privacy-policy |</Link>
                </nav>
            </div>
        </div>
    );
}

export default Home;
