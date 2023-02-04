// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Container, CardContent } from '@mui/material';
// routes
import { PATH_PAGE } from 'src/routes/paths';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
import CopyClipboard from 'src/components/CopyClipboard';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

// ----------------------------------------------------------------------

DemoCopyToClipboard.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function DemoCopyToClipboard() {
  return (
    <Page title="Components: Copy To Clipboard">
      <RootStyle>
        <Box
          sx={{
            pt: 6,
            pb: 1,
            mb: 10,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
          }}
        >
          <Container>
            <HeaderBreadcrumbs
              heading="Copy To Clipboard"
              links={[
                { name: 'Components', href: PATH_PAGE.components },
                { name: 'Copy To Clipboard' },
              ]}
              moreLink="https://www.npmjs.com/package/react-copy-to-clipboard"
            />
          </Container>
        </Box>

        <Container>
          <Card>
            <CardContent>
              <CopyClipboard value="https://www.npmjs.com/package/react-copy-to-clipboard" />
            </CardContent>
          </Card>
        </Container>
      </RootStyle>
    </Page>
  );
}
