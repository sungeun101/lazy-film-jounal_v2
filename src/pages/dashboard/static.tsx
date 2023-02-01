import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container, Typography, Stack, Grid } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { getProducts, filterProducts } from 'src/redux/slices/product';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// @types
import { Product, ProductFilter } from 'src/@types/product';
// hooks
import useSettings from 'src/hooks/useSettings';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// components
import { FormProvider } from 'src/components/hook-form';
import Page from 'src/components/Page';
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopProductSearch,
} from 'src/sections/@dashboard/e-commerce/shop';
import CartWidget from 'src/sections/@dashboard/e-commerce/CartWidget';
import StaticShopSearch from 'src/sections/@dashboard/real/static/StaticShopSearch';
import { shops } from 'mock/shops.json';

// shops will be populated at build time by getStaticProps()
function StaticShop({ shops }: any) {
  const { themeStretch } = useSettings();

  const [openFilter, setOpenFilter] = useState(false);

  const { sortBy, filters } = useSelector((state) => state.product);

  //   const [products, setProducts] = useState<any>(shops);

  //   const filteredProducts = applyFilter(products, sortBy, filters);

  const defaultValues = {
    gender: filters.gender,
    category: filters.category,
    colors: filters.colors,
    priceRange: filters.priceRange,
    rating: filters.rating,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault =
    !values.priceRange &&
    !values.rating &&
    values.gender.length === 0 &&
    values.colors.length === 0 &&
    values.category === 'All';

  //   useEffect(() => {
  //     dispatch(getProducts());
  //   }, [dispatch]);

  //   useEffect(() => {
  //     dispatch(filterProducts(values));
  //   }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveGender = (value: string) => {
    const newValue = filters.gender.filter((item) => item !== value);
    setValue('gender', newValue);
  };

  const handleRemoveCategory = () => {
    setValue('category', 'All');
  };

  const handleRemoveColor = (value: string) => {
    const newValue = filters.colors.filter((item) => item !== value);
    setValue('colors', newValue);
  };

  const handleRemovePrice = () => {
    setValue('priceRange', '');
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };

  return (
    <Page title="Static Shops">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Shop"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Shop' },
          ]}
        />
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <StaticShopSearch />
        </Stack>
      </Container>
    </Page>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async (context) => {
  // By returning { props: { shops } }, the Blog component
  // will receive `shops` as a prop at build time
  return {
    props: {
      shops,
    },
  };
};

export default StaticShop;

// ----------------------------------------------------------------------

function applyFilter(products: Product[], sortBy: string | null, filters: ProductFilter) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = products.filter((product) => filters.gender.includes(product.gender));
  }
  if (filters.category !== 'All') {
    products = products.filter((product) => product.category === filters.category);
  }
  if (filters.colors.length > 0) {
    products = products.filter((product) =>
      product.colors.some((color: any) => filters.colors.includes(color))
    );
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === 'below') {
        return product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  if (filters.rating) {
    products = products.filter((product) => {
      const convertRating = (value: string) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}
