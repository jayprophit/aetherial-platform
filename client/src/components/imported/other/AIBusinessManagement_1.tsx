import React, { useState } from 'react';
import styled from 'styled-components';
import { useAIBusinessAgent } from '../../ai/services/AIBusinessAgent';
import { Button } from '../ui/Button';

interface AIBusinessManagementProps {
  userId: string;
  businessId?: string;
}

interface BusinessMetrics {
  sales: number;
  revenue: number;
  customers: number;
  transactions: number;
}

interface DigitalAssetAction {
  type: 'stake' | 'mint' | 'mine';
  amount: number;
}

const Container = styled.div`
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionSection = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionTitle = styled.h4`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const ActionForm = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ActionSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 150px;
`;

const ActionInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 100px;
`;

const ResultMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
`;

const QuerySection = styled.div`
  margin-bottom: 1.5rem;
`;

const QueryInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const QueryResponse = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const AIBusinessManagement: React.FC<AIBusinessManagementProps> = ({ userId, businessId }) => {
  // In a real implementation, this would use the actual AIBusinessAgent
  // For demo purposes, we'll use mock data
  
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    sales: 152,
    revenue: 15750,
    customers: 87,
    transactions: 203
  });
  
  const [actionType, setActionType] = useState<'stake' | 'mint' | 'mine'>('stake');
  const [actionAmount, setActionAmount] = useState<number>(100);
  const [actionResult, setActionResult] = useState<string | null>(null);
  
  const [query, setQuery] = useState<string>('');
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  
  const handleAction = () => {
    // Simulate AI business agent action
    let result = '';
    
    switch (actionType) {
      case 'stake':
        result = `Successfully staked ${actionAmount} reward points. New staked balance: ${actionAmount * 1.05}. Staking yield: 8% APY.`;
        break;
      case 'mint':
        result = `Successfully minted ${actionAmount * 1.02} tokens from ${actionAmount} reward points. Minting bonus: 2%.`;
        break;
      case 'mine':
        result = `Mining operation started with ${actionAmount} computing power. Estimated daily rewards: ${actionAmount * 0.05}.`;
        break;
    }
    
    setActionResult(result);
  };
  
  const handleQuery = () => {
    if (!query.trim()) return;
    
    // Simulate AI response based on query
    let response = '';
    
    if (query.toLowerCase().includes('sales')) {
      response = 'To improve sales, consider optimizing your product listings, implementing targeted promotions, and leveraging customer data for personalized marketing campaigns.';
    } else if (query.toLowerCase().includes('inventory')) {
      response = 'Effective inventory management involves regular stock audits, implementing just-in-time ordering, and using predictive analytics to forecast demand.';
    } else if (query.toLowerCase().includes('customer')) {
      response = 'To enhance customer service, focus on quick response times, personalized interactions, and proactive issue resolution.';
    } else {
      response = 'I can help you with sales, inventory management, customer service, digital assets, and other business operations. Please ask a specific question.';
    }
    
    setQueryResponse(response);
  };
  
  return (
    <Container>
      <Title>AI Business Management</Title>
      <Description>
        Your AI business agent helps manage sales, inventory, customer service, invoices, and digital assets.
        Ask questions or perform actions to optimize your business operations.
      </Description>
      
      <MetricsGrid>
        <MetricCard>
          <MetricLabel>Total Sales</MetricLabel>
          <MetricValue>{metrics.sales}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Revenue</MetricLabel>
          <MetricValue>${metrics.revenue}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Customers</MetricLabel>
          <MetricValue>{metrics.customers}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Transactions</MetricLabel>
          <MetricValue>{metrics.transactions}</MetricValue>
        </MetricCard>
      </MetricsGrid>
      
      <ActionSection>
        <ActionTitle>Digital Asset Management</ActionTitle>
        <ActionForm>
          <ActionSelect 
            value={actionType}
            onChange={(e) => setActionType(e.target.value as 'stake' | 'mint' | 'mine')}
          >
            <option value="stake">Stake Assets</option>
            <option value="mint">Mint Tokens</option>
            <option value="mine">Start Mining</option>
          </ActionSelect>
          <ActionInput 
            type="number" 
            value={actionAmount}
            onChange={(e) => setActionAmount(Number(e.target.value))}
            min="1"
          />
          <Button $variant="primary" size="small" onClick={handleAction}>
            Execute
          </Button>
        </ActionForm>
        {actionResult && (
          <ResultMessage>
            {actionResult}
          </ResultMessage>
        )}
      </ActionSection>
      
      <QuerySection>
        <ActionTitle>Ask AI Business Agent</ActionTitle>
        <QueryInput 
          type="text"
          placeholder="Ask about sales, inventory, customer service, etc."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
        />
        <Button $variant="primary" onClick={handleQuery}>
          Ask
        </Button>
        
        {queryResponse && (
          <QueryResponse>
            {queryResponse}
          </QueryResponse>
        )}
      </QuerySection>
    </Container>
  );
};

export default AIBusinessManagement;
