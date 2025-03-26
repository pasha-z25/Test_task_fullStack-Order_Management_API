import Typography from '@mui/material/Typography';

export default async function Footer() {
  return (
    <footer className="border-t border-t-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div>
          <Typography>
            {new Date().getFullYear()} © All right are reserved
          </Typography>
        </div>
      </div>
    </footer>
  );
}
