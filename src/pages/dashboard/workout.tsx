// @mui
import { Container, Grid, Card } from '@mui/material';
// hooks
import useSettings from 'src/hooks/useSettings';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
// sections
import { EcommerceLatestProducts } from 'src/sections/@dashboard/general/e-commerce';
import WodBoard from 'src/sections/@dashboard/real/workout/WodBoard';
import WodTopFive from 'src/sections/@dashboard/real/workout/WodTopFive';
import { useWodStore } from 'src/zustand/useStore';
import WodChatWindow from 'src/sections/@dashboard/real/workout/WodChatWindow';
// import WodChatSidebar from 'src/sections/@dashboard/real/workout/WodChatSideBar';

// ----------------------------------------------------------------------

RealApp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function RealApp() {
  const { themeStretch } = useSettings();

  const { wod } = useWodStore();

  return (
    <Page title="Real: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ height: '72vh', display: 'flex' }}>
              {/* <WodChatSidebar /> */}
              <WodChatWindow />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <WodBoard />
          </Grid>

          {wod && (
            <Grid item xs={12} md={6} lg={8}>
              <WodTopFive />
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
