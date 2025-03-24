import React, { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useCreateFruitMutation } from '@/state/api';

export default function FruitForm() {

  const [fruitName, setFruitName] = useState('');
  const [color, setColor] = useState('');
  const [addFruit, { isLoading, isSuccess, isError }] = useCreateFruitMutation();

  const handleSubmit = async () => {
    if (fruitName && color) {
      try {
        await addFruit({ name: fruitName, color }).unwrap();
        setFruitName('');
        setColor('');
      } catch (e) {
        console.error('Submission failed', e);
      }
    }
  };

  return (
    <VStack space="md">
      <Input>
        <InputField
          placeholder="Enter fruit name"
          value={fruitName}
          onChangeText={setFruitName}
        />
      </Input>

      <RadioGroup value={color} onChange={setColor} accessibilityLabel="Select fruit color">
        <Radio value="Red" size="md">
          <Text>Red</Text>
        </Radio>
        <Radio value="Green" size="md">
          <Text>Green</Text>
        </Radio>
        <Radio value="Yellow" size="md">
          <Text>Yellow</Text>
        </Radio>
        <Radio value="Purple" size="md">
          <Text>Purple</Text>
        </Radio>
        <Radio value="Orange" size="md">
          <Text>Orange</Text>
        </Radio>
      </RadioGroup>

      <Button onPress={handleSubmit} isDisabled={isLoading || !fruitName || !color}>
        <Text>{isLoading ? 'Submitting...' : 'Submit'}</Text>
      </Button>

      {isSuccess && <Text>Fruit added!</Text>}
      {isError && <Text>Something went wrong.</Text>}
    </VStack>
  );
};