import React, { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useCreateFruitMutation } from '@/state/api';
import { FormControl, FormControlLabel, FormControlLabelText } from '../ui/form-control';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/components/ui/select";
import { ChevronDownIcon } from '../ui/icon';


const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange"
]

export default function FruitForm() {

    const [fruitName, setFruitName] = useState('');
    const [color, setColor] = useState(colors[0]);
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
        <VStack className='p-8 w-full gap-4'>
            <Input>
                <InputField
                    placeholder="Enter fruit name"
                    value={fruitName}
                    onChangeText={setFruitName}
                />
            </Input>
            <Select className="flex-0">
                <SelectTrigger variant="outline" size="md" >
                    <SelectInput className='flex-1' placeholder="Select option" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {colors.map((c) => (
                            <SelectItem
                                label={c}
                                key={c}
                                value={c}
                            />
                        ))}
                    </SelectContent>
                </SelectPortal>
            </Select>

            <Button className='bg-primary-400' onPress={handleSubmit} isDisabled={isLoading || !fruitName || !color}>
                <Text className='text-typography-0'>{isLoading ? 'Submitting...' : 'Submit'}</Text>
            </Button>

            {isSuccess && <Text>Fruit added!</Text>}
            {isError && <Text>Something went wrong.</Text>}
        </VStack>
    );
};