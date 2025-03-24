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
import { Fruit } from '@/state/api'

const colors = ['Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Orange'];

export default function FruitForm() {

    const [fruitName, setFruitName] = useState<string | undefined>(undefined);
    const [color, setColor] = useState<string | undefined>(undefined);
    const [addFruit, { isLoading, isSuccess, isError }] = useCreateFruitMutation();

    const handleSubmit = async () => {
        if (fruitName && color) {
            try {
                const newFruit: Fruit = {
                    name: fruitName,
                    color: color,
                    id: '1234'
                }
                await addFruit(newFruit).unwrap();
                setFruitName('');
                setColor('');
            } catch (e) {
                console.error('Submission failed', e);
            }
        }
    };

    return (
        <VStack className='p-8 w-full gap-4 items-center'>
            <Input>
                <InputField
                    placeholder="Enter fruit name"
                    value={fruitName}
                    onChangeText={setFruitName}
                />
            </Input>
            <Select className="w-full" onValueChange={setColor}>
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
                            <SelectItem key={c} label={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectPortal>
            </Select>

            <Button className='bg-primary-400' onPress={handleSubmit} isDisabled={!fruitName || !color}>
                <Text className='text-typography-0'>{isLoading ? 'Submitting...' : 'Submit'}</Text>
            </Button>
            
            { 
                isSuccess ?
                    <Text>Fruit added!</Text>
                : isError ?
                    <Text>Something went wrong.</Text>
                : <Text></Text>
            }
        </VStack>
    );
};