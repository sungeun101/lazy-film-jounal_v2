import { create } from 'zustand';
import { WodFormValuesProps } from '../sections/@dashboard/real/workout/WodNewForm';

interface Wod {
  wod: WodFormValuesProps | null;
  add: (wod: WodFormValuesProps | null) => void;
}

interface Participant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  lastActivity?: Date | string | number;
  status?: 'online' | 'offline' | 'away' | 'busy';
  position?: string;
}

interface Message {
  id: string;
  body: string;
  contentType: string;
  attachments: string[];
  createdAt: Date;
  senderId: string;
}

interface Conversation {
  id: string;
  participants: Participant[];
  type: string;
  unreadCount: number;
  messages: Message[];
}

interface ChatState {
  wodCreated: string;
  add: (wod: string) => void;
}

export const useWodStore = create<Wod>()((set) => ({
  wod: null,
  add: (wod: WodFormValuesProps | null) => set(() => ({ wod })),
}));

export const useConversationStore = create<any>()((set) => ({
  conversation: {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
    participants: [
      {
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        avatar: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_15.jpg',
        name: 'Jaydon Frankie',
        username: 'jaydon.frankie',
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        name: 'Reece Chung',
        username: 'reece.chung',
        avatar: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_5.jpg',
        address: '36901 Elmer Spurs Apt. 762 - Miramar, DE / 92836',
        phone: '990-588-5716',
        email: 'letha_lubowitz24@yahoo.com',
        lastActivity: '2023-02-02T03:00:12.512Z',
        status: 'busy',
        position: 'UX Designer',
      },
    ],
    type: 'ONE_TO_ONE',
    unreadCount: 0,
    messages: [
      {
        id: '29f1baee-0c30-479a-9d28-9628965d3127',
        body: "Hi! Let me generate today's workout for you...",
        contentType: 'text',
        attachments: [],
        createdAt: '2023-02-05T21:00:12.513Z',
        senderId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
      },
    ],
  },
  add: (conversation: any) => set(() => ({ conversation })),
}));
