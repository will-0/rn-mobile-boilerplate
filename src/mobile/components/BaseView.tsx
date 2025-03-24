import { ReactNode } from 'react';
import { StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BaseViewProps {
    children: ReactNode;
    style?: ViewStyle;
}

const baseViewStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    subContainer: {
        flex: 1
    }
});

export default function BaseView({ children, style }: BaseViewProps) {

    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'light' ? 'light' : 'dark';

    return (
        <SafeAreaView edges={['right', 'top', 'left']} className={`flex-1 bg-background-${bgColor}`} style={baseViewStyles.safeArea}>
            <View style={baseViewStyles.subContainer}>
                {children}
            </View>
        </SafeAreaView>
    );
}