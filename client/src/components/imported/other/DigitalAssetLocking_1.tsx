import React from 'react';
import styled from 'styled-components';
import { useDigitalAssetManager } from '../../services/DigitalAssetManager';
import { Button } from '../ui/Button';

interface DigitalAssetLockingProps {
  userId: string;
  userAge: number;
}

const Container = styled.div`
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const AssetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AssetCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const AssetType = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const AssetValue = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const LockedBadge = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.warning};
  display: flex;
  align-items: center;
`;

const LockIcon = styled.span`
  margin-right: 0.3rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DigitalAssetLocking: React.FC<DigitalAssetLockingProps> = ({ userAge }) => {
  const { assets, lockAsset, unlockAsset } = useDigitalAssetManager();
  const isMinor = userAge < 18;
  
  return (
    <Container>
      <Title>Digital Asset Management</Title>
      <Description>
        {isMinor ? 
          'As you are under 18 years old, your digital assets are automatically locked until you reach legal age. These assets will be compounded, minted, mined, and staked to maximize their growth during this period.' :
          'Manage your digital assets including reward points, staked assets, minted tokens, and mining rewards.'
        }
      </Description>
      
      <AssetGrid>
        {assets.map((asset, index) => (
          <AssetCard key={index}>
            <AssetType>{asset.type}</AssetType>
            <AssetValue>{asset.value}</AssetValue>
            {(isMinor || asset.locked) && (
              <LockedBadge>
                <LockIcon>🔒</LockIcon> 
                {isMinor ? 'Locked until age 18' : 'Locked for growth'}
              </LockedBadge>
            )}
          </AssetCard>
        ))}
      </AssetGrid>
      
      <ButtonContainer>
        <Button $variant="outline" disabled={isMinor}>
          Transfer Assets
        </Button>
        <Button $variant="primary" disabled={isMinor}>
          Manage Investments
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default DigitalAssetLocking;
