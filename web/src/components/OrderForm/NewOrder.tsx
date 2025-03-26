'use client';

import { getCurrencyValue } from '@/utils/helpers';
import type { Product } from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  NewOrderFormDefaultValues,
  NewOrderFormSchema,
  NewOrderFormType,
} from './schemas';

import Button from '@mui/material/Button';
import ControlledSelect from './ControlledSelect';

type NewOrderType = {
  userId: string;
  productId: string;
  quantity: number;
};

interface IFormProps {
  formHandler(order: NewOrderType): void;
  userId: string;
  products: Product[];
}

export default function AddOrder({
  formHandler,
  userId,
  products,
}: IFormProps) {
  const { control, handleSubmit } = useForm<NewOrderFormType>({
    resolver: zodResolver(NewOrderFormSchema),
    defaultValues: NewOrderFormDefaultValues,
  });

  const submitHandler = ({ productId, quantity }: NewOrderFormType) => {
    formHandler({ userId, productId, quantity });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="my-6 grid gap-4">
      <ControlledSelect
        control={control}
        name="productId"
        label={'productId'}
        options={products.map((product) => ({
          value: product.id,
          label: `${product.name} (${getCurrencyValue(product.price)})`,
        }))}
      />
      <ControlledSelect
        control={control}
        name="quantity"
        label={'quantity'}
        options={[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
        ]}
      />
      <Button type="submit" variant="outlined">
        Save
      </Button>
    </form>
  );
}
