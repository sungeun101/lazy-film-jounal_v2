// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// layouts
import Layout from '../../layouts';
// components
import Page from '../../components/Page';
// sections
import { AppWelcome } from '../../sections/@dashboard/general/app';
import { EcommerceLatestProducts } from '../../sections/@dashboard/general/e-commerce';
import useUser from 'src/libs/client/useUser';
import WodBoard from 'src/sections/@dashboard/real/workout/WodBoard';
import WodTopFive from 'src/sections/@dashboard/real/workout/WodTopFive';

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useUser();

  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WodBoard />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <AppWelcome displayName={user?.name} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <WodTopFive />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
