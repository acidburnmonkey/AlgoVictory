import { UserCard } from '../components';
import type { userInfo } from '../interfaces';

function Settings() {
    const testProps: userInfo = {
        username: 'Samitius',
        avatar:
            'https://upload.wikimedia.org/wikipedia/commons/1/1b/Samhydetedtalk2070_%28cropped%29.png',
        provider: 'local',
        premium: true,
        payment_date: ' Sun Feb 15 2026',
        payment_expires: 'Jan Dec 17 2027',
    };

    return (
        <>
            <UserCard {...testProps} />
        </>
    );
}

export default Settings;
