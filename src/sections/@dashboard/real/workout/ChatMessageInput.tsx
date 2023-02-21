import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Input, Divider, IconButton } from '@mui/material';

// components
import Iconify from 'src/components/Iconify';
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

export interface ChatData {
  ok: boolean;
  answer: string;
  buttons?: string[];
  tags?: string[];
  saveButtons?: string[];
}

export default function ChatMessageInput() {
  const [prompt, setPrompt] = useState('');
  const [startSearch, setStartSearch] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const { data: movementData } = useSWR<ChatData>(
    startSearch && prompt ? `/api/chat/movement?prompt=${prompt}` : null
  );

  const { messages, addMessage, hideMessageOptions } = useMessageStore();

  useEffect(() => {
    if (movementData?.answer) {
      console.log('movementData', movementData);
      setPrompt('');
      addMessage({
        body: movementData.answer,
        saveButtons: movementData.saveButtons,
        senderId: 'chatGPT',
      });
    }
  }, [movementData]);

  useEffect(() => {
    if (!prompt) {
      setStartSearch(false);
    }
  }, [prompt]);

  useEffect(() => {
    console.log('messages', messages);
    if (messages && messages[messages.length - 1]?.body?.toLowerCase().includes('what movements')) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [messages]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!prompt) {
      return '';
    }
    if (
      messages &&
      messages[messages.length - 1] &&
      messages &&
      messages[messages.length - 1].id &&
      messages &&
      messages[messages.length - 1].body
    ) {
      hideMessageOptions({
        id: messages[messages.length - 1].id,
        body: messages[messages.length - 1].body,
        senderId: 'chatGPT',
      });
    }
    addMessage({
      body: prompt,
      senderId: 'admin',
    });
    setStartSearch(true);
    console.log('handleSend, message(prompt) : ', prompt);
  };

  return (
    <RootStyle>
      <Input
        disabled={isDisabled}
        fullWidth
        value={prompt}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder={isDisabled ? '' : 'Type any crossfit movement'}
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            {/* <IconButton disabled={isDisabled} size="small" onClick={handleAttach}>
              <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} />
            </IconButton>
            <IconButton disabled={isDisabled} size="small" onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" width={22} height={22} />
            </IconButton> */}
            <IconButton disabled={isDisabled} size="small">
              <Iconify icon="eva:mic-fill" width={22} height={22} />
            </IconButton>
          </Stack>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={!prompt} onClick={handleSend} sx={{ mx: 1 }}>
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>

      {/* <input type="file" ref={fileInputRef} style={{ display: 'none' }} /> */}
    </RootStyle>
  );
}
