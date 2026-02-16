import { Stack, Box, Avatar } from '@mui/material';
import { Item } from '../styles/msterials';
import type { userInfo } from '../interfaces';

function UserCard(props: userInfo) {
    return (
        <>
            <Box
                sx={{
                    width: '40%',
                    marginTop: '20%',
                }}
            >
                <Stack spacing={0.5}>
                    <Avatar
                        alt="avatar"
                        sx={{ width: 80, height: 80, alignSelf: 'center' }}
                        src={props.avatar}
                    ></Avatar>
                    <Item> Username </Item>
                    <Item> provider </Item>
                    <Item> payment Stat </Item>
                </Stack>
            </Box>
        </>
    );
}

export default UserCard;
