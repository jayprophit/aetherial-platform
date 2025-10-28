import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../components/ui/Button';
import MainLayout from '../components/layout/MainLayout';

interface StyledLinkProps {
  $variant?: 'primary' | 'secondary' | 'outline';
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 800px;
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const CTASection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 4rem;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StyledLink = styled.a<StyledLinkProps>`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${props => props.$variant === 'primary' ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props => props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const HomePage = () => {
  return (
    <MainLayout>
      <Container>
        <HeroSection>
          <HeroTitle>Welcome to the Unified Platform</HeroTitle>
          <HeroSubtitle>
            A comprehensive platform integrating e-learning, e-commerce, social networking, and job marketplace with advanced AI business management.
          </HeroSubtitle>
          <ButtonGroup>
            <Button $variant="primary">Get Started</Button>
            <Button $variant="outline">Learn More</Button>
          </ButtonGroup>
        </HeroSection>
        
        <FeaturesSection>
          <SectionTitle>Key Features</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🎓</FeatureIcon>
              <FeatureTitle>E-Learning</FeatureTitle>
              <FeatureDescription>
                Access age-appropriate courses and educational content with our comprehensive e-learning platform.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🛒</FeatureIcon>
              <FeatureTitle>Marketplace</FeatureTitle>
              <FeatureDescription>
                Buy and sell products with secure transactions and age-appropriate product filtering.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>👥</FeatureIcon>
              <FeatureTitle>Social Network</FeatureTitle>
              <FeatureDescription>
                Connect with others in age-appropriate communities with content moderation and safety features.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>💼</FeatureIcon>
              <FeatureTitle>Job Marketplace</FeatureTitle>
              <FeatureDescription>
                Find job opportunities or hire talent with our integrated job marketplace and business tools.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🤖</FeatureIcon>
              <FeatureTitle>AI Business Management</FeatureTitle>
              <FeatureDescription>
                Leverage AI to manage sales, inventory, customer service, and digital assets for your business.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>KYC Verification</FeatureTitle>
              <FeatureDescription>
                Secure identity verification with age-appropriate restrictions and digital asset protection.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>
        
        <CTASection>
          <CTATitle>Ready to Get Started?</CTATitle>
          <CTADescription>
            Join our unified platform today and experience the seamless integration of e-learning, e-commerce, social networking, and job marketplace with advanced AI business management.
          </CTADescription>
          <Button $variant="secondary">Sign Up Now</Button>
        </CTASection>
      </Container>
    </MainLayout>
  );
};

export default HomePage;
