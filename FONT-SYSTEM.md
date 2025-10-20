# Plaza Font System

## Unified Typography Hierarchy

### 🎯 **Primary Font: Inter (Radio Grotesque Alternative)**
- **Usage**: All text elements - headlines, content, navigation, UI
- **Character**: Modern, clean, highly readable, versatile
- **Classes**: `.heading-xl`, `.heading-lg`, `.heading-md`, `.body-text`, `.nav-text`, `.mono-text`
- **Source**: Google Fonts import
- **Fallback**: Radio Grotesque, Helvetica Neue, Arial, sans-serif

## Implementation Examples

### Navigation Elements
```tsx
// Use Inter for all navigation
<a className="nav-text-medium uppercase tracking-wide">BROWSE</a>
<button className="nav-text text-xs">export</button>
```

### Headlines
```tsx
// Use Inter for main headlines
<h1 className="heading-xl">PLAZA</h1>
<h2 className="heading-lg">Welcome</h2>
```

### Technical Data
```tsx
// Use Inter for technical elements
<span className="mono-text text-xs">HUE: 180°</span>
<div className="mono-text text-sm">LOADING...</div>
```

## Font Loading Strategy

1. **Inter**: Google Fonts with Radio Grotesque fallback
2. **Unified System**: Single font family for consistency
3. **Optimized Weights**: 300-900 range for all use cases

## Accessibility Notes

- All fonts maintain proper contrast ratios
- Fallback fonts ensure readability if custom fonts fail
- Font sizes use `clamp()` for responsive scaling
- Letter spacing optimized for each font's character
