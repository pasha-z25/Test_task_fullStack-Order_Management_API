/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyObj = {
  [key: string]: any;
};

export interface IPageProps {
  params: Promise<{
    id?: string;
  }>;
  searchParams: Promise<AnyObj>;
}

export interface ApiOptionsType extends RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
}

export interface ApiClient {
  (path: string, options?: ApiOptionsType): Promise<any>;
  get: (endpoint: string, config?: ApiOptionsType) => Promise<any>;
  post: (
    endpoint: string,
    body: BodyInit,
    config?: ApiOptionsType
  ) => Promise<any>;
  delete: (endpoint: string, config?: ApiOptionsType) => Promise<any>;
  patch: (
    endpoint: string,
    body: BodyInit,
    config?: ApiOptionsType
  ) => Promise<any>;
}

export interface ApiEndpoints {
  allUsers: string;
  oneUser: (id: string) => string;
  allOrders: string;
  userOrders: (id: string) => string;
  allProducts: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  balance: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type Order = {
  id: string;
  user: User;
  userId: string;
  product: Product;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date | string;
};
