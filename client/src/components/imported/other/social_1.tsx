import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';

const SocialPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch posts from API
    const fetchPosts = async () => {
      try {
        // In a real implementation, this would call the backend API
        // For demo purposes, we'll use mock data
        const mockPosts = [
          {
            id: '1',
            user: {
              id: '1',
              name: 'Demo User',
              avatar: 'https://via.placeholder.com/40'
            },
            content: 'Excited to try out this new unified platform! The integration between social, e-commerce, and learning looks promising.',
            likes: 24,
            comments: 5,
            createdAt: '2025-05-18T14:22:00Z'
          },
          {
            id: '2',
            user: {
              id: '2',
              name: 'Jane Smith',
              avatar: 'https://via.placeholder.com/40'
            },
            content: 'Just completed an amazing course on AI development. The platform made it so easy to learn and apply the concepts immediately.',
            likes: 42,
            comments: 8,
            createdAt: '2025-05-18T12:15:00Z'
          },
          {
            id: '3',
            user: {
              id: '3',
              name: 'Alex Johnson',
              avatar: 'https://via.placeholder.com/40'
            },
            content: 'Found an incredible product through the AI recommendation engine. It knew exactly what I needed before I did!',
            likes: 18,
            comments: 3,
            createdAt: '2025-05-18T10:05:00Z'
          }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll simulate adding a new post
      const newPost = {
        id: Date.now().toString(),
        user: {
          id: '1',
          name: 'Demo User',
          avatar: 'https://via.placeholder.com/40'
        },
        content: newPostContent,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString()
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
  };

  return (
    <SocialPageContainer>
      <SocialHeader>
        <h1>Social Feed</h1>
        <p>Connect with friends, colleagues, and communities</p>
      </SocialHeader>
      
      <SocialLayout>
        <MainContent>
          <CreatePostCard>
            <CardHeader>Create Post</CardHeader>
            <CardBody>
              <PostForm onSubmit={handleSubmitPost}>
                <PostInput
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newPostContent.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </PostForm>
            </CardBody>
          </CreatePostCard>
          
          <FeedSection>
            <SectionTitle>Latest Posts</SectionTitle>
            
            {isLoading ? (
              <LoadingMessage>Loading posts...</LoadingMessage>
            ) : posts.length === 0 ? (
              <EmptyMessage>No posts yet. Be the first to post!</EmptyMessage>
            ) : (
              <PostsList>
                {posts.map(post => (
                  <PostCard key={post.id}>
                    <PostHeader>
                      <UserAvatar src={post.user.avatar} alt={post.user.name} />
                      <UserInfo>
                        <UserName>{post.user.name}</UserName>
                        <PostTime>{formatDate(post.createdAt)}</PostTime>
                      </UserInfo>
                    </PostHeader>
                    <PostContent>{post.content}</PostContent>
                    <PostFooter>
                      <PostStat onClick={() => handleLikePost(post.id)}>
                        <span>👍</span> {post.likes} Likes
                      </PostStat>
                      <PostStat>
                        <span>💬</span> {post.comments} Comments
                      </PostStat>
                      <PostStat>
                        <span>↗️</span> Share
                      </PostStat>
                    </PostFooter>
                  </PostCard>
                ))}
              </PostsList>
            )}
          </FeedSection>
        </MainContent>
        
        <Sidebar>
          <SidebarCard>
            <CardHeader>Your Profile</CardHeader>
            <CardBody>
              <ProfilePreview>
                <ProfileAvatar>👤</ProfileAvatar>
                <ProfileName>Demo User</ProfileName>
                <ProfileBio>Platform explorer and technology enthusiast</ProfileBio>
                <Button variant="outline" size="small">View Profile</Button>
              </ProfilePreview>
            </CardBody>
          </SidebarCard>
          
          <SidebarCard>
            <CardHeader>Trending Topics</CardHeader>
            <CardBody>
              <TrendingList>
                <TrendingItem>
                  <TrendingTag>#AIInnovation</TrendingTag>
                  <TrendingCount>1.2K posts</TrendingCount>
                </TrendingItem>
                <TrendingItem>
                  <TrendingTag>#EcommerceTips</TrendingTag>
                  <TrendingCount>856 posts</TrendingCount>
                </TrendingItem>
                <TrendingItem>
                  <TrendingTag>#LearningJourney</TrendingTag>
                  <TrendingCount>743 posts</TrendingCount>
                </TrendingItem>
                <TrendingItem>
                  <TrendingTag>#TechCareers</TrendingTag>
                  <TrendingCount>612 posts</TrendingCount>
                </TrendingItem>
                <TrendingItem>
                  <TrendingTag>#DigitalCreators</TrendingTag>
                  <TrendingCount>589 posts</TrendingCount>
                </TrendingItem>
              </TrendingList>
            </CardBody>
          </SidebarCard>
          
          <SidebarCard>
            <CardHeader>Suggested Connections</CardHeader>
            <CardBody>
              <ConnectionsList>
                <ConnectionItem>
                  <ConnectionAvatar>👩‍💼</ConnectionAvatar>
                  <ConnectionInfo>
                    <ConnectionName>Sarah Johnson</ConnectionName>
                    <ConnectionTitle>UX Designer</ConnectionTitle>
                  </ConnectionInfo>
                  <Button variant="outline" size="small">Connect</Button>
                </ConnectionItem>
                <ConnectionItem>
                  <ConnectionAvatar>👨‍💻</ConnectionAvatar>
                  <ConnectionInfo>
                    <ConnectionName>Michael Chen</ConnectionName>
                    <ConnectionTitle>Software Engineer</ConnectionTitle>
                  </ConnectionInfo>
                  <Button variant="outline" size="small">Connect</Button>
                </ConnectionItem>
                <ConnectionItem>
                  <ConnectionAvatar>👩‍🏫</ConnectionAvatar>
                  <ConnectionInfo>
                    <ConnectionName>Emily Rodriguez</ConnectionName>
                    <ConnectionTitle>Course Creator</ConnectionTitle>
                  </ConnectionInfo>
                  <Button variant="outline" size="small">Connect</Button>
                </ConnectionItem>
              </ConnectionsList>
            </CardBody>
            <CardFooter>
              <Button variant="text">View More</Button>
            </CardFooter>
          </SidebarCard>
        </Sidebar>
      </SocialLayout>
    </SocialPageContainer>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Styled Components
const SocialPageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SocialHeader = styled.div`
  text-align: center;
  margin: 2rem 0;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    font-size: 1.25rem;
    color: #4b5563;
  }
`;

const SocialLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CreatePostCard = styled(Card)`
  width: 100%;
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const FeedSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #111827;
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PostCard = styled(Card)`
  width: 100%;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #111827;
`;

const PostTime = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PostContent = styled.div`
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #1f2937;
`;

const PostFooter = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  gap: 1.5rem;
`;

const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  
  &:hover {
    color: #3b82f6;
  }
`;

const SidebarCard = styled(Card)`
  width: 100%;
`;

const ProfilePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const ProfileName = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  color: #111827;
`;

const ProfileBio = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TrendingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TrendingTag = styled.div`
  font-weight: 500;
  color: #3b82f6;
`;

const TrendingCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ConnectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ConnectionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ConnectionAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ConnectionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ConnectionName = styled.div`
  font-weight: 500;
  color: #111827;
`;

const ConnectionTitle = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

export default SocialPage;
