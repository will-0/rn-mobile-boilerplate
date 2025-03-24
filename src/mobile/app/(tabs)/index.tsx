import BaseView from '@/components/BaseView';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

export default function HomeScreen() {
  return (
    <BaseView>
      <Box className='flex-1 justify-center items-center'>
        <Heading size="2xl">Welcome</Heading>
      </Box>
    </BaseView>
  );
}