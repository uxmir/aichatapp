export interface ChatSession {
  _id: string; 
  title: string;
  chats: UserChat[];
  newSession: boolean;
}

export interface UserChat {
  _id?: string;
  userInput: string;
  aiData: string;
  imageUrl: string;
}