import dayjs from 'dayjs';
import { create } from 'zustand';
import { WodFormValuesProps } from '../sections/@dashboard/real/workout/WodNewForm';

interface WodStore {
  wod: WodFormValuesProps | null;
  setWod: (wod: WodFormValuesProps | null) => void;
}

export interface Message {
  id: string;
  body: string;
  buttons?: string[];
  tags?: string[];
  contentType: string;
  createdAt: string;
  senderId: string;
  attachments: string[];
  answerTo?: number;
}

interface NewMessage {
  body: string;
  buttons?: string[];
  tags?: string[];
  senderId: string;
  answerTo?: number;
}
interface MessageStore {
  messages: Message[];
  addMessage: (newMessage: NewMessage) => void;
  deleteMessage: (answerTo: number) => void;
  updateMessage: (newMessage: NewMessage) => void;
}

export const useWodStore = create<WodStore>()((set) => ({
  wod: null,
  setWod: (wod: WodFormValuesProps | null) => set(() => ({ wod })),
}));

export const useMessageStore = create<MessageStore>()((set) => ({
  messages: [],
  addMessage: (newMessage: NewMessage) => {
    set((state: MessageStore) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          id: dayjs().toString(),
          body: newMessage.body,
          contentType: 'text',
          createdAt: dayjs().toString(),
          senderId: newMessage.senderId,
          attachments: [],
          buttons: newMessage.buttons,
          tags: newMessage.tags,
        },
      ],
    }));
  },
  deleteMessage: (answerTo: number) => {
    set((state: MessageStore) => ({
      ...state,
    }));
  },
  updateMessage: (prevMessage: NewMessage) => {
    set((state: MessageStore) => {
      const answerToIndex = state.messages.findIndex(
        (message: Message) => message.body === prevMessage.body
      );
      const newArray = [...state.messages];
      newArray[answerToIndex] = {
        ...newArray[answerToIndex],
        buttons: [],
        tags: [],
      };
      return {
        ...state,
        messages: newArray,
      };
    });
  },
}));
