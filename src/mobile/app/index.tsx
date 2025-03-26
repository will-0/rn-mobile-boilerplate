import BaseView from '@/components/BaseView';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useFocusEffect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function InitialScreen() {


    // const [isLoggedIn, setIsLoggedIn] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsLoggedIn(true);
    //     }, 1000);
    // })

    // useFocusEffect(() => {
    //     if (isLoggedIn) {
    //         router.navigate('/(tabs)');
    //     } else {
    //         router.navigate('/login');
    //     }
    // });

    const router = useRouter();
    return (
        <BaseView>
            <Box className='flex-1 justify-center items-center w-full gap-4'>
                <Heading size="2xl">Welcome to the app!</Heading>
                <Button onPress={() => { router.navigate('/(tabs)/home') }}>
                    <ButtonText>Login</ButtonText>
                </Button>
            </Box>
        </BaseView>
    );
}