import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/_core/hooks/useAuth';

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      username: '@sarahj'
    },
    content: 'Just completed my first course on blockchain development! 🎓 The Aetherial learning platform is amazing. Earned 50 AETH tokens as a reward!',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    shares: 2
  },
  {
    id: 2,
    author: {
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      username: '@mchen'
    },
    content: 'My new AI agent just made its first sale! 🤖💰 Automated e-commerce is the future. Check out the AI Agents marketplace if you want to create your own!',
    timestamp: '5 hours ago',
    likes: 42,
    comments: 12,
    shares: 8
  },
  {
    id: 3,
    author: {
      name: 'Emma Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      username: '@emmad'
    },
    content: 'Just set up my smart home with Aetherial IoT! All my devices are now connected and earning me passive AETH. The automation features are incredible! 🏠✨',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop',
    timestamp: '1 day ago',
    likes: 67,
    comments: 18,
    shares: 15
  }
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    // TODO: Implement post creation
    console.log('Creating post:', postContent);
    setPostContent('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Post Composer */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[100px] resize-none border-0 focus-visible:ring-0 p-0"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Smile className="h-4 w-4" />
                  Emoji
                </Button>
              </div>
              <Button onClick={handlePost} disabled={!postContent.trim()}>
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Feed */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-800">{post.content}</p>
              
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg object-cover max-h-96"
                />
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

