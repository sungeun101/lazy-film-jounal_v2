import { Box, Divider } from '@mui/material';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';

// ----------------------------------------------------------------------

export default function WodChatWindow() {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <ChatMessageList />

      <Divider />

      <ChatMessageInput />
    </Box>
  );
}
