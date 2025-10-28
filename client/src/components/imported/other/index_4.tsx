import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';

// Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
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

const Hero = styled.section`
  padding: 80px 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroText = styled.p`
  font-size: 20px;
  color: ${props => props.theme.colors.textLight};
  max-width: 700px;
  margin: 0 auto 40px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${props => props.$variant === 'primary' ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props => props.$variant === 'primary' ? 'white' : props.theme.colors.text};
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.$variant === 'primary' ? props.theme.colors.primaryDark : '#e2e8f0'};
  }
`;

const Features = styled.section`
  padding: 80px 0;
  background-color: ${props => props.theme.colors.backgroundDark};
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const SectionHeading = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const SectionText = styled.p`
  color: ${props => props.theme.colors.textLight};
  max-width: 700px;
  margin: 0 auto;
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

const FeatureTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 15px;
`;

const FeatureText = styled.p`
  color: ${props => props.theme.colors.textLight};
`;

const CTA = styled.section`
  padding: 80px 0;
  text-align: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const CTAText = styled.p`
  max-width: 700px;
  margin: 0 auto 40px;
  font-size: 18px;
`;

const Footer = styled.footer`
  background-color: #1e293b;
  color: white;
  padding: 60px 0 30px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
`;

const FooterCol = styled.div``;

const FooterTitle = styled.h4`
  font-size: 18px;
  margin-bottom: 20px;
`;

const FooterLinks = styled.ul`
  list-style: none;
`;

const FooterItem = styled.li`
  margin-bottom: 10px;
`;

const FooterLink = styled.a`
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: white;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #334155;
  color: #94a3b8;
`;

// Main component
export default function Home() {
  const [healthStatus, setHealthStatus] = useState(null);
  
  useEffect(() => {
    // Fetch health status from API
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        setHealthStatus(data);
        console.log('API Status:', data);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Unified Platform</title>
        <meta name="description" content="A comprehensive platform integrating social networking, e-commerce, e-learning, and job marketplace with advanced AI capabilities and robust compliance features." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <Container>
          <Nav>
            <Logo>Unified Platform</Logo>
            <NavLinks>
              <NavItem>
                <Link href="#features" passHref>
                  <NavLink>Features</NavLink>
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
          </Nav>
        </Container>
      </Header>

      <Hero>
        <Container>
          <HeroTitle>World-Class Unified Platform</HeroTitle>
          <HeroText>
            A comprehensive platform integrating social networking, e-commerce, e-learning, and job marketplace with advanced AI capabilities and robust compliance features.
          </HeroText>
          <ButtonGroup>
            <Link href="#features" passHref>
              <Button $variant="primary">Explore Features</Button>
            </Link>
            <Link href="/ai-assistant" passHref>
              <Button $variant="secondary">View Demo</Button>
            </Link>
          </ButtonGroup>
        </Container>
      </Hero>

      <Features id="features">
        <Container>
          <SectionTitle>
            <SectionHeading>Platform Features</SectionHeading>
            <SectionText>
              Our unified platform combines multiple functionalities with advanced AI capabilities and strict compliance measures.
            </SectionText>
          </SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>🤖</FeatureIcon>
              <FeatureTitle>AI Business Management</FeatureTitle>
              <FeatureText>
                AI agent to manage business operations including sales, inventory, customer service, invoices, and digital asset management.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>KYC Verification</FeatureTitle>
              <FeatureText>
                Robust KYC verification system for full program access with specific restrictions for non-KYC users.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureTitle>Digital Asset Management</FeatureTitle>
              <FeatureText>
                Comprehensive digital asset handling with age-based restrictions, locking assets for users under 18.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>👥</FeatureIcon>
              <FeatureTitle>Social Networking</FeatureTitle>
              <FeatureText>
                Connect with friends, colleagues, and businesses with age-appropriate content and interaction controls.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🛒</FeatureIcon>
              <FeatureTitle>E-Commerce</FeatureTitle>
              <FeatureText>
                Buy and sell products with integrated payment systems and business plan tier options.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📚</FeatureIcon>
              <FeatureTitle>E-Learning</FeatureTitle>
              <FeatureText>
                Create and take courses with AI assistance for content development and learning optimization.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>💼</FeatureIcon>
              <FeatureTitle>Job Marketplace</FeatureTitle>
              <FeatureText>
                Connect employers and job seekers with company registration and review systems.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🛡️</FeatureIcon>
              <FeatureTitle>Content Moderation</FeatureTitle>
              <FeatureText>
                AI-powered content monitoring system to ensure appropriate behavior and content across all platform features.
              </FeatureText>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </Features>

      <CTA>
        <Container>
          <CTATitle>Ready to Experience the Future?</CTATitle>
          <CTAText>
            Join our unified platform and discover the seamless integration of social networking, e-commerce, e-learning, and job marketplace features.
          </CTAText>
          <Link href="/signup" passHref>
            <Button $variant="secondary">Sign Up Now</Button>
          </Link>
        </Container>
      </CTA>

      <Footer>
        <Container>
          <FooterGrid>
            <FooterCol>
              <FooterTitle>Platform</FooterTitle>
              <FooterLinks>
                <FooterItem>
                  <Link href="#features" passHref>
                    <FooterLink>Features</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#pricing" passHref>
                    <FooterLink>Pricing</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#security" passHref>
                    <FooterLink>Security</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#compliance" passHref>
                    <FooterLink>Compliance</FooterLink>
                  </Link>
                </FooterItem>
              </FooterLinks>
            </FooterCol>
            <FooterCol>
              <FooterTitle>Company</FooterTitle>
              <FooterLinks>
                <FooterItem>
                  <Link href="#about" passHref>
                    <FooterLink>About Us</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#careers" passHref>
                    <FooterLink>Careers</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#contact" passHref>
                    <FooterLink>Contact</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#blog" passHref>
                    <FooterLink>Blog</FooterLink>
                  </Link>
                </FooterItem>
              </FooterLinks>
            </FooterCol>
            <FooterCol>
              <FooterTitle>Resources</FooterTitle>
              <FooterLinks>
                <FooterItem>
                  <Link href="#documentation" passHref>
                    <FooterLink>Documentation</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#api" passHref>
                    <FooterLink>API</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#guides" passHref>
                    <FooterLink>Guides</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#support" passHref>
                    <FooterLink>Support</FooterLink>
                  </Link>
                </FooterItem>
              </FooterLinks>
            </FooterCol>
            <FooterCol>
              <FooterTitle>Legal</FooterTitle>
              <FooterLinks>
                <FooterItem>
                  <Link href="#terms" passHref>
                    <FooterLink>Terms of Service</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#privacy" passHref>
                    <FooterLink>Privacy Policy</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#cookies" passHref>
                    <FooterLink>Cookie Policy</FooterLink>
                  </Link>
                </FooterItem>
                <FooterItem>
                  <Link href="#gdpr" passHref>
                    <FooterLink>GDPR</FooterLink>
                  </Link>
                </FooterItem>
              </FooterLinks>
            </FooterCol>
          </FooterGrid>
          <Copyright>
            <p>&copy; 2025 Unified Platform. All rights reserved.</p>
            {healthStatus && (
              <p style={{ marginTop: '10px', fontSize: '12px' }}>
                System Status: {healthStatus.status} | Mode: {healthStatus.mode}
              </p>
            )}
          </Copyright>
        </Container>
      </Footer>
    </>
  );
}
