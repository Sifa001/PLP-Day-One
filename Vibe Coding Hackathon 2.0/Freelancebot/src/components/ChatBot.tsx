import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Briefcase, DollarSign, Clock, Star, MapPin } from 'lucide-react';
import { Message, ChatState, Project, User as UserType } from '../types';

const ChatBot: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: "Hi! I'm FreelanceBot, your AI assistant for connecting freelancers with clients. Are you looking to hire talent or find work?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }
    ],
    isTyping: false,
    currentStep: 'user_type',
    userProfile: {}
  });
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Website Development',
      description: 'Need a modern e-commerce platform with React and Node.js',
      budget: 2500,
      deadline: '2024-02-15',
      skills: ['React', 'Node.js', 'MongoDB'],
      clientId: 'client1',
      status: 'open',
      proposals: 12,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Design a sleek mobile app interface for fitness tracking',
      budget: 1800,
      deadline: '2024-02-20',
      skills: ['UI/UX', 'Figma', 'Mobile Design'],
      clientId: 'client2',
      status: 'open',
      proposals: 8,
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Content Writing for Tech Blog',
      description: 'Write 10 technical articles about AI and machine learning',
      budget: 800,
      deadline: '2024-02-25',
      skills: ['Content Writing', 'Technical Writing', 'AI'],
      clientId: 'client3',
      status: 'open',
      proposals: 15,
      createdAt: '2024-01-14'
    }
  ];

  const mockFreelancers: UserType[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      type: 'freelancer',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      rating: 4.9,
      location: 'San Francisco, CA',
      bio: 'Full-stack developer with 5+ years experience'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      type: 'freelancer',
      skills: ['UI/UX', 'Figma', 'Adobe XD', 'Prototyping'],
      rating: 4.8,
      location: 'New York, NY',
      bio: 'Creative designer specializing in mobile interfaces'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      type: 'freelancer',
      skills: ['Content Writing', 'Technical Writing', 'SEO'],
      rating: 4.7,
      location: 'Austin, TX',
      bio: 'Technical writer with expertise in AI and blockchain'
    }
  ];

  const addMessage = (content: string, sender: 'user' | 'bot', type: string = 'text', data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString(),
      type,
      data
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  const simulateTyping = () => {
    setChatState(prev => ({ ...prev, isTyping: true }));
    setTimeout(() => {
      setChatState(prev => ({ ...prev, isTyping: false }));
    }, 1000);
  };

  const handleBotResponse = (userMessage: string) => {
    simulateTyping();
    
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      
      if (chatState.currentStep === 'user_type') {
        if (lowerMessage.includes('hire') || lowerMessage.includes('client')) {
          setChatState(prev => ({ 
            ...prev, 
            currentStep: 'client_needs',
            userProfile: { ...prev.userProfile, type: 'client' }
          }));
          addMessage("Great! As a client, I'll help you find the perfect freelancer. What type of project do you need help with?", 'bot');
        } else if (lowerMessage.includes('work') || lowerMessage.includes('freelancer')) {
          setChatState(prev => ({ 
            ...prev, 
            currentStep: 'freelancer_skills',
            userProfile: { ...prev.userProfile, type: 'freelancer' }
          }));
          addMessage("Excellent! As a freelancer, I'll help you find great opportunities. What are your main skills?", 'bot');
        } else {
          addMessage("I can help you either find work as a freelancer or hire talent as a client. Which one interests you?", 'bot');
        }
      } else if (chatState.currentStep === 'client_needs') {
        setChatState(prev => ({ ...prev, currentStep: 'show_matches' }));
        addMessage("Based on your project needs, I've found some talented freelancers who might be perfect for you:", 'bot');
        
        setTimeout(() => {
          addMessage("Here are the top freelancer matches:", 'bot', 'freelancer_matches', mockFreelancers.slice(0, 2));
        }, 500);
      } else if (chatState.currentStep === 'freelancer_skills') {
        setChatState(prev => ({ ...prev, currentStep: 'show_projects' }));
        addMessage("Perfect! I've found some projects that match your skills:", 'bot');
        
        setTimeout(() => {
          addMessage("Here are the best project matches for you:", 'bot', 'project_matches', mockProjects.slice(0, 2));
        }, 500);
      } else {
        // General responses
        if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
          addMessage("You're welcome! I'm here to help you succeed in your freelancing journey. Is there anything else I can assist you with?", 'bot');
        } else if (lowerMessage.includes('help')) {
          addMessage("I can help you with:\n• Finding freelancers for your projects\n• Discovering work opportunities\n• Managing project proposals\n• Connecting with the right people\n\nWhat would you like to do?", 'bot');
        } else {
          addMessage("I understand you're interested in freelancing opportunities. Would you like me to show you more projects or freelancers?", 'bot');
        }
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      const userMessage = inputValue;
      setInputValue('');
      handleBotResponse(userMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{project.title}</h4>
        <span className="text-green-600 font-bold">${project.budget}</span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {project.skills.map(skill => (
          <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase size={14} />
          <span>{project.proposals} proposals</span>
        </div>
      </div>
      <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        Submit Proposal
      </button>
    </div>
  );

  const FreelancerCard: React.FC<{ freelancer: UserType }> = ({ freelancer }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {freelancer.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{freelancer.name}</h4>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{freelancer.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} />
          <span className="text-sm">{freelancer.location}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3">{freelancer.bio}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {freelancer.skills?.map(skill => (
          <span key={skill} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
            {skill}
          </span>
        ))}
      </div>
      <button className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
        View Profile & Hire
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">FreelanceBot</h3>
            <p className="text-sm text-gray-500">Your AI Freelancing Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200'
              }`}
            >
              {message.type === 'project_matches' && message.data ? (
                <div>
                  <p className="mb-3">{message.content}</p>
                  {message.data.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : message.type === 'freelancer_matches' && message.data ? (
                <div>
                  <p className="mb-3">{message.content}</p>
                  {message.data.map((freelancer: UserType) => (
                    <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-line">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {chatState.isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;