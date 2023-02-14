import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography, Stack, Button, Chip } from '@mui/material';
import { Message, useDateStore, useMessageStore } from 'src/zustand/useStore';
import { useEffect, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatData } from './ChatMessageInput';
import useMutation from 'src/libs/client/useMutation';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 200,
  minWidth: 296,
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: Message;
  onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({ message, onOpenLightbox }: ChatMessageItemProps) {
  const senderDetails =
    message.senderId === 'admin' ? { type: 'admin' } : { name: 'AbitDullChatbot' };

  const isAdmin = senderDetails.type === 'admin';
  const isImage = message.contentType === 'image';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  const [randomOrHelpPrompt, setRandomOrHelpPrompt] = useState('');
  const [movementPrompt, setMovementPrompt] = useState('');

  const { data: randomOrHelpData, isLoading: isLoadingRandomOrHelp } = useSWR<ChatData>(
    randomOrHelpPrompt ? `/api/chat/randomorhelp?prompt=${randomOrHelpPrompt}` : null
  );

  const { data: movementData, isLoading: isLoadingMovement } = useSWR<ChatData>(
    movementPrompt ? `/api/chat/movement?prompt=${movementPrompt}` : null
  );
  const { cache, mutate } = useSWRConfig();

  const { searchDate } = useDateStore();
  const { messages, addMessage, hideMessageOptions, updateMessage } = useMessageStore();

  const bodyRef = useRef<any>(null);

  const [uploadWod, { data: wodResult }] = useMutation('/api/wods');

  const hidePreviousOptions = (id: string) => {
    const parentMessageBody = bodyRef.current.innerText;
    hideMessageOptions({
      id,
      body: parentMessageBody,
      senderId: 'chatGPT',
    });
  };

  const handleButtonClick = (e: any, id: string) => {
    const { innerText } = e.target;
    addMessage({
      body: innerText,
      senderId: 'admin',
    });
    setRandomOrHelpPrompt(innerText);
    hidePreviousOptions(id);
  };

  const handleTagClick = (e: any, id: string) => {
    const { innerText } = e.target;
    addMessage({
      body: innerText,
      senderId: 'admin',
    });
    setMovementPrompt(innerText);
    hidePreviousOptions(id);
  };

  const handleSaveWod = (e: any, id: string) => {
    const { innerText } = e.target;
    addMessage({
      body: innerText,
      senderId: 'admin',
    });
    if (innerText.toLowerCase().includes('save')) {
      onSubmit();
    } else {
      setRandomOrHelpPrompt(innerText);
    }
    hidePreviousOptions(id);
  };

  const onSubmit = async () => {
    const stringDate = dayjs(searchDate).format('YYYY-MM-DD');
    const parentMessageBody = bodyRef.current.innerText;
    const wodOnly = parentMessageBody.split('\n').slice(1).join('<br>');
    try {
      uploadWod({
        createDate: stringDate,
        type:
          parentMessageBody.toLowerCase().includes('as many rounds as possible') ||
          parentMessageBody.toLowerCase().includes('amrap')
            ? 'As Many Rounds As Possible'
            : 'For Time',
        content: wodOnly,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (wodResult?.ok) {
      console.log('wodResult', wodResult);
      mutate(`/api/wods/${dayjs(searchDate).format('YYYY-MM-DD')}`);
      addMessage({
        body: "This WOD is saved for today's workout. Feel free to make any desired edits on the Wod board!",
        senderId: 'chatGPT',
      });
    }
  }, [wodResult]);

  useEffect(() => {
    if (isLoadingRandomOrHelp || isLoadingMovement) {
      addMessage({
        body: 'loading...',
        senderId: 'chatGPT',
      });
    }
  }, [isLoadingRandomOrHelp, isLoadingMovement]);

  useEffect(() => {
    if (!isLoadingRandomOrHelp && randomOrHelpData && randomOrHelpData.answer) {
      setRandomOrHelpPrompt('');
      updateMessage({
        id: messages[messages.length - 1].id,
        body: randomOrHelpData.answer,
        saveButtons: randomOrHelpData.saveButtons,
        tags: randomOrHelpData.tags,
        senderId: 'chatGPT',
      });
      cache.delete(`/api/chat/randomorhelp?prompt=${randomOrHelpPrompt}`);
    }
  }, [randomOrHelpData]);

  useEffect(() => {
    if (!isLoadingMovement && movementData && movementData.answer) {
      setMovementPrompt('');
      updateMessage({
        id: messages[messages.length - 1].id,
        body: movementData.answer,
        saveButtons: movementData.saveButtons,
        senderId: 'chatGPT',
      });
      cache.delete(`/api/chat/movement?prompt=${movementPrompt}`);
    }
  }, [movementData]);

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isAdmin && {
            ml: 'auto',
          }),
        }}
      >
        {senderDetails.type !== 'admin' && (
          <Avatar
            alt={senderDetails.name}
            sx={{ width: 32, height: 32, backgroundColor: '#0BA37F' }}
          >
            <svg data-name="OpenAI Logo" width={24} height={24} viewBox="140 140 520 520">
              <path
                d="M617.24 354a126.36 126.36 0 0 0-10.86-103.79 127.8 127.8 0 0 0-137.65-61.32 126.36 126.36 0 0 0-95.31-42.49 127.81 127.81 0 0 0-121.92 88.49 126.4 126.4 0 0 0-84.5 61.3 127.82 127.82 0 0 0 15.72 149.86 126.36 126.36 0 0 0 10.86 103.79 127.81 127.81 0 0 0 137.65 61.32 126.36 126.36 0 0 0 95.31 42.49 127.81 127.81 0 0 0 121.96-88.54 126.4 126.4 0 0 0 84.5-61.3A127.82 127.82 0 0 0 617.24 354zM426.58 620.49a94.79 94.79 0 0 1-60.85-22c.77-.42 2.12-1.16 3-1.7l101-58.34a16.42 16.42 0 0 0 8.3-14.37V381.69l42.69 24.65a1.52 1.52 0 0 1 .83 1.17v117.92a95.18 95.18 0 0 1-94.97 95.06zm-204.24-87.23a94.74 94.74 0 0 1-11.34-63.7c.75.45 2.06 1.25 3 1.79l101 58.34a16.44 16.44 0 0 0 16.59 0l123.31-71.2v49.3a1.53 1.53 0 0 1-.61 1.31l-102.1 58.95a95.16 95.16 0 0 1-129.85-34.79zm-26.57-220.49a94.71 94.71 0 0 1 49.48-41.68c0 .87-.05 2.41-.05 3.48v116.68a16.41 16.41 0 0 0 8.29 14.36L376.8 476.8l-42.69 24.65a1.53 1.53 0 0 1-1.44.13l-102.11-59a95.16 95.16 0 0 1-34.79-129.81zm350.74 81.62-123.31-71.2 42.69-24.64a1.53 1.53 0 0 1 1.44-.13l102.11 58.95a95.08 95.08 0 0 1-14.69 171.55V408.75a16.4 16.4 0 0 0-8.24-14.36zM589 330.44c-.75-.46-2.06-1.25-3-1.79l-101-58.34a16.46 16.46 0 0 0-16.59 0l-123.31 71.2v-49.3a1.53 1.53 0 0 1 .61-1.31l102.1-58.9A95.07 95.07 0 0 1 589 330.44zm-267.11 87.87-42.7-24.65a1.52 1.52 0 0 1-.83-1.17V274.57a95.07 95.07 0 0 1 155.9-73c-.77.42-2.11 1.16-3 1.7l-101 58.34a16.41 16.41 0 0 0-8.3 14.36zm23.19-50L400 336.59l54.92 31.7v63.42L400 463.41l-54.92-31.7z"
                fill="#fff"
              />
            </svg>
          </Avatar>
        )}

        <Box sx={{ ml: 2 }}>
          <InfoStyle
            noWrap
            variant="caption"
            sx={{ ...(isAdmin && { justifyContent: 'flex-end' }) }}
          >
            {!isAdmin && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </InfoStyle>
          <ContentStyle
            sx={{
              ...(isAdmin && {
                color: 'grey.800',
                bgcolor: 'primary.lighter',
              }),
            }}
          >
            {isImage ? (
              <MessageImgStyle
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
              />
            ) : (
              <Stack spacing={2}>
                {/* 
                chatGPT
                q. how can i create a chatbot with buttons I can interact with with chatGPT?
               q.  How can I send the selected option to the OpenAI API to generate a response? */}
                {/* 1. Create a random crossfit Wod and tell me if it's AMRAP or For Time 
                2. If the WOD
                you generated is AMRAP, tell me how many reps is 1 round. Show answer as a math
                formula as a code snippet using Javascript. */}

                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{ __html: message.body }}
                  ref={bodyRef}
                />

                {message?.buttons?.map((item: string) => (
                  <Button
                    key={item}
                    fullWidth
                    variant="outlined"
                    // endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
                    onClick={(e: any) => handleButtonClick(e, message?.id)}
                  >
                    {item}
                  </Button>
                ))}

                {message?.tags && (
                  <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {message.tags.map((item: string) => (
                      <Chip
                        key={item}
                        label={item}
                        variant="outlined"
                        onClick={(e: any) => handleTagClick(e, message?.id)}
                      />
                    ))}
                  </Stack>
                )}

                {message?.saveButtons?.map((item: string, index: number) => (
                  <Button
                    key={item}
                    fullWidth
                    variant={index === 0 ? 'contained' : 'outlined'}
                    // endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
                    onClick={(e: any) => handleSaveWod(e, message?.id)}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            )}
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
