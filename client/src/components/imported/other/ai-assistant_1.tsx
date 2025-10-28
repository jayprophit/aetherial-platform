import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../components/ui/Button';
import MainLayout from '../components/layout/MainLayout';

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'outline';
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 800px;
  margin: 0 auto;
`;

const AssistantSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const UserMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 18px 18px 0 18px;
  max-width: 70%;
  margin-left: auto;
`;

const AssistantMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 1rem;
  border-radius: 18px 18px 18px 0;
  max-width: 70%;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const AIAssistantPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'assistant', text: 'Hello! I\'m your Quantum Virtual Assistant. How can I help you today?' }
  ]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', text: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        response = 'Hello! How can I assist you today?';
      } else if (message.toLowerCase().includes('help')) {
        response = 'I can help with business management, content creation, digital asset management, and more. What specific assistance do you need?';
      } else if (message.toLowerCase().includes('business')) {
        response = 'I can help optimize your business operations, analyze sales data, manage inventory, and provide customer service automation. Would you like to know more about any specific area?';
      } else if (message.toLowerCase().includes('content')) {
        response = 'I can assist with content creation, moderation, and optimization. All content is automatically checked for compliance with community guidelines.';
      } else if (message.toLowerCase().includes('asset')) {
        response = 'I can help manage your digital assets, including rewards, staking, minting, and mining. For users under 18, assets are automatically locked until legal age.';
      } else {
        response = 'I understand. How else can I assist you with your needs on our unified platform?';
      }
      
      setChatHistory(prev => [...prev, { sender: 'assistant', text: response }]);
    }, 1000);
    
    // Clear input
    setMessage('');
  };
  
  return (
    <MainLayout>
      <Container>
        <Header>
          <Title>Quantum Virtual Assistant</Title>
          <Subtitle>
            Your AI-powered business assistant with multi-model capabilities inspired by Manus, Claude, DeepSeek, Qwen, Copilot, and ChatGPT.
          </Subtitle>
        </Header>
        
        <AssistantSection>
          <ChatContainer>
            {chatHistory.map((msg, index) => (
              <MessageContainer key={index}>
                {msg.sender === 'user' ? (
                  <UserMessage>{msg.text}</UserMessage>
                ) : (
                  <AssistantMessage>{msg.text}</AssistantMessage>
                )}
              </MessageContainer>
            ))}
          </ChatContainer>
          
          <InputContainer>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button $variant="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </InputContainer>
        </AssistantSection>
        
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>💼</FeatureIcon>
            <FeatureTitle>Business Management</FeatureTitle>
            <FeatureDescription>
              AI-powered business management system that handles sales, inventory, customer service, and invoices automatically.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>KYC Verification</FeatureTitle>
            <FeatureDescription>
              Secure identity verification with age-appropriate restrictions and digital asset locking for users under 18.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Digital Asset Management</FeatureTitle>
            <FeatureDescription>
              Manage digital assets with automatic compounding, minting, mining, and staking for maximum growth.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>👮</FeatureIcon>
            <FeatureTitle>Content Moderation</FeatureTitle>
            <FeatureDescription>
              AI-powered content monitoring ensures all platform content complies with community guidelines.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureTitle>Multi-Model AI</FeatureTitle>
            <FeatureDescription>
              Combines capabilities from multiple AI models including Manus, Claude, DeepSeek, Qwen, Copilot, and ChatGPT.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Cross-Platform Access</FeatureTitle>
            <FeatureDescription>
              Access your assistant from any device with synchronized data across web, mobile, and desktop applications.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Container>
    </MainLayout>
  );
};

export default AIAssistantPage;
