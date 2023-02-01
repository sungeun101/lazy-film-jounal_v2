import { Box } from '@mui/material';
import StaticShopCard from './StaticShopCard';

// ----------------------------------------------------------------------

type Props = {
  products: any;
  // products: Product[];
  loading: boolean;
};

export default function ShopProductList({ products, loading }: Props) {
  console.log('shops', products);
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
      {products.map((product: any, index: any) => (
        <StaticShopCard key={product.id} product={product} />
      ))}

      {/* {(loading ? [...Array(12)] : products).map((product: any, index: any) =>
        product ? (
          <ShopProductCard key={product.id} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )} */}
    </Box>
  );
}
