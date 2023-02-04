// next
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// _mock_
import { _invoices } from 'src/_mock';
// hooks
import useSettings from 'src/hooks/useSettings';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import Invoice from 'src/sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

InvoiceDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const invoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: invoice?.invoiceNumber || '' },
          ]}
        />

        <Invoice invoice={invoice} />
      </Container>
    </Page>
  );
}
