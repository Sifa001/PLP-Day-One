export interface User {
  id: string;
  name: string;
  email: string;
  type: 'freelancer' | 'client';
  avatar?: string;
  skills?: string[];
  rating?: number;
  location?: string;
  bio?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  clientId: string;
  status: 'open' | 'in_progress' | 'completed';
  proposals: number;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type?: 'text' | 'project_match' | 'proposal';
  data?: any;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentStep: string;
  userProfile: Partial<User>;
}