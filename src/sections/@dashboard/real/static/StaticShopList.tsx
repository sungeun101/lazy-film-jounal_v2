import { Box } from '@mui/material';
import StaticShopCard from './StaticShopCard';

// ----------------------------------------------------------------------

type Props = {
  shops: any;
};

export default function StaticShopList({ shops }: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {shops.map((product: any) => (
        <StaticShopCard key={product.id} product={product} />
      ))}
    </Box>
  );
}
