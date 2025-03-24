import BaseView from '@/components/BaseView';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useDeleteFruitMutation, useGetFruitQuery, useGetFruitsQuery } from '@/state/api';

export default function ExploreScreen() {

  const {
    data: fruits,
  } = useGetFruitsQuery();

  const [deleteFruits] = useDeleteFruitMutation();

  return (
    <BaseView>
      <VStack className='p-8 w-full flex-1 gap-4 items-center'>
        <VStack className='w-full gap-4 items-center flex-1'>
          <Heading size="2xl">Fruits</Heading>
          <Heading size="xs">(Yeah, baby)</Heading>
          {
            fruits?.map((fruit, index) => (
              <Box key={index} className='bg-gray-100 p-4 rounded-lg flex flex-row gap-4'>
                <Text className='text-primary-300'>{fruit.name}</Text>
                <Text className='text-secondary-900'>{fruit.color}</Text>
              </Box>
            ))
          }
        </VStack>
        <VStack>
          <Button className='bg-primary-400' onPress={() => {deleteFruits("example")}}><ButtonText>Clear</ButtonText></Button>
        </VStack>
      </VStack>
    </BaseView>
  );
}