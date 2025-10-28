import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Styled components
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #4A6CF7 0%, #2A3F96 100%);
  color: white;
  border-radius: 0.5rem;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const FeaturesSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(Card)`
  height: 100%;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4A6CF7;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #64748B;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 3rem;
  background-color: #F8FAFC;
  border-radius: 0.5rem;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.125rem;
  color: #64748B;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

// Feature data
const FEATURES = [
  {
    icon: '🌐',
    title: 'Social Networking',
    description: 'Connect with friends, share content, and join communities with our comprehensive social networking features.',
  },
  {
    icon: '🛒',
    title: 'E-commerce Marketplace',
    description: 'Buy and sell products with ease in our secure and user-friendly e-commerce marketplace.',
  },
  {
    icon: '📚',
    title: 'E-learning Platform',
    description: 'Access high-quality courses and educational content to expand your knowledge and skills.',
  },
  {
    icon: '💼',
    title: 'Job Marketplace',
    description: 'Find job opportunities or hire talent through our specialized job marketplace.',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    description: 'Get personalized help and recommendations from our advanced multi-model AI assistant.',
  },
  {
    icon: '🔒',
    title: 'Age-Appropriate Experience',
    description: 'Enjoy a safe, age-appropriate experience with our comprehensive verification and moderation systems.',
  },
];

// HomePage component
const HomePage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Fix for hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <MainLayout>
      <HeroSection>
        <HeroTitle>Welcome to the Unified Platform</HeroTitle>
        <HeroSubtitle>
          A comprehensive platform combining social networking, e-commerce, e-learning, and job marketplace features,
          all enhanced by advanced AI capabilities.
        </HeroSubtitle>
        <Button variant="secondary" size="large">Get Started</Button>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Platform Features</SectionTitle>
        <FeaturesGrid>
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} $elevated $rounded>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Ready to join our community?</CTATitle>
        <CTADescription>
          Sign up today to access all features and start connecting, learning, and growing with us.
        </CTADescription>
        <Button variant="primary" size="large">Sign Up Now</Button>
      </CTASection>
    </MainLayout>
  );
};

export default HomePage;
