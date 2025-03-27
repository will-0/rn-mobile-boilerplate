import BaseView from '@/components/BaseView';
import LoginButton from '@/components/custom/LoginButton';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';

const redirectUri = AuthSession.makeRedirectUri();

export default function InitialScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            router.navigate('/(tabs)/home')
        }
    }, [isLoggedIn]);

    return (
        <BaseView>
            <Box className='flex-1 justify-center items-center w-full gap-4'>
                <Heading size="2xl">Welcome to the app!</Heading>
                <LoginButton
                    auth_endpoint='http://localhost:5176/default/authorize'
                    token_endpoint='http://localhost:5176/default/token'
                    client_id='0000-0000'
                    redirect_uri={redirectUri}
                    scopes={['openid', 'profile', 'email', 'offline_access']}
                    setIsLoggedIn={setIsLoggedIn}
                />
            </Box>
        </BaseView>
    );
}