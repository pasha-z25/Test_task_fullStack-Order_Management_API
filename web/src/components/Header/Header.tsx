import Store from '@mui/icons-material/Store';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-b-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <Store />
          <Link href={'/'}>
            <Typography>Home</Typography>
          </Link>
        </div>
      </div>
    </header>
  );
}
