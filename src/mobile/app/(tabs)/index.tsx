import BaseView from '@/components/BaseView';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Image, StyleSheet, Platform } from 'react-native';

export default function HomeScreen() {
  return (
    <BaseView>
      <Box className='flex flex-col items-center justify-center'>
        <Text>Hello world!</Text>
      </Box>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
