import { z } from 'zod';
//userId, productId, quantity

export const NewOrderFormSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number(),
});

export type NewOrderFormType = z.infer<typeof NewOrderFormSchema>;

export const NewOrderFormDefaultValues: NewOrderFormType = {
  productId: '',
  quantity: 0,
};
