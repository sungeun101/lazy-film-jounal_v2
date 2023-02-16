// next
import Router, { useRouter } from 'next/router';
//
import { useEffect, useState } from 'react';
// @mui
import { Box, Divider } from '@mui/material';
// redux
import { RootState, useDispatch, useSelector } from 'src/redux/store';
import {
  addRecipients,
  onSendMessage,
  getConversation,
  getParticipants,
  markConversationAsRead,
  resetActiveConversation,
} from 'src/redux/slices/chat';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';
// @types
import { Conversation, Participant, SendMessage } from 'src/@types/chat';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';
import { useMessageStore } from 'src/zustand/useStore';

// ----------------------------------------------------------------------

export default function WodChatWindow() {
  const { pathname } = useRouter();

  const { participants } = useSelector((state: RootState) => state.chat);

  const displayParticipants = participants.filter(
    (item) => item.id !== '8864c717-587d-472a-929a-8e5f298024da-0'
  );

  const { messages } = useMessageStore();

  useEffect(() => {
    console.log('messages', messages);
  }, [messages]);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={displayParticipants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )} */}

      {/* <Divider /> */}

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
          <ChatMessageList />

          <Divider />

          <ChatMessageInput disabled={pathname === PATH_DASHBOARD.chat.new} />
        </Box>

        {/* <ChatRoom participants={displayParticipants} /> */}

        {/* {mode === 'DETAIL' && (
          <ChatRoom conversation={conversation} participants={displayParticipants} />
        )} */}
      </Box>
    </Box>
  );
}
