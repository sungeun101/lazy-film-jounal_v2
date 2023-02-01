import { GetStaticProps } from 'next';
// @mui
import { Container, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// layouts
import Layout from '../../layouts';
// components
import Page from 'src/components/Page';
// sections
import StaticShopSearch from 'src/sections/@dashboard/real/static/StaticShopSearch';
import { shops } from 'mock/shops.json';
import StaticShopList from 'src/sections/@dashboard/real/static/StaticShopList';

// ----------------------------------------------------------------------

StaticShop.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

// shops will be populated at build time by getStaticProps()
function StaticShop({ shops }: any) {
  const { themeStretch } = useSettings();

  return (
    <Page title="Static Shops">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Shop"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Shop' }]}
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

        <StaticShopList shops={shops} />
      </Container>
    </Page>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async (context) =>
  // By returning { props: { shops } }, the Blog component
  // will receive `shops` as a prop at build time
  ({
    props: {
      shops,
    },
  });

export default StaticShop;

// ----------------------------------------------------------------------
