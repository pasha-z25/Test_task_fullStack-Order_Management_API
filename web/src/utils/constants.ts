import { ApiEndpoints } from './types';

export const DOCKER_API_URL =
  process.env.API_URL || 'http://backend_server:8888';

export const BROWSER_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export const apiEndpoints: ApiEndpoints = {
  allUsers: '/users',
  oneUser: (id: string | number) => `/users/${id}`,
  allOrders: '/orders',
  userOrders: (userId: string) => `/orders/${userId}`,
  allProducts: '/products',
};
