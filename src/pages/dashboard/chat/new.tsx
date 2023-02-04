import { useEffect } from 'react';
// @mui
import { Card, Container } from '@mui/material';
// redux
import { useDispatch } from 'src/redux/store';
import { getConversations, getContacts } from 'src/redux/slices/chat';
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
import { ChatSidebar, ChatWindow } from 'src/sections/@dashboard/chat';

// ----------------------------------------------------------------------

Chat.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getContacts());
  }, [dispatch]);

  return (
    <Page title="Chat">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
