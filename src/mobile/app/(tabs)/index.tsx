import BaseView from '@/components/BaseView';
import FruitForm from '@/components/custom/FruitForm';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

export default function HomeScreen() {
  return (
    <BaseView>
      <Box className='flex-1 justify-center items-center w-full'>
        <Heading size="2xl">Welcome</Heading>
        <FruitForm  />
      </Box>
    </BaseView>
  );
}