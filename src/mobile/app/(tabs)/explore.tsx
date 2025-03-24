import BaseView from '@/components/BaseView';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useGetFruitQuery, useGetFruitsQuery } from '@/state/api';

export default function ExploreScreen() {

  const {
    data: fruits,
  } = useGetFruitsQuery();


  return (
    <BaseView>
      <Box className='flex-1 justify-center items-center gap-4'>
        <Heading size="2xl">Fruits</Heading>
        <Heading size="xs">(Yeah, baby)</Heading>
        {
          fruits?.map((fruit) => (
            <Box key={fruit.id} className='bg-gray-100 p-4 rounded-lg flex flex-row gap-4'>
              <Text className='text-primary-300'>{fruit.name}</Text>
              <Text className='text-secondary-900'>{fruit.color}</Text>
            </Box>
          ))
        }
      </Box>
    </BaseView>
  );
}