-- Aetherial Platform Database Initialization
-- Sample schema and data for demo

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    thumbnail_url TEXT,
    students_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, email, password_hash, full_name, bio) VALUES
('demo_user', 'demo@aetherial.com', '$2a$10$demo_hash', 'Demo User', 'Welcome to Aetherial Platform!'),
('instructor1', 'instructor@aetherial.com', '$2a$10$demo_hash', 'John Instructor', 'Teaching AI and Web Development'),
('seller1', 'seller@aetherial.com', '$2a$10$demo_hash', 'Jane Seller', 'Selling amazing products')
ON CONFLICT (username) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (user_id, content, likes_count) VALUES
(1, 'Welcome to Aetherial! This is the future of unified platforms. 🚀', 42),
(1, 'Just completed my first course on Aetherial. Amazing experience! 📚', 28),
(2, 'New AI course launching next week. Stay tuned! 🤖', 15)
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (instructor_id, title, description, price, students_count, rating) VALUES
(2, 'Introduction to AI and Machine Learning', 'Learn the fundamentals of AI and ML with hands-on projects', 49.99, 1250, 4.8),
(2, 'Web Development Masterclass', 'Complete guide to modern web development with React and Node.js', 79.99, 890, 4.9),
(2, 'Blockchain Development', 'Build decentralized applications with Ethereum and Solidity', 99.99, 567, 4.7)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (seller_id, name, description, price, stock, category) VALUES
(3, 'Aetherial T-Shirt', 'Official Aetherial branded t-shirt', 29.99, 100, 'Apparel'),
(3, 'AI Development Toolkit', 'Complete toolkit for AI developers', 149.99, 50, 'Software'),
(3, 'Blockchain Starter Pack', 'Everything you need to start with blockchain', 199.99, 25, 'Software')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

