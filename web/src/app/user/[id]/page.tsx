import { apiEndpoints } from '@/utils/constants';
import { client } from '@/utils/helpers';
import { IPageProps, Product } from '@/utils/types';
import UserView from '@/views/UserPage';

export default async function UserPage({ params }: IPageProps) {
  const { id } = await params;

  if (!id) return null;

  const products: Product[] = await client.get(apiEndpoints.allProducts);

  return <UserView userId={id} products={products} />;
}
