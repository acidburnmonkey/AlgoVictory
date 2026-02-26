import { useEffect, useState } from 'react';
import api from '../api';
import { UserCard } from '../components';
import type { userInfo } from '../interfaces';

function Settings() {
    const [userDetails, setUserDetails] = useState<userInfo | null>(null);

    const blankProps: userInfo = {
        username: 'err loading',
        avatar:
            'https://upload.wikimedia.org/wikipedia/commons/1/1b/Samhydetedtalk2070_%28cropped%29.png',
        provider: 'local',
        premium: true,
        payment_date: '',
        payment_expires: '',
    };

    const getUserDetails = async () => {
        await api
            .get('/api/user-info/')
            .then((res) => {
                if (res.status === 200) {
                    setUserDetails(res.data);

                    console.debug('getUserDetails : ', res.data);
                }
            })
            .catch((err) => console.error('failed at getUserDetails: ', err));
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <>
            {userDetails ? (
                <UserCard {...userDetails} />
            ) : (
                <UserCard {...blankProps} />
            )}
        </>
    );
}

export default Settings;
