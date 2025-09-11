# Plaza Font System

## Three-Tier Typography Hierarchy

### 🎯 **Primary Font: Union Helvetica**
- **Usage**: Headlines, main content, body text
- **Character**: Bold, architectural, brutalist
- **Classes**: `.heading-xl`, `.heading-lg`, `.heading-md`, `.body-text`
- **Files**: Located in `/public/fonts/unionforplaza/`

### 🔧 **Secondary Font: JetBrains Mono**
- **Usage**: Technical elements, data, code, timestamps
- **Character**: Technical, precise, monospaced
- **Classes**: `.mono-text`
- **Source**: Google Fonts import

### 🧭 **Tertiary Font: Space Grotesk**
- **Usage**: Navigation, UI elements, buttons, labels
- **Character**: Clean, minimal, modern
- **Classes**: `.nav-text`, `.nav-text-medium`, `.nav-text-bold`
- **Source**: Google Fonts import

## Implementation Examples

### Navigation Elements
```tsx
// Use Space Grotesk for all navigation
<a className="nav-text-medium uppercase tracking-wide">BROWSE</a>
<button className="nav-text text-xs">export</button>
```

### Headlines
```tsx
// Use Union Helvetica for main headlines
<h1 className="heading-xl">PLAZA</h1>
<h2 className="heading-lg">Welcome</h2>
```

### Technical Data
```tsx
// Use JetBrains Mono for technical elements
<span className="mono-text text-xs">HUE: 180°</span>
<div className="mono-text text-sm">LOADING...</div>
```

## Font Loading Strategy

1. **Union Helvetica**: Custom font files with fallbacks
2. **JetBrains Mono**: Google Fonts with local fallback
3. **Space Grotesk**: Google Fonts with system fallbacks

## Accessibility Notes

- All fonts maintain proper contrast ratios
- Fallback fonts ensure readability if custom fonts fail
- Font sizes use `clamp()` for responsive scaling
- Letter spacing optimized for each font's character
