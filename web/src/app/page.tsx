import { apiEndpoints } from '@/utils/constants';
import { client } from '@/utils/helpers';
import type { User } from '@/utils/types';

import HomePage from '@/views/HomePage';

export default async function Home() {
  const users: User[] = await client.get(apiEndpoints.allUsers);

  if (!users) return null;

  return <HomePage users={users} />;
}
