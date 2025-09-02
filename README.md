# plaza - Expert-Curated Digital Marketplace

A premium digital marketplace that combines fashion and fine art sales with expert curation and intelligent features. Built with a brutalist design philosophy for a powerful, futuristic user experience.

## 🎯 Project Overview

plaza is an expert-curated marketplace where human specialists and intelligent tools enhance every aspect of buying and selling luxury items. The platform features:

- **Visual Search & Discovery**: Upload images to find similar items
- **Expert Authentication**: Specialists verify authenticity
- **Market Intelligence**: Real-time pricing and trend analysis
- **Personalized Curation**: Stylists curate based on user preferences
- **Brutalist Design**: Bold, geometric interface with glass elements

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom brutalist design system
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber
- **Icons**: Lucide React
- **Typography**: Space Grotesk + JetBrains Mono
- **Language**: TypeScript

## 🎨 Design Philosophy - BRUTALIST FUTURISM

### Visual Identity
- **Monochrome palette**: Pure black text on white background
- **Glass panels**: Semi-transparent sections with backdrop blur
- **Bold typography**: Space Grotesk for headers, JetBrains Mono for data
- **Geometric layouts**: Mathematical precision and rigid alignment
- **Rounded corners**: Futuristic touch with rounded-2xl and rounded-3xl
- **No decorative elements**: Function-first, raw digital architecture

### Key Design Elements
- `glass-panel`: Semi-transparent white with backdrop blur
- `glass-panel-strong`: Higher opacity glass for emphasis
- `btn-brutal`: Black buttons with white hover states
- `ai-badge`: Monospace badges for AI confidence scores
- `heading-xl/lg/md`: Responsive typography hierarchy
- `mono-text`: Data and technical information styling

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plaza
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── browse/            # Product browsing with filters
│   ├── sell/              # Seller dashboard with AI optimization
│   ├── globals.css        # Brutalist design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage with hero section
└── components/            # Reusable components
    ├── Header.tsx         # Navigation with AI search
    ├── ProductCard.tsx    # Product display with AI metrics
    └── AISearchInterface.tsx # Advanced search with image upload
```

## 🤖 AI Features Implemented

### 1. Visual Search Interface
- **Image upload**: Drag & drop or click to upload
- **AI analysis**: Simulated processing with confidence scores
- **Multi-modal search**: Text, image, and voice input modes
- **Real-time suggestions**: Dynamic search recommendations

### 2. Product Intelligence
- **AI Match scores**: Percentage-based relevance scoring
- **Authenticity verification**: ML-powered authenticity badges
- **Trend indicators**: Real-time trending status
- **Price intelligence**: Market-based pricing suggestions

### 3. Smart Marketplace Features
- **Personalized feeds**: AI-curated product recommendations
- **Advanced filtering**: Multi-dimensional product filtering
- **Market analytics**: Real-time market data and insights
- **Seller optimization**: AI-powered listing enhancement

## 🎯 Key Components

### Header Component
- Sticky navigation with backdrop blur
- AI-powered search with real-time suggestions
- Visual search upload functionality
- User account and cart access

### ProductCard Component
- AI confidence indicators
- Authenticity badges
- Trending status
- Interactive hover states
- Social proof metrics

### AISearchInterface Component
- Multi-modal search (text, image, voice)
- Real-time AI insights
- Expandable interface
- Processing animations

## 🎨 Design System Classes

### Typography
- `heading-xl`: Hero headings (2.5rem - 6rem)
- `heading-lg`: Section headings (1.5rem - 3rem)
- `heading-md`: Component headings (1rem - 1.5rem)
- `body-text`: Regular content
- `mono-text`: Technical data and metrics

### Components
- `glass-panel`: Semi-transparent containers
- `btn-brutal`: Primary action buttons
- `btn-brutal-outline`: Secondary buttons
- `ai-badge`: AI confidence indicators

### Layout
- `border-brutal`: 2px black borders
- `rounded-3xl`: Consistent border radius
- `backdrop-blur-md`: Glass effect

## 🚀 Development Roadmap

### Phase 1: MVP (Current)
- ✅ Brutalist design system
- ✅ Core marketplace structure
- ✅ AI search interface
- ✅ Product cards with AI metrics
- ✅ Browse and sell pages

### Phase 2: Intelligence (Next)
- [ ] Real AI integration (OpenAI Vision API)
- [ ] User authentication system
- [ ] Database integration
- [ ] Payment processing
- [ ] Advanced filtering

### Phase 3: Advanced Features
- [ ] 3D product previews
- [ ] AR try-on capabilities
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

## 🎯 Performance Considerations

- **Image optimization**: Next.js Image component integration
- **Code splitting**: Automatic route-based splitting
- **Lazy loading**: Components load on demand
- **CDN ready**: Optimized for global deployment

## 🔧 Customization

### Adding New AI Features
1. Create component in `src/components/`
2. Follow brutalist design patterns
3. Use AI badge system for confidence scores
4. Implement glass panel styling

### Extending the Design System
1. Add new classes to `globals.css`
2. Follow monochrome color scheme
3. Use geometric shapes and sharp edges
4. Maintain consistent spacing

## 📊 Mock Data

The application currently uses mock data to demonstrate AI features:
- Product listings with AI scores
- Market intelligence data
- User interaction metrics
- Trend analysis

## 🌐 Deployment

Ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom hosting**

## 🤝 Contributing

1. Follow the brutalist design philosophy
2. Maintain AI-first approach
3. Use TypeScript for all new code
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## 📄 License

[Add your license here]

---

**plaza** - Where artificial intelligence meets luxury commerce.
