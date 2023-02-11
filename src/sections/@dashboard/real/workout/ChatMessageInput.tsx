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
  answer: string;
  buttons?: string[];
  tags?: string[];
}

export default function ChatMessageInput({ disabled }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [startSearch, setStartSearch] = useState(false);

  const { data: movementData } = useSWR<ChatData>(
    startSearch && prompt ? `/api/chat/movement?prompt=${prompt}` : null
  );

  const { addMessage } = useMessageStore();

  useEffect(() => {
    if (movementData?.answer) {
      setPrompt('');
      const answer = movementData.answer.replaceAll('\n', '<br>');
      addMessage({
        body: answer,
        senderId: 'chatGPT',
      });
    }
  }, [movementData]);

  useEffect(() => {
    if (!prompt) {
      setStartSearch(false);
    }
  }, [prompt]);

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!prompt) {
      return '';
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
        disabled={disabled}
        fullWidth
        value={prompt}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Type any crossfit movement"
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled} value={prompt} setValue={setPrompt} />
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

      <IconButton color="primary" disabled={!prompt} onClick={handleSend} sx={{ mx: 1 }}>
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </RootStyle>
  );
}
