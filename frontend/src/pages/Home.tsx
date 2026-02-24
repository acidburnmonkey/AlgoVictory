import { useState, useEffect } from 'react';
import api from '../api';
import type { AxiosResponse } from 'axios';
import type { userInfo } from '../interfaces';
import { useAuth } from '../components/AuthContext';

function Home() {
    const { isAuthenticated } = useAuth();
    const [user, setUser] = useState('');

    //for testing remove after moving to protected routs
    const checkAuth = async () => {
        try {
            const response: AxiosResponse = await api.get('/api/user-info/');
            console.log('response user-info:', response);

            if (response.status === 200) {
                const data: userInfo = response.data;
                setUser(data.username);
            }
        } catch (err) {
            console.log('err', err);
        }
    };

    useEffect(() => {
        checkAuth();
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
