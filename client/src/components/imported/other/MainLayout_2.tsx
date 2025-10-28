import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

// Define the props interface
interface MainLayoutProps {
  children: React.ReactNode;
}

// Create styled components
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4A6CF7;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled.a`
  color: #1E293B;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: #4A6CF7;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Footer = styled.footer`
  background-color: #1E293B;
  color: white;
  padding: 2rem 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #CBD5E1;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: white;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #CBD5E1;
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: #CBD5E1;
  font-size: 1.25rem;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: white;
  }
`;

// Create the MainLayout component
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>Unified Platform</Logo>
          <Navigation>
            <NavList>
              <NavItem>
                <Link href="/" passHref legacyBehavior>
                  <NavLink>Home</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/ai-assistant" passHref legacyBehavior>
                  <NavLink>AI Assistant</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/social" passHref legacyBehavior>
                  <NavLink>Social</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/ecommerce" passHref legacyBehavior>
                  <NavLink>E-commerce</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/learning" passHref legacyBehavior>
                  <NavLink>Learning</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/jobs" passHref legacyBehavior>
                  <NavLink>Jobs</NavLink>
                </Link>
              </NavItem>
            </NavList>
          </Navigation>
        </HeaderContent>
      </Header>
      
      <Main>{children}</Main>
      
      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>About Us</FooterTitle>
            <FooterLink href="#">Our Story</FooterLink>
            <FooterLink href="#">Team</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Press</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Features</FooterTitle>
            <FooterLink href="#">Social Networking</FooterLink>
            <FooterLink href="#">E-commerce</FooterLink>
            <FooterLink href="#">E-learning</FooterLink>
            <FooterLink href="#">Job Marketplace</FooterLink>
            <FooterLink href="#">AI Assistant</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="#">Community</FooterLink>
            <FooterLink href="#">Developers</FooterLink>
            <FooterLink href="#">API Documentation</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
            <FooterLink href="#">Compliance</FooterLink>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <Copyright>© {new Date().getFullYear()} Unified Platform. All rights reserved.</Copyright>
          <SocialLinks>
            <SocialLink href="#" aria-label="Twitter">
              <span>🐦</span>
            </SocialLink>
            <SocialLink href="#" aria-label="Facebook">
              <span>📘</span>
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <span>📷</span>
            </SocialLink>
            <SocialLink href="#" aria-label="LinkedIn">
              <span>💼</span>
            </SocialLink>
          </SocialLinks>
        </FooterBottom>
      </Footer>
    </LayoutContainer>
  );
};

export default MainLayout;
