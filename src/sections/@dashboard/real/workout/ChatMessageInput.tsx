import { useEffect, useRef, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Input, Divider, IconButton, InputAdornment } from '@mui/material';
// utils
import uuidv4 from 'src/utils/uuidv4';
// @types
import { SendMessage } from 'src/@types/chat';
// components
import Iconify from 'src/components/Iconify';
import EmojiPicker from 'src/components/EmojiPicker';
import useSWR from 'swr';
import { useMessageStore } from 'src/zustand/useStore';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
}));

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
};

export interface ChatData {
  ok: boolean;
  wodCreated: string;
}

export default function ChatMessageInput({ disabled }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [startSearch, setStartSearch] = useState(false);

  const { data: chatData } = useSWR<ChatData>(
    startSearch && message ? `/api/wods/chat?prompt=${message}` : null
  );

  const { addMessage } = useMessageStore();

  useEffect(() => {
    if (chatData?.wodCreated) {
      console.log('SWR chatData', chatData);
      const answer = chatData.wodCreated.replaceAll('\n', '<br>');
      addMessage({
        body: answer,
        senderId: 'chatGPT',
      });
    }
  }, [chatData]);

  useEffect(() => {
    if (!message) {
      setStartSearch(false);
    }
  }, [message]);

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    addMessage({
      body: message,
      senderId: 'admin',
    });
    setStartSearch(true);
    console.log('handleSend, message(prompt) : ', message);
    // if (onSend && conversationId) {
    //   onSend({
    //     conversationId,
    //     messageId: uuidv4(),
    //     message,
    //     contentType: 'text',
    //     attachments: [],
    //     createdAt: new Date(),
    //     senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
    //   });
    // }
    // return setMessage('');
  };

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
          </InputAdornment>
        }
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            <IconButton disabled={disabled} size="small" onClick={handleAttach}>
              <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} />
            </IconButton>
            <IconButton disabled={disabled} size="small" onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" width={22} height={22} />
            </IconButton>
            <IconButton disabled={disabled} size="small">
              <Iconify icon="eva:mic-fill" width={22} height={22} />
            </IconButton>
          </Stack>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={!message} onClick={handleSend} sx={{ mx: 1 }}>
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </RootStyle>
  );
}
