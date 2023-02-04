// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// hooks
import useSettings from 'src/hooks/useSettings';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from 'src/sections/@dashboard/invoice/new-edit-form';

// ----------------------------------------------------------------------

InvoiceCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function InvoiceCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Invoices: Create a new invoice">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new invoice"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Invoices', href: PATH_DASHBOARD.invoice.list },
            { name: 'New invoice' },
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </Page>
  );
}
