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

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProductCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background-color: #F1F5F9;
  background-image: ${props => props.style?.backgroundImage || 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem 0.5rem 0 0;
  margin: -1.5rem -1.5rem 1rem -1.5rem;
`;

const ProductTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #4A6CF7;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #64748B;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  color: #F59E0B;
`;

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: #64748B;
  background-color: #F1F5F9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
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

const CartSection = styled.div`
  position: sticky;
  top: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
`;

const CartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CartEmpty = styled.p`
  color: #64748B;
  margin-bottom: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E5E7EB;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItemTitle = styled.div`
  font-weight: 500;
`;

const CartItemPrice = styled.div`
  color: #4A6CF7;
  font-weight: 600;
`;

const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F1F5F9;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #E2E8F0;
  }
`;

const QuantityValue = styled.span`
  margin: 0 0.5rem;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #E5E7EB;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AIRecommendation = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #EFF6FF;
  border-radius: 0.5rem;
  border-left: 4px solid #4A6CF7;
`;

const AIRecommendationTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  &::before {
    content: '🤖';
    margin-right: 0.5rem;
  }
`;

// Sample products data
const PRODUCTS = [
  {
    id: 1,
    title: 'Wireless Headphones',
    price: 129.99,
    description: 'Premium wireless headphones with noise cancellation and 40-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: 4.8,
    category: 'Electronics',
  },
  {
    id: 2,
    title: 'Smart Watch',
    price: 199.99,
    description: 'Advanced smartwatch with health monitoring, GPS, and customizable watch faces.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    rating: 4.6,
    category: 'Electronics',
  },
  {
    id: 3,
    title: 'Ergonomic Office Chair',
    price: 249.99,
    description: 'Comfortable ergonomic chair with lumbar support and adjustable features.',
    image: 'https://images.unsplash.com/photo-1505843490701-5be5d1b31f8f',
    rating: 4.5,
    category: 'Furniture',
  },
  {
    id: 4,
    title: 'Professional Camera',
    price: 899.99,
    description: 'High-resolution digital camera with advanced features for professional photography.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    rating: 4.9,
    category: 'Electronics',
  },
  {
    id: 5,
    title: 'Fitness Tracker',
    price: 79.99,
    description: 'Waterproof fitness tracker with heart rate monitoring and sleep tracking.',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288',
    rating: 4.3,
    category: 'Fitness',
  },
  {
    id: 6,
    title: 'Portable Bluetooth Speaker',
    price: 89.99,
    description: 'Compact Bluetooth speaker with 360° sound and 12-hour battery life.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    rating: 4.4,
    category: 'Electronics',
  },
];

// EcommercePage component
const EcommercePage: React.FC = () => {
  const [cart, setCart] = useState<Array<{ product: typeof PRODUCTS[0], quantity: number }>>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [isClient, setIsClient] = useState(false);

  // Fix for hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const filteredProducts = PRODUCTS.filter(product => 
    categoryFilter === 'All' || product.category === categoryFilter
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const categories = ['All', ...new Set(PRODUCTS.map(product => product.category))];

  if (!isClient) {
    return null;
  }

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader>
          <PageTitle>E-commerce Marketplace</PageTitle>
          <PageDescription>
            Discover and purchase high-quality products from our trusted sellers.
          </PageDescription>
        </PageHeader>
        
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
            </FilterSelect>
          </FilterGroup>
        </FiltersContainer>
        
        <ContentGrid>
          <div>
            <ProductsGrid>
              {sortedProducts.map(product => (
                <ProductCard key={product.id} $elevated $rounded>
                  <ProductImage style={{ backgroundImage: `url(${product.image})` }} />
                  <ProductMeta>
                    <ProductCategory>{product.category}</ProductCategory>
                    <ProductRating>
                      ★ {product.rating.toFixed(1)}
                    </ProductRating>
                  </ProductMeta>
                  <ProductTitle>{product.title}</ProductTitle>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  <ProductDescription>{product.description}</ProductDescription>
                  <Button 
                    variant="primary" 
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </ProductCard>
              ))}
            </ProductsGrid>
            
            <AIRecommendation>
              <AIRecommendationTitle>AI Product Recommendations</AIRecommendationTitle>
              <p>Based on your browsing history and preferences, you might also be interested in wireless earbuds, laptop stands, and ergonomic keyboards.</p>
            </AIRecommendation>
          </div>
          
          <div>
            <CartSection>
              <CartTitle>Your Cart</CartTitle>
              
              {cart.length === 0 ? (
                <CartEmpty>Your cart is empty.</CartEmpty>
              ) : (
                <>
                  {cart.map(item => (
                    <CartItem key={item.product.id}>
                      <CartItemInfo>
                        <CartItemTitle>{item.product.title}</CartItemTitle>
                        <CartItemPrice>${item.product.price.toFixed(2)}</CartItemPrice>
                      </CartItemInfo>
                      <CartItemQuantity>
                        <QuantityButton onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                          -
                        </QuantityButton>
                        <QuantityValue>{item.quantity}</QuantityValue>
                        <QuantityButton onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          +
                        </QuantityButton>
                      </CartItemQuantity>
                    </CartItem>
                  ))}
                  
                  <CartTotal>
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </CartTotal>
                  
                  <Button 
                    variant="primary" 
                    $fullWidth 
                    style={{ marginTop: '1rem' }}
                  >
                    Checkout
                  </Button>
                </>
              )}
            </CartSection>
          </div>
        </ContentGrid>
      </PageContainer>
    </MainLayout>
  );
};

export default EcommercePage;
