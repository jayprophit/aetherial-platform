import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 20px 0;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  margin-left: 20px;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 18px;
  margin-bottom: 40px;
  color: ${props => props.theme.colors.textLight};
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ChatHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
`;

const AIAvatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
`;

const ChatHeaderText = styled.div`
  h3 {
    margin: 0;
    font-size: 18px;
  }
  
  p {
    margin: 5px 0 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f8fafc;
`;

const Message = styled.div`
  margin-bottom: 20px;
  max-width: 80%;
  
  &.user {
    margin-left: auto;
    text-align: right;
  }
  
  &.ai {
    margin-right: auto;
  }
`;

const MessageBubble = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  display: inline-block;
  
  &.user {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-top-right-radius: 4px;
  }
  
  &.ai {
    background-color: white;
    color: ${props => props.theme.colors.text};
    border-top-left-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
`;

const MessageTime = styled.div`
  font-size: 12px;
  margin-top: 5px;
  color: ${props => props.theme.colors.textLight};
`;

const ChatInput = styled.div`
  padding: 15px 20px;
  background-color: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.$variant === 'primary' ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props => props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.$variant === 'primary' ? props.theme.colors.primaryDark : '#e2e8f0'};
  }
`;

const FeatureList = styled.div`
  margin-top: 60px;
`;

const FeatureTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  font-size: 24px;
`;

const FeatureCardTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const FeatureText = styled.p`
  color: ${props => props.theme.colors.textLight};
`;

// Sample messages
const initialMessages = [
  {
    id: 1,
    text: "Hello! I'm the AI Business Agent for the unified platform. How can I assist you today?",
    sender: "ai",
    time: "10:00 AM"
  }
];

// Main component
export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      let aiResponse = "";
      
      // Simple response logic based on keywords
      if (input.toLowerCase().includes("sales")) {
        aiResponse = "To improve sales, consider optimizing your product listings, implementing targeted promotions, and leveraging customer data for personalized marketing campaigns.";
      } else if (input.toLowerCase().includes("inventory")) {
        aiResponse = "Effective inventory management involves regular stock audits, implementing just-in-time ordering, and using predictive analytics to forecast demand.";
      } else if (input.toLowerCase().includes("customer")) {
        aiResponse = "To enhance customer service, focus on quick response times, personalized interactions, and proactive issue resolution.";
      } else if (input.toLowerCase().includes("kyc") || input.toLowerCase().includes("verification")) {
        aiResponse = "Our KYC verification system ensures compliance while providing full program access. Users without KYC verification have limited access to platform features.";
      } else if (input.toLowerCase().includes("digital asset") || input.toLowerCase().includes("assets")) {
        aiResponse = "Digital assets for users under 18 are locked, compounded, and staked until they reach legal age. This ensures compliance with regulations while still allowing younger users to accumulate value.";
      } else if (input.toLowerCase().includes("age") || input.toLowerCase().includes("restriction")) {
        aiResponse = "We implement a minimum age restriction of 13+ for chat rooms and messaging features, except for e-learning classes which have appropriate monitoring.";
      } else {
        aiResponse = "I can help you with sales, inventory management, customer service, digital assets, and other business operations. Please ask a specific question about platform management.";
      }
      
      const aiMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 1000);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>AI Business Assistant | Unified Platform</title>
        <meta name="description" content="AI-powered business management assistant for the unified platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <HeaderContainer>
          <Link href="/" passHref>
            <Logo as="a" style={{ textDecoration: 'none', color: 'white' }}>Unified Platform</Logo>
          </Link>
          <NavLinks>
            <NavItem>
              <Link href="/" passHref>
                <NavLink>Home</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/social" passHref>
                <NavLink>Social</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/ecommerce" passHref>
                <NavLink>E-Commerce</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/learning" passHref>
                <NavLink>Learning</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/jobs" passHref>
                <NavLink>Jobs</NavLink>
              </Link>
            </NavItem>
          </NavLinks>
        </HeaderContainer>
      </Header>

      <Container>
        <Title>AI Business Assistant</Title>
        <Subtitle>
          Our AI-powered business management system helps you handle sales, inventory, customer service, 
          and digital asset management with intelligent automation.
        </Subtitle>
        
        <ChatContainer>
          <ChatHeader>
            <AIAvatar>🤖</AIAvatar>
            <ChatHeaderText>
              <h3>Business Management AI</h3>
              <p>Online • Ready to assist</p>
            </ChatHeaderText>
          </ChatHeader>
          
          <ChatMessages>
            {messages.map(message => (
              <Message key={message.id} className={message.sender}>
                <MessageBubble className={message.sender}>
                  {message.text}
                </MessageBubble>
                <MessageTime>{message.time}</MessageTime>
              </Message>
            ))}
          </ChatMessages>
          
          <ChatInput>
            <Input 
              type="text" 
              placeholder="Ask about sales, inventory, customer service, or digital assets..." 
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button $variant="primary" onClick={handleSendMessage}>Send</Button>
          </ChatInput>
        </ChatContainer>
        
        <FeatureList>
          <FeatureTitle>AI Business Management Features</FeatureTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>💼</FeatureIcon>
              <FeatureCardTitle>Sales Management</FeatureCardTitle>
              <FeatureText>
                AI-powered sales forecasting, customer targeting, and performance analytics to optimize your revenue streams.
              </FeatureText>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📦</FeatureIcon>
              <FeatureCardTitle>Inventory Control</FeatureCardTitle>
              <FeatureText>
                Intelligent inventory tracking, demand prediction, and automated reordering to prevent stockouts and overstock.
              </FeatureText>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🛎️</FeatureIcon>
              <FeatureCardTitle>Customer Service</FeatureCardTitle>
              <FeatureText>
                Automated customer support, sentiment analysis, and personalized interaction recommendations.
              </FeatureText>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureCardTitle>Business Analytics</FeatureCardTitle>
              <FeatureText>
                Comprehensive business intelligence dashboards with actionable insights and performance metrics.
              </FeatureText>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureCardTitle>Digital Asset Management</FeatureCardTitle>
              <FeatureText>
                Secure handling of digital assets with age-appropriate restrictions, staking, minting, and mining capabilities.
              </FeatureText>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📝</FeatureIcon>
              <FeatureCardTitle>Automated Documentation</FeatureCardTitle>
              <FeatureText>
                AI-generated reports, invoices, and business documents with customizable templates and formats.
              </FeatureText>
            </FeatureCard>
          </FeatureGrid>
        </FeatureList>
      </Container>
    </>
  );
}
