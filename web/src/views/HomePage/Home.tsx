import type { User } from '@/utils/types';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface IPageProps {
  users: User[];
}

const renderUserCard = (user: User) => {
  return (
    <div>
      <Typography>{user.name}</Typography>
    </div>
  );
};

export default function Home({ users }: IPageProps) {
  return (
    <section className="home-section py-12">
      <div className="container mx-auto px-4">
        <Typography variant="h4" component="h2" className="!mb-8">
          All users
        </Typography>
        <List className="grid gap-4">
          {!!users?.length &&
            users.map((user: User) => (
              <ListItem key={user.id} className="!p-0">
                <Link href={`/user/${user.id}`} className="flex-auto">
                  <Card>
                    <CardContent>{renderUserCard(user)}</CardContent>
                  </Card>
                </Link>
              </ListItem>
            ))}
        </List>
      </div>
    </section>
  );
}
