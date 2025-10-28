import React, { useState } from 'react';
import styled from 'styled-components';
import { useContentModerationSystem } from '../../services/ContentModerationSystem';
import { Button } from '../ui/Button';

interface ContentModerationProps {
  userId: string;
  userAge: number;
}

interface ContentAnalysisResult {
  isAppropriate: boolean;
  categories?: {
    [key: string]: {
      detected: boolean;
      confidence: number;
      severity: string;
    }
  };
  recommendedAction?: string;
}

interface ResultContainerProps {
  $status: 'approved' | 'rejected' | 'restricted' | '';
}

interface ResultTitleProps {
  $status: 'approved' | 'rejected' | 'restricted' | '';
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

const ContentInput = styled.textarea`
  width: 100%;
  min-height: 120px;
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

const ResultContainer = styled.div<ResultContainerProps>`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  border-left: 4px solid ${props => 
    props.$status === 'approved' ? props.theme.colors.success : 
    props.$status === 'rejected' ? props.theme.colors.danger : 
    props.theme.colors.warning
  };
`;

const ResultTitle = styled.h4<ResultTitleProps>`
  font-size: 1.1rem;
  color: ${props => 
    props.$status === 'approved' ? props.theme.colors.success : 
    props.$status === 'rejected' ? props.theme.colors.danger : 
    props.theme.colors.warning
  };
  margin-bottom: 0.5rem;
`;

const ResultDetail = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const CategoryList = styled.div`
  margin-top: 1rem;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CategoryName = styled.div`
  font-weight: bold;
`;

const CategoryConfidence = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
`;

const AgeRestrictionBanner = styled.div`
  background-color: ${({ theme }) => theme.colors.warning};
  color: white;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: bold;
`;

const ContentModeration: React.FC<ContentModerationProps> = ({ userId, userAge }) => {
  // In a real implementation, this would use the actual ContentModerationSystem
  // For demo purposes, we'll use mock functionality
  
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('text');
  const [analysisResult, setAnalysisResult] = useState<ContentAnalysisResult | null>(null);
  
  const analyzeContent = () => {
    if (!content.trim()) return;
    
    // Simulate content analysis
    const lowerContent = content.toLowerCase();
    const result: ContentAnalysisResult = {
      isAppropriate: true,
      categories: {}
    };
    
    // Simple keyword detection for demo purposes
    const keywords = {
      hate: ['hate', 'racist', 'discrimination'],
      violence: ['kill', 'attack', 'fight', 'hurt'],
      sexual: ['sex', 'explicit', 'nude'],
      harassment: ['stupid', 'idiot', 'loser'],
      spam: ['buy now', 'click here', 'free money'],
      misinformation: ['fake news', 'conspiracy']
    };
    
    // Check each category
    for (const [category, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (lowerContent.includes(word)) {
          if (!result.categories) result.categories = {};
          
          result.categories[category] = {
            detected: true,
            confidence: 0.85 + Math.random() * 0.1,
            severity: category === 'hate' || category === 'violence' || category === 'sexual' ? 'high' : 'medium'
          };
          result.isAppropriate = false;
          result.recommendedAction = category === 'hate' || category === 'violence' || category === 'sexual' ? 
            'ban_temporary' : 'warning';
          break;
        }
      }
    }
    
    // Check age-appropriate content
    if (userAge < 18 && (
      lowerContent.includes('adult') || 
      lowerContent.includes('mature') || 
      lowerContent.includes('18+')
    )) {
      result.isAppropriate = false;
      result.recommendedAction = 'age_restricted';
      
      if (!result.categories) result.categories = {};
      result.categories['age_restricted'] = {
        detected: true,
        confidence: 0.95,
        severity: 'medium'
      };
    }
    
    setAnalysisResult(result);
  };
  
  const getResultStatus = () => {
    if (!analysisResult) return '';
    
    if (analysisResult.isAppropriate) {
      return 'approved';
    } else if (analysisResult.recommendedAction === 'age_restricted') {
      return 'restricted';
    } else {
      return 'rejected';
    }
  };
  
  const getResultTitle = () => {
    const status = getResultStatus();
    
    switch (status) {
      case 'approved':
        return 'Content Approved';
      case 'restricted':
        return 'Age-Restricted Content';
      case 'rejected':
        return 'Content Rejected';
      default:
        return '';
    }
  };
  
  const getResultMessage = () => {
    const status = getResultStatus();
    
    switch (status) {
      case 'approved':
        return 'This content meets our community guidelines and is appropriate for all users.';
      case 'restricted':
        return `This content is not suitable for users under 18 years old. ${userAge < 18 ? 'You do not meet the age requirement to view this content.' : ''}`;
      case 'rejected':
        return 'This content violates our community guidelines and cannot be posted.';
      default:
        return '';
    }
  };
  
  return (
    <Container>
      <Title>Content Moderation</Title>
      
      <Description>
        All content is automatically monitored for compliance with our community guidelines.
        Content that violates these guidelines may result in temporary or permanent bans.
      </Description>
      
      {userAge < 13 && (
        <AgeRestrictionBanner>
          Users under 13 have limited access to chat rooms and messaging features.
        </AgeRestrictionBanner>
      )}
      
      <div>
        <label htmlFor="contentType" style={{ marginBottom: '0.5rem', display: 'block' }}>Content Type:</label>
        <select 
          id="contentType"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          style={{ 
            padding: '0.5rem', 
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #e0e0e0'
          }}
        >
          <option value="text">Text Post</option>
          <option value="comment">Comment</option>
          <option value="message">Private Message</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="content" style={{ marginBottom: '0.5rem', display: 'block' }}>Enter Content to Check:</label>
        <ContentInput
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type content to analyze for compliance with community guidelines..."
        />
      </div>
      
      <Button $variant="primary" onClick={analyzeContent}>
        Check Content
      </Button>
      
      {analysisResult && (
        <ResultContainer $status={getResultStatus() as 'approved' | 'rejected' | 'restricted' | ''}>
          <ResultTitle $status={getResultStatus() as 'approved' | 'rejected' | 'restricted' | ''}>{getResultTitle()}</ResultTitle>
          <ResultDetail>{getResultMessage()}</ResultDetail>
          
          {analysisResult.categories && Object.keys(analysisResult.categories).length > 0 && (
            <CategoryList>
              <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Detected Issues:</div>
              {Object.entries(analysisResult.categories).map(([category, data]) => (
                <CategoryItem key={category}>
                  <CategoryName>{category.charAt(0).toUpperCase() + category.slice(1)}</CategoryName>
                  <CategoryConfidence>
                    {Math.round(data.confidence * 100)}% confidence • {data.severity} severity
                  </CategoryConfidence>
                </CategoryItem>
              ))}
            </CategoryList>
          )}
          
          {!analysisResult.isAppropriate && analysisResult.recommendedAction && (
            <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
              Recommended action: {
                analysisResult.recommendedAction === 'warning' ? 'Warning' :
                analysisResult.recommendedAction === 'ban_temporary' ? 'Temporary ban' :
                analysisResult.recommendedAction === 'ban_permanent' ? 'Permanent ban' :
                analysisResult.recommendedAction === 'age_restricted' ? 'Age restriction' :
                analysisResult.recommendedAction
              }
            </div>
          )}
        </ResultContainer>
      )}
    </Container>
  );
};

export default ContentModeration;
