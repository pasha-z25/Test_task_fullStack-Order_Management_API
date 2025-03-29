'use client';

import { getCurrencyValue } from '@/utils/helpers';
import type { Product } from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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

  const selectedProductId = useWatch({
    control,
    name: 'productId',
    defaultValue: NewOrderFormDefaultValues.productId,
  });

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  const quantityOptions = selectedProduct
    ? Array.from({ length: selectedProduct.stock }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`,
      }))
    : [{ value: 1, label: '1' }];

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
          label: `${product.name} (${getCurrencyValue(product.price)}, ${product.stock})`,
        }))}
      />
      <ControlledSelect
        control={control}
        name="quantity"
        label={'quantity'}
        options={quantityOptions}
      />
      <Button type="submit" variant="outlined">
        Save
      </Button>
    </form>
  );
}
