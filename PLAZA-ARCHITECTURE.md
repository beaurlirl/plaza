# Plaza - Three-Pillar Cultural Platform

## 🏗️ Architecture Overview

Plaza has been transformed from a simple marketplace into a comprehensive cultural platform built on three core pillars:

### 1. **MARKET** - Expert-Curated Commerce
- Premium fashion and fine art marketplace
- AI-powered authentication and verification
- Expert curation by fashion stylists and art specialists
- Investment insights and trend analysis

### 2. **GENERATORS** - Creative Tools
- CD Generator (implemented) - Holographic album cover design
- T-Shirt Generator (planned) - Custom apparel design
- Future tools: Posters, NFTs, art prints, custom designs
- User-generated content with marketplace integration

### 3. **CALENDAR** - Live City Culture
- Real-time venue performance tracking
- Cultural event discovery across major cities
- Expert-curated event recommendations
- Brutalist venue rating system (1-10 scale)

## 🎨 Design Philosophy

**Brutalist Digital Aesthetic**
- Bold, geometric typography using Union Helvetica
- Glass panel system with backdrop blur effects
- High contrast black/white color scheme
- Institutional weight with modern approachability

## 🔄 User Flow

```
LANDING (/) 
  ↓ [ENTER PLAZA button]
HOMEPAGE (/home)
  ↓ [Three-way navigation system]
├── MARKET (/browse)
├── GENERATORS (/tools) 
└── CALENDAR (/calendar)
```

## 📁 File Structure

```
src/
├── app/
│   ├── page.tsx              # Root redirect to /landing
│   ├── landing/page.tsx      # Brutal entry experience
│   ├── home/page.tsx         # Three-pillar navigation hub
│   ├── browse/page.tsx       # Market pillar
│   ├── tools/page.tsx        # Generators pillar hub
│   │   ├── cd-generator/     # CD design tool
│   │   └── tshirt-generator/ # T-shirt design tool (planned)
│   └── calendar/page.tsx     # Calendar pillar with venue/event system
├── components/
│   ├── Header.tsx            # Global navigation
│   ├── ProductCard.tsx       # Market item display
│   ├── AISearchInterface.tsx # Intelligent search
│   └── AIInsightPanel.tsx    # Expert insights
└── globals.css               # Brutalist design system
```

## 🛠️ Technical Stack

- **Next.js 15.1.3** with App Router
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** with custom brutalist components
- **Supabase** for database and real-time features
- **Lucide React** for icons

## 🎯 Key Features Implemented

### Landing Experience
- Minimal entry point with "ENTER PLAZA" button
- Smooth animations and brutalist typography
- Automatic redirect system

### Three-Pillar Homepage
- **Stacked Bubble Navigation** - Interactive glass panels
- **Live Preview Components** - Each pillar shows real-time content
- **Statistics Display** - Platform metrics and activity
- **Responsive Design** - Mobile-first approach

### Enhanced Calendar System
- **Venue-Centric Architecture** - Events tied to specific venues
- **Brutalist Rating System** - Venues rated 1-10 for aesthetic alignment
- **Expert Curation** - Cultural specialists recommend events
- **Dual View Modes** - Calendar grid and detailed list views
- **Advanced Filtering** - By city, event type, and search terms
- **Real-time Availability** - Live ticket and capacity updates

### Design System Components
- **Glass Panels** - `glass-panel`, `glass-panel-strong`, `glass-panel-dark`
- **Brutalist Buttons** - `btn-brutal`, `btn-brutal-outline`
- **Typography Hierarchy** - `heading-xl`, `heading-lg`, `heading-md`
- **Animation Classes** - Smooth transitions and micro-interactions

## 🗄️ Database Schema

The platform uses a comprehensive Supabase schema supporting all three pillars:

### Calendar Tables
- `cities` - Urban cultural hubs
- `venues` - Event locations with brutalist ratings
- `events` - Performances and cultural happenings

### Market Tables
- `categories` - Fashion/art classification
- `products` - Marketplace items with AI scoring
- `expert_curation` - Specialist recommendations

### Generator Tables
- `generated_content` - User-created designs
- Cross-pillar connections for marketplace integration

## 🎨 Expert Curation System

**Multi-Domain Specialists:**
- Fashion stylists for market curation
- Art specialists for authentication
- Cultural curators for event recommendations
- Music experts for venue and performance quality

**Curation Features:**
- Expert verification badges
- Recommendation scoring (1-10)
- Featured content promotion
- Cross-pillar content connections

## 🌐 Cross-Pillar Connections

**Market ↔ Calendar:**
- Fashion shows linked to designer marketplace items
- Art exhibitions connected to available pieces
- Event-driven product recommendations

**Generators ↔ Market:**
- Custom designs available for purchase
- User creations featured in curated collections
- Design-to-product pipeline

**Calendar ↔ Generators:**
- Event poster generation tools
- Venue-specific design templates
- Cultural event branding systems

## 🚀 Development Priorities

### Phase 1: Foundation ✅
- [x] Landing page with ENTER PLAZA flow
- [x] Three-pillar homepage navigation
- [x] Enhanced calendar with venue system
- [x] Design system implementation
- [x] Database schema design

### Phase 2: Integration (Next Steps)
- [ ] Supabase database connection
- [ ] Real venue/event data integration
- [ ] Expert network setup
- [ ] Cross-pillar content connections
- [ ] User preference system

### Phase 3: Expansion (Future)
- [ ] Multi-city rollout
- [ ] Advanced generator tools
- [ ] Mobile app development
- [ ] API partnerships with venues/ticketing

## 🎪 Mock Data Structure

The calendar currently uses enhanced mock data demonstrating:

```javascript
{
  title: "BRUTALIST FASHION SHOW",
  performer: "EMERGING DESIGNERS COLLECTIVE",
  event_type: "fashion_show",
  ticket_price: 85,
  expert_curated: true,
  venue: {
    name: "CONCRETE GALLERY",
    city: "NEW YORK",
    capacity: 200,
    brutalist_rating: 9,
    expert_verified: true
  }
}
```

## 🎨 Visual Design Elements

### Color Palette
- **Primary:** Pure Black (#000000)
- **Background:** Pure White (#ffffff)
- **Glass Effects:** White with opacity (70%-80%)
- **Accents:** Black with various opacities

### Typography
- **Headers:** Union Helvetica Bold, uppercase, tight tracking
- **Body:** Union Helvetica Regular, optimal line height
- **Monospace:** JetBrains Mono for data/technical content

### Interactive Elements
- **Hover States:** Smooth color inversions and transforms
- **Glass Panels:** Backdrop blur with subtle shadows
- **Buttons:** Brutal borders with hover animations
- **Cards:** Rounded corners balancing brutalism with approachability

## 🔧 Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Database Setup:**
   ```bash
   # Run the schema file in your Supabase SQL editor
   supabase-schema.sql
   ```

4. **Development Server:**
   ```bash
   npm run dev
   ```

## 🎯 Success Metrics

### Market Pillar
- Expert curation engagement rates
- Cross-category sales conversion
- Authentication accuracy scores
- Average transaction values

### Generators Pillar
- Tool usage frequency
- User-generated content quality
- Design-to-market conversion rates
- Creative tool adoption

### Calendar Pillar
- Event discovery conversion
- Venue partnership growth
- Expert recommendation engagement
- Cross-pillar navigation rates

---

Plaza represents a new model for cultural platforms - where commerce, creativity, and live experiences intersect in a brutalist digital environment that commands institutional respect while remaining approachable and modern.
