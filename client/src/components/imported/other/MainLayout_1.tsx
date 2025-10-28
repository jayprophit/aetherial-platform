import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import { Container, Flex } from '../ui/index';

// Define styled components for layout
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: ${theme.colors.white};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndices.sticky};
`;

const HeaderContent = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled.a<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? theme.colors.primary : theme.colors.text};
  font-weight: ${props => props.$isActive ? theme.fontWeights.semibold : theme.fontWeights.medium};
  margin: 0 1rem;
  padding: 0.5rem;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  font-size: 1.5rem;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  background-color: ${theme.colors.white};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  left: 0;
  padding: 1rem;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: ${theme.zIndices.dropdown};
`;

const MobileNavLink = styled.a<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? theme.colors.primary : theme.colors.text};
  font-weight: ${props => props.$isActive ? theme.fontWeights.semibold : theme.fontWeights.medium};
  padding: 0.75rem 0;
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

const Footer = styled.footer`
  background-color: ${theme.colors.darkGray};
  color: ${theme.colors.white};
  padding: 2rem 0;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterHeading = styled.h3`
  font-size: ${theme.fontSizes.lg};
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: ${theme.colors.lightGray};
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${theme.colors.white};
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  border-top: 1px solid ${theme.colors.gray};
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
`;

// Main layout component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isActiveRoute = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <LayoutWrapper>
      <Header>
        <Container>
          <HeaderContent $direction="row" $justify="space-between" $align="center">
            <Logo>
              <Link href="/" passHref>
                <a>Unified Platform</a>
              </Link>
            </Logo>
            <Nav>
              <Link href="/" passHref>
                <NavLink $isActive={isActiveRoute('/')}>Home</NavLink>
              </Link>
              <Link href="/social" passHref>
                <NavLink $isActive={isActiveRoute('/social')}>Social</NavLink>
              </Link>
              <Link href="/ecommerce" passHref>
                <NavLink $isActive={isActiveRoute('/ecommerce')}>Shop</NavLink>
              </Link>
              <Link href="/learning" passHref>
                <NavLink $isActive={isActiveRoute('/learning')}>Learn</NavLink>
              </Link>
              <Link href="/jobs" passHref>
                <NavLink $isActive={isActiveRoute('/jobs')}>Jobs</NavLink>
              </Link>
              <Link href="/ai-assistant" passHref>
                <NavLink $isActive={isActiveRoute('/ai-assistant')}>AI Assistant</NavLink>
              </Link>
            </Nav>
            <AuthButtons>
              <Button $variant="secondary" $size="medium">Login</Button>
              <Button $variant="primary" $size="medium">Sign Up</Button>
            </AuthButtons>
            <MobileMenuButton onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </HeaderContent>
          <MobileMenu $isOpen={isMobileMenuOpen}>
            <Link href="/" passHref>
              <MobileNavLink $isActive={isActiveRoute('/')}>Home</MobileNavLink>
            </Link>
            <Link href="/social" passHref>
              <MobileNavLink $isActive={isActiveRoute('/social')}>Social</MobileNavLink>
            </Link>
            <Link href="/ecommerce" passHref>
              <MobileNavLink $isActive={isActiveRoute('/ecommerce')}>Shop</MobileNavLink>
            </Link>
            <Link href="/learning" passHref>
              <MobileNavLink $isActive={isActiveRoute('/learning')}>Learn</MobileNavLink>
            </Link>
            <Link href="/jobs" passHref>
              <MobileNavLink $isActive={isActiveRoute('/jobs')}>Jobs</MobileNavLink>
            </Link>
            <Link href="/ai-assistant" passHref>
              <MobileNavLink $isActive={isActiveRoute('/ai-assistant')}>AI Assistant</MobileNavLink>
            </Link>
            <Button $variant="secondary" $size="medium" $fullWidth style={{ marginTop: '1rem' }}>Login</Button>
            <Button $variant="primary" $size="medium" $fullWidth style={{ marginTop: '0.5rem' }}>Sign Up</Button>
          </MobileMenu>
        </Container>
      </Header>
      <Main>
        <Container>
          {children}
        </Container>
      </Main>
      <Footer>
        <Container>
          <FooterContent>
            <FooterSection>
              <FooterHeading>About Us</FooterHeading>
              <FooterLink href="#">Our Story</FooterLink>
              <FooterLink href="#">Team</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </FooterSection>
            <FooterSection>
              <FooterHeading>Products</FooterHeading>
              <FooterLink href="#">Social Network</FooterLink>
              <FooterLink href="#">E-commerce</FooterLink>
              <FooterLink href="#">E-learning</FooterLink>
              <FooterLink href="#">Job Marketplace</FooterLink>
            </FooterSection>
            <FooterSection>
              <FooterHeading>Resources</FooterHeading>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API</FooterLink>
              <FooterLink href="#">Tutorials</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </FooterSection>
            <FooterSection>
              <FooterHeading>Legal</FooterHeading>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">GDPR Compliance</FooterLink>
            </FooterSection>
          </FooterContent>
          <Copyright>
            &copy; {new Date().getFullYear()} Unified Platform. All rights reserved.
          </Copyright>
        </Container>
      </Footer>
    </LayoutWrapper>
  );
};

export default MainLayout;
