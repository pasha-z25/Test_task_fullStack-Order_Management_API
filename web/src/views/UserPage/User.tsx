'use client';

import AddOrderForm from '@/components/OrderForm';
import { apiEndpoints } from '@/utils/constants';
import { client, getCurrencyValue } from '@/utils/helpers';
import type { Order, Product, User } from '@/utils/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface IPageProps {
  userId: string;
  products: Product[];
}

type NewOrderType = {
  userId: string;
  productId: string;
  quantity: number;
};

const renderOrderCard = (order: Order) => (
  <div className="grid grid-cols-2 gap-2" data-order-id={order.id}>
    <Typography className="col-span-2 mb-2">Order:</Typography>
    <Typography>{order.product.name}</Typography>
    <Typography className="text-right">
      {order.quantity} * {getCurrencyValue(order.product.price)}
    </Typography>
    <hr className="col-span-2 my-1" />
    <Typography>Total Price:</Typography>
    <Typography className="text-right">
      {getCurrencyValue(order.totalPrice)}
    </Typography>
  </div>
);

export default function UserPage({ userId, products = [] }: IPageProps) {
  const [user, setUser] = useState<User>();
  const [orders, setOrders] = useState<Order[]>([]);

  const { data: fetchedUser, mutate: mutateUser } = useSWR(
    apiEndpoints.oneUser(userId),
    client
  );

  const { data: fetchedOrders, mutate: mutateOrders } = useSWR(
    apiEndpoints.userOrders(userId),
    client
  );

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
    if (fetchedOrders) {
      setOrders(fetchedOrders);
    }
  }, [fetchedUser, fetchedOrders]);

  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);

  const submitNewOrder = (order: NewOrderType) => {
    client
      .post(apiEndpoints.allOrders, JSON.stringify(order))
      .then((order) => {
        if (order.createdAt) {
          mutateUser();
          mutateOrders();
        }
      })
      .catch(console.error);
  };

  if (!user) return null;

  return (
    <section className="user-section py-12">
      <div className="container mx-auto px-4">
        <Typography variant="h4" component="h2" className="!mb-8">
          {user.name}
        </Typography>
        <Typography variant="h6" component="h4" className="!mb-2">
          Email: <Link href={`mailto:${user.email}`}>{user.email}</Link>{' '}
        </Typography>
        <Typography variant="h6" component="h4" className="!mb-2">
          Balance: {getCurrencyValue(user.balance)}
        </Typography>
        {orders?.length ? (
          <List className="!mb-6 grid gap-4">
            {!!orders?.length &&
              orders.map((order: Order) => (
                <ListItem key={order.id} className="!p-0">
                  <Card className="flex-auto">
                    <CardContent>{renderOrderCard(order)}</CardContent>
                  </Card>
                </ListItem>
              ))}
          </List>
        ) : (
          <>
            <hr className="my-1" />
            <Typography className="my-1">User has no orders</Typography>
            <hr className="my-1" />
          </>
        )}
        {showOrderForm ? (
          <AddOrderForm
            formHandler={(order: NewOrderType) => {
              submitNewOrder(order);
              setShowOrderForm(false);
            }}
            userId={user.id}
            products={products}
          />
        ) : (
          <Button
            variant="outlined"
            onClick={() => {
              setShowOrderForm(true);
            }}
          >
            Add new order
          </Button>
        )}
      </div>
    </section>
  );
}
