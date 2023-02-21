import dayjs from 'dayjs';
import { create } from 'zustand';
import { WodFormValuesProps } from '../sections/@dashboard/real/workout/WodNewForm';

interface DateStore {
  searchDate: Date | null;
  setSearchDate: (searchDate: Date | null) => void;
}
interface WodStore {
  wod: WodFormValuesProps | null;
  setWod: (wod: WodFormValuesProps | null) => void;
}

export interface Message {
  id: string;
  body: string;
  buttons?: string[];
  saveButtons?: string[];
  tags?: string[];
  contentType: string;
  createdAt: string;
  senderId: string;
  attachments: string[];
}

interface NewMessage {
  id?: string;
  body: string;
  buttons?: string[];
  saveButtons?: string[];
  tags?: string[];
  senderId: string;
}
interface MessageStore {
  messages: Message[];
  addMessage: (newMessage: NewMessage) => void;
  hideMessageOptions: (newMessage: NewMessage) => void;
  updateMessage: (newMessage: NewMessage) => void;
}

export const useDateStore = create<DateStore>()((set) => ({
  searchDate: new Date(),
  setSearchDate: (searchDate: Date | null) => set(() => ({ searchDate })),
}));

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
          id: Math.floor(100000 + Math.random() * 900000) + '',
          body: newMessage.body,
          contentType: 'text',
          createdAt: dayjs().toString(),
          senderId: newMessage.senderId,
          attachments: [],
          buttons: newMessage.buttons,
          saveButtons: newMessage.saveButtons,
          tags: newMessage.tags,
        },
      ],
    }));
  },
  hideMessageOptions: (prevMessage: NewMessage) => {
    set((state: MessageStore) => {
      console.log('prevMessage', prevMessage);
      const answerToIndex = state.messages.findIndex(
        (message: Message) => message.id === prevMessage.id
      );
      const newArray = [...state.messages];
      console.log('answerToIndex', answerToIndex);
      newArray[answerToIndex] = {
        ...newArray[answerToIndex],
        buttons: [],
        saveButtons: [],
        tags: [],
      };
      return {
        ...state,
        messages: newArray,
      };
    });
  },
  updateMessage: (prevMessage: NewMessage) => {
    set((state: MessageStore) => {
      console.log('prevMessage', prevMessage);
      const answerToIndex = state.messages.findIndex(
        (message: Message) => message.id === prevMessage.id
      );
      const newArray = [...state.messages];
      console.log('answerToIndex', answerToIndex);
      newArray[answerToIndex] = {
        ...newArray[answerToIndex],
        ...prevMessage,
      };
      return {
        ...state,
        messages: newArray,
      };
    });
  },
}));
