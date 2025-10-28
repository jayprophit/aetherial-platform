import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1.125rem;
  color: #64748B;
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CourseCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CourseImage = styled.div`
  height: 180px;
  background-color: #F1F5F9;
  background-image: ${props => props.style?.backgroundImage || 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem 0.5rem 0 0;
  margin: -1.5rem -1.5rem 1rem -1.5rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CoursePrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #4A6CF7;
  margin-bottom: 0.5rem;
`;

const CourseDescription = styled.p`
  color: #64748B;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const CourseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CourseRating = styled.div`
  display: flex;
  align-items: center;
  color: #F59E0B;
`;

const CourseCategory = styled.div`
  font-size: 0.875rem;
  color: #64748B;
  background-color: #F1F5F9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const CourseInstructor = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const InstructorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E2E8F0;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
`;

const InstructorName = styled.div`
  font-size: 0.875rem;
  color: #64748B;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #F8FAFC;
  border-radius: 0.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.375rem;
  
  &:focus {
    outline: none;
    border-color: #4A6CF7;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.2);
  }
`;

const AITutorSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: #EFF6FF;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AITutorIcon = styled.div`
  font-size: 4rem;
  color: #4A6CF7;
`;

const AITutorContent = styled.div`
  flex: 1;
`;

const AITutorTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const AITutorDescription = styled.p`
  color: #334155;
  margin-bottom: 1.5rem;
`;

const FeaturedCourseSection = styled.div`
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const FeaturedCourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FeaturedCourseTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
`;

const FeaturedCourseCard = styled(Card)`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedCourseImage = styled.div`
  height: 100%;
  min-height: 250px;
  background-color: #F1F5F9;
  background-image: ${props => props.style?.backgroundImage || 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
`;

const FeaturedCourseContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeaturedCourseStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #4A6CF7;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748B;
`;

// Sample courses data
const COURSES = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    price: 89.99,
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more to become a full-stack web developer.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    rating: 4.8,
    category: 'Web Development',
    instructor: 'John Smith',
    duration: '48 hours',
    students: 12500,
  },
  {
    id: 2,
    title: 'Data Science and Machine Learning',
    price: 99.99,
    description: 'Master data analysis, visualization, and machine learning algorithms with Python.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    rating: 4.7,
    category: 'Data Science',
    instructor: 'Emily Johnson',
    duration: '52 hours',
    students: 9800,
  },
  {
    id: 3,
    title: 'Digital Marketing Masterclass',
    price: 79.99,
    description: 'Learn SEO, social media marketing, email campaigns, and analytics to grow your business.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    rating: 4.6,
    category: 'Marketing',
    instructor: 'Michael Brown',
    duration: '36 hours',
    students: 8200,
  },
  {
    id: 4,
    title: 'Mobile App Development with Flutter',
    price: 94.99,
    description: 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    rating: 4.9,
    category: 'Mobile Development',
    instructor: 'Sarah Davis',
    duration: '45 hours',
    students: 7500,
  },
  {
    id: 5,
    title: 'Financial Analysis and Modeling',
    price: 109.99,
    description: 'Learn financial analysis, modeling techniques, and valuation methods for business decisions.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    rating: 4.5,
    category: 'Finance',
    instructor: 'Robert Wilson',
    duration: '40 hours',
    students: 6300,
  },
  {
    id: 6,
    title: 'Graphic Design Fundamentals',
    price: 69.99,
    description: 'Master the principles of graphic design, typography, color theory, and industry-standard tools.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d',
    rating: 4.7,
    category: 'Design',
    instructor: 'Jennifer Lee',
    duration: '32 hours',
    students: 9100,
  },
];

// Featured course
const FEATURED_COURSE = {
  id: 7,
  title: 'AI and Machine Learning: From Basics to Advanced',
  price: 129.99,
  description: 'A comprehensive course covering the fundamentals of artificial intelligence and machine learning, from basic concepts to advanced techniques. Learn about neural networks, deep learning, natural language processing, computer vision, and more. This course includes hands-on projects and real-world applications to help you master AI development.',
  image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
  rating: 4.9,
  category: 'Artificial Intelligence',
  instructor: 'Dr. Alex Morgan',
  duration: '60 hours',
  students: 15800,
  lessons: 120,
};

// LearningPage component
const LearningPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [isClient, setIsClient] = useState(false);

  // Fix for hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredCourses = COURSES.filter(course => 
    categoryFilter === 'All' || course.category === categoryFilter
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.students - a.students;
      default:
        return 0;
    }
  });

  const categories = ['All', ...new Set(COURSES.map(course => course.category))];

  if (!isClient) {
    return null;
  }

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader>
          <PageTitle>E-learning Platform</PageTitle>
          <PageDescription>
            Discover courses and expand your knowledge with our comprehensive learning platform.
          </PageDescription>
        </PageHeader>
        
        <FeaturedCourseSection>
          <FeaturedCourseHeader>
            <FeaturedCourseTitle>Featured Course</FeaturedCourseTitle>
          </FeaturedCourseHeader>
          
          <FeaturedCourseCard $elevated $rounded $padding="none">
            <FeaturedCourseImage style={{ backgroundImage: `url(${FEATURED_COURSE.image})` }} />
            <FeaturedCourseContent style={{ padding: '2rem' }}>
              <CourseMeta>
                <CourseCategory>{FEATURED_COURSE.category}</CourseCategory>
                <CourseRating>
                  ★ {FEATURED_COURSE.rating.toFixed(1)}
                </CourseRating>
              </CourseMeta>
              <CourseTitle style={{ fontSize: '1.75rem' }}>{FEATURED_COURSE.title}</CourseTitle>
              <CourseInstructor>
                <InstructorAvatar>{FEATURED_COURSE.instructor.charAt(0)}</InstructorAvatar>
                <InstructorName>{FEATURED_COURSE.instructor}</InstructorName>
              </CourseInstructor>
              <CourseDescription>{FEATURED_COURSE.description}</CourseDescription>
              
              <FeaturedCourseStats>
                <StatItem>
                  <StatValue>{FEATURED_COURSE.students.toLocaleString()}</StatValue>
                  <StatLabel>Students</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{FEATURED_COURSE.lessons}</StatValue>
                  <StatLabel>Lessons</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{FEATURED_COURSE.duration}</StatValue>
                  <StatLabel>Duration</StatLabel>
                </StatItem>
              </FeaturedCourseStats>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CoursePrice>${FEATURED_COURSE.price.toFixed(2)}</CoursePrice>
                <Button variant="primary">Enroll Now</Button>
              </div>
            </FeaturedCourseContent>
          </FeaturedCourseCard>
        </FeaturedCourseSection>
        
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel htmlFor="category">Category</FilterLabel>
            <FilterSelect 
              id="category" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="sort">Sort By</FilterLabel>
            <FilterSelect 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </FilterSelect>
          </FilterGroup>
        </FiltersContainer>
        
        <CoursesGrid>
          {sortedCourses.map(course => (
            <CourseCard key={course.id} $elevated $rounded>
              <CourseImage style={{ backgroundImage: `url(${course.image})` }} />
              <CourseMeta>
                <CourseCategory>{course.category}</CourseCategory>
                <CourseRating>
                  ★ {course.rating.toFixed(1)}
                </CourseRating>
              </CourseMeta>
              <CourseTitle>{course.title}</CourseTitle>
              <CourseInstructor>
                <InstructorAvatar>{course.instructor.charAt(0)}</InstructorAvatar>
                <InstructorName>{course.instructor}</InstructorName>
              </CourseInstructor>
              <CourseDescription>{course.description}</CourseDescription>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CoursePrice>${course.price.toFixed(2)}</CoursePrice>
                <Button variant="primary" size="small">Enroll</Button>
              </div>
            </CourseCard>
          ))}
        </CoursesGrid>
        
        <AITutorSection>
          <AITutorIcon>🤖</AITutorIcon>
          <AITutorContent>
            <AITutorTitle>Meet Your AI Tutor</AITutorTitle>
            <AITutorDescription>
              Our advanced AI tutor provides personalized learning assistance, answers your questions,
              helps with difficult concepts, and adapts to your learning style. Available 24/7 to support
              your educational journey.
            </AITutorDescription>
            <Button variant="primary">Try AI Tutor</Button>
          </AITutorContent>
        </AITutorSection>
      </PageContainer>
    </MainLayout>
  );
};

export default LearningPage;
