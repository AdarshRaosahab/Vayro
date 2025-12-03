# Branding & UI System

## Design Tokens
VAYRO uses a CSS variable-based token system defined in `styles/tokens.css`.

### Colors
- **Navy**: Primary brand color. Used for headings, primary buttons, and navigation.
- **Gold**: Accent color. Used for primary actions, focus rings, and premium highlights.
- **Ivory**: Background color. Provides a warm, premium paper-like feel.
- **Slate**: Neutral text and borders.

### Typography
- **Headings**: `Playfair Display` (Serif). Premium, editorial feel.
- **Body**: `Inter` (Sans-serif). Clean, legible, modern.

### Spacing
Based on an 8pt grid.
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

## Components

### Buttons
- **Primary**: Navy background, white text. Main actions.
- **Gold**: Gold background, white text. Premium/Upgrade actions.
- **Ghost**: Transparent background, slate text. Secondary actions.

### Cards
- White background, subtle shadow, rounded corners.
- Use `Card` component for consistency.

### Modals
- Use `Modal` component.
- Includes backdrop blur, fade-in animation, and accessibility features (focus trap).

## Accessibility
- Focus rings are customized to match the Gold accent.
- "Skip to content" link is available for keyboard users.
- Semantic HTML is used throughout.
