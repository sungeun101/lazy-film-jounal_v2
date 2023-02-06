import { useEffect, useState, useRef, Key } from 'react';
// @types
import { Conversation } from 'src/@types/chat';
//
import Scrollbar from 'src/components/Scrollbar';
import LightboxModal from 'src/components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

type Props = {
  conversation: any;
};

export default function ChatMessageList({ conversation }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation.messages]);

  const imagesLightbox = conversation.messages
    .filter((messages: { contentType: string }) => messages.contentType === 'image')
    .map((messages: { body: any }) => messages.body);

  const handleOpenLightbox = (url: string) => {
    const selectedImage = imagesLightbox.findIndex((index: string) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
        <div>0. Hi! Let me generate today's workout for you...</div>

        <div>1. Would you like to post this wod?</div>

        <div>1-1. Yes - sort workout type - upload</div>

        <div>2-1. No, please create another one</div>
        <div>2-2. with snatch/clean/...</div>
        <div>2-3. workout style - amrap/for time</div>
        <div>2-4. with KB/DB/Barbell/</div>
        <div>2-5. Focus - gymnastics/cardio/weightlifting</div>

        {conversation.messages.map((message: { id: Key | null | undefined }) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            onOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}
