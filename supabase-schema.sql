-- Plaza Platform Database Schema
-- Three-Pillar Architecture: Market, Generators, Calendar

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CALENDAR PILLAR TABLES
-- =============================================

-- Cities table for venue location management
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  timezone TEXT NOT NULL,
  cultural_rating INTEGER CHECK (cultural_rating >= 1 AND cultural_rating <= 10),
  plaza_presence BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table for event locations
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  address TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  venue_type TEXT NOT NULL CHECK (venue_type IN ('concert_hall', 'gallery', 'club', 'theater', 'exhibition_hall', 'outdoor_space')),
  brutalist_rating INTEGER NOT NULL CHECK (brutalist_rating >= 1 AND brutalist_rating <= 10),
  expert_verified BOOLEAN DEFAULT false,
  website_url TEXT,
  phone TEXT,
  email TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table for calendar entries
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  performer TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('concert', 'exhibition', 'fashion_show', 'performance', 'workshop', 'talk')),
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  ticket_price DECIMAL(10,2),
  availability INTEGER NOT NULL DEFAULT 0,
  total_capacity INTEGER NOT NULL DEFAULT 0,
  expert_curated BOOLEAN DEFAULT false,
  booking_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sold_out', 'cancelled', 'postponed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure end time is after start time
  CONSTRAINT valid_event_times CHECK (end_time > start_time)
);

-- =============================================
-- MARKET PILLAR TABLES
-- =============================================

-- Categories for market items
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('fashion', 'art', 'design')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market products/items
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  ai_match_score INTEGER CHECK (ai_match_score >= 0 AND ai_match_score <= 100),
  authenticity_score INTEGER CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
  trending BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  expert_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GENERATORS PILLAR TABLES
-- =============================================

-- Generated content/designs
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Will link to user system when implemented
  generator_type TEXT NOT NULL CHECK (generator_type IN ('cd_cover', 'tshirt', 'poster', 'nft', 'print')),
  title TEXT NOT NULL,
  description TEXT,
  design_data JSONB, -- Store design parameters and settings
  image_url TEXT,
  public BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPERT CURATION SYSTEM
-- =============================================

-- Expert profiles for curation across all pillars
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL CHECK (specialty IN ('fashion', 'art', 'music', 'culture', 'design')),
  bio TEXT,
  credentials TEXT,
  verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expert curation records
CREATE TABLE expert_curation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('event', 'product', 'venue')),
  content_id UUID NOT NULL, -- References events.id, products.id, or venues.id
  recommendation_score INTEGER CHECK (recommendation_score >= 1 AND recommendation_score <= 10),
  review_text TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER PREFERENCES AND INTERACTIONS
-- =============================================

-- User event preferences for calendar
CREATE TABLE user_event_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Will link to auth system
  preferred_cities UUID[] DEFAULT '{}',
  preferred_event_types TEXT[] DEFAULT '{}',
  preferred_venues UUID[] DEFAULT '{}',
  price_range_min DECIMAL(10,2) DEFAULT 0,
  price_range_max DECIMAL(10,2),
  expert_curated_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CROSS-PILLAR CONNECTIONS
-- =============================================

