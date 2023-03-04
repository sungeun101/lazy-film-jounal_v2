// @mui
import { Container, Grid, Card } from '@mui/material';
// hooks
import useSettings from 'src/hooks/useSettings';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
// sections
import WodBoard from 'src/sections/@dashboard/real/workout/WodBoard';
import WodChatWindow from 'src/sections/@dashboard/real/workout/WodChatWindow';
import WodTopFive from 'src/sections/@dashboard/real/workout/WodTopFive';
import WodFeatured from 'src/sections/@dashboard/real/workout/WodFeatured';
import { useWodStore } from 'src/zustand/useStore';

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
          <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
            <WodBoard />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '72vh', display: 'flex' }}>
              <WodChatWindow />
            </Card>
          </Grid>
          {wod && (
            <Grid item xs={12} md={6}>
              <WodTopFive />
            </Grid>
          )}
          <Grid item xs={12} md={wod ? 6 : 12}>
            <WodFeatured />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