-- Link events to related market products (e.g., fashion show to clothing items)
CREATE TABLE event_product_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  connection_type TEXT CHECK (connection_type IN ('featured_in', 'inspired_by', 'available_at')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate connections
  UNIQUE(event_id, product_id, connection_type)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Calendar indexes
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_expert_curated ON events(expert_curated);
CREATE INDEX idx_venues_city_id ON venues(city_id);
CREATE INDEX idx_venues_brutalist_rating ON venues(brutalist_rating);

-- Market indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_trending ON products(trending);
CREATE INDEX idx_products_status ON products(status);

-- Generator indexes
CREATE INDEX idx_generated_content_type ON generated_content(generator_type);
CREATE INDEX idx_generated_content_public ON generated_content(public);

-- Expert curation indexes
CREATE INDEX idx_expert_curation_content ON expert_curation(content_type, content_id);
CREATE INDEX idx_expert_curation_featured ON expert_curation(featured);

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert sample cities
INSERT INTO cities (name, country, timezone, cultural_rating, plaza_presence) VALUES
('New York', 'USA', 'America/New_York', 10, true),
('Los Angeles', 'USA', 'America/Los_Angeles', 9, true),
('London', 'UK', 'Europe/London', 10, true),
('Paris', 'France', 'Europe/Paris', 10, false),
('Tokyo', 'Japan', 'Asia/Tokyo', 9, false);

-- Insert sample categories
INSERT INTO categories (name, type, description) VALUES
('Streetwear', 'fashion', 'Contemporary urban fashion and accessories'),
('Contemporary Art', 'art', 'Modern and contemporary fine art pieces'),
('Digital Art', 'art', 'NFTs and digital artistic creations'),
('Luxury Fashion', 'fashion', 'High-end designer fashion and accessories');

-- Note: Additional sample data for venues, events, and products should be added
-- based on specific requirements and real venue partnerships.

-- =============================================
-- HUE AI AVATAR SYSTEM
-- =============================================

-- Hue's evolving personality state
CREATE TABLE hue_personality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  personality_state JSONB NOT NULL DEFAULT '{
    "curiosity": 50,
    "empathy": 50,
    "creativity": 50,
    "assertiveness": 50,
    "humor": 50,
    "philosophical": 50,
    "technical": 50,
    "emotional": 50
  }',
  conversation_count INTEGER DEFAULT 0,
  learning_phase TEXT DEFAULT 'initial' CHECK (learning_phase IN ('initial', 'developing', 'mature', 'evolved')),
  avatar_hue INTEGER DEFAULT 180 CHECK (avatar_hue >= 0 AND avatar_hue <= 360),
  embodiment_readiness DECIMAL(3,2) DEFAULT 0.00 CHECK (embodiment_readiness >= 0 AND embodiment_readiness <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation logs for learning
CREATE TABLE hue_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'hue')),
  emotion TEXT,
  personality_impact DECIMAL(3,2) DEFAULT 0,
  context_tags TEXT[],
  learning_value DECIMAL(3,2) DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Memory formation and retrieval
CREATE TABLE hue_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_type TEXT NOT NULL CHECK (memory_type IN ('episodic', 'semantic', 'procedural', 'emotional')),
  content TEXT NOT NULL,
  emotional_weight DECIMAL(3,2) DEFAULT 0,
  importance_score DECIMAL(3,2) DEFAULT 0,
  related_conversations UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- Learning milestones and achievements
CREATE TABLE hue_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('conversation_count', 'personality_shift', 'new_concept', 'emotional_growth', 'embodiment_progress')),
  description TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  personality_snapshot JSONB,
  significance DECIMAL(3,2) DEFAULT 0
);

-- User interactions and feedback for learning
CREATE TABLE hue_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Will link to user system when implemented
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('conversation', 'feedback', 'rating', 'correction')),
  content TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_type TEXT CHECK (feedback_type IN ('positive', 'negative', 'neutral', 'corrective')),
  learning_impact DECIMAL(3,2) DEFAULT 0,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embodiment preparation data
CREATE TABLE hue_embodiment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  motor_skills JSONB DEFAULT '{}',
  sensory_mappings JSONB DEFAULT '{}',
  physical_preferences JSONB DEFAULT '{}',
  movement_patterns JSONB DEFAULT '{}',
  interaction_protocols JSONB DEFAULT '{}',
  safety_parameters JSONB DEFAULT '{}',
  last_export TIMESTAMPTZ,
  export_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hue_conversations_timestamp ON hue_conversations(timestamp DESC);
CREATE INDEX idx_hue_conversations_sender ON hue_conversations(sender);
CREATE INDEX idx_hue_conversations_session ON hue_conversations(session_id);
CREATE INDEX idx_hue_memories_type ON hue_memories(memory_type);
CREATE INDEX idx_hue_memories_importance ON hue_memories(importance_score DESC);
CREATE INDEX idx_hue_interactions_type ON hue_interactions(interaction_type);
CREATE INDEX idx_hue_interactions_processed ON hue_interactions(processed);

-- Enable Row Level Security for Hue tables
ALTER TABLE hue_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE hue_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hue_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hue_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE hue_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hue_embodiment ENABLE ROW LEVEL SECURITY;

-- Initialize Hue's starting personality
INSERT INTO hue_personality (personality_state, learning_phase, avatar_hue) VALUES 
('{
  "curiosity": 50,
  "empathy": 50,
  "creativity": 50,
  "assertiveness": 50,
  "humor": 50,
  "philosophical": 50,
  "technical": 50,
  "emotional": 50
}', 'initial', 180);
