# Impact App - Design System Documentation

## Phase 1: Design & Conceptualization

### Visual Identity & Mood Board

**Core Aesthetic:** Modern Glassmorphism with Clean Minimalism
- **Primary Inspiration:** iOS design language meets modern web aesthetics
- **Key Elements:** Frosted glass effects, subtle gradients, clean typography, purposeful spacing
- **Mood:** Professional yet approachable, trustworthy, modern, accessible

### Color Palette

#### Primary Colors
- **Primary Blue:** `#4F46E5` (Indigo-600) - Trust, reliability, action
- **Primary Green:** `#10B981` (Emerald-500) - Success, growth, positive impact
- **Primary Purple:** `#8B5CF6` (Violet-500) - Innovation, community

#### Semantic Colors
- **Success:** `#10B981` (Emerald-500)
- **Warning:** `#F59E0B` (Amber-500)
- **Error:** `#EF4444` (Red-500)
- **Info:** `#3B82F6` (Blue-500)

#### Neutral Palette
- **Gray-50:** `#F8FAFC` - Background light
- **Gray-100:** `#F1F5F9` - Surface light
- **Gray-200:** `#E2E8F0` - Border light
- **Gray-300:** `#CBD5E1` - Border medium
- **Gray-400:** `#94A3B8` - Text disabled
- **Gray-500:** `#64748B` - Text secondary
- **Gray-600:** `#475569` - Text primary light
- **Gray-700:** `#334155` - Text primary
- **Gray-800:** `#1E293B` - Text primary dark
- **Gray-900:** `#0F172A` - Text primary darkest

#### Glassmorphism Specific
- **Glass Background Light:** `rgba(255, 255, 255, 0.15)`
- **Glass Background Dark:** `rgba(0, 0, 0, 0.15)`
- **Glass Border:** `rgba(255, 255, 255, 0.2)`
- **Glass Shadow:** `rgba(0, 0, 0, 0.1)`

### Typography

#### Font Families
- **Primary:** Inter (Headings, UI Elements)
- **Secondary:** Inter (Body text, descriptions)

#### Font Weights
- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **SemiBold:** 600
- **Bold:** 700
- **ExtraBold:** 800

#### Type Scale
- **Display Large:** 48px / 52px (3rem / 3.25rem)
- **Display Medium:** 40px / 44px (2.5rem / 2.75rem)
- **Display Small:** 32px / 36px (2rem / 2.25rem)
- **Headline Large:** 28px / 32px (1.75rem / 2rem)
- **Headline Medium:** 24px / 28px (1.5rem / 1.75rem)
- **Headline Small:** 20px / 24px (1.25rem / 1.5rem)
- **Title Large:** 18px / 24px (1.125rem / 1.5rem)
- **Title Medium:** 16px / 22px (1rem / 1.375rem)
- **Title Small:** 14px / 20px (0.875rem / 1.25rem)
- **Body Large:** 16px / 24px (1rem / 1.5rem)
- **Body Medium:** 14px / 20px (0.875rem / 1.25rem)
- **Body Small:** 12px / 16px (0.75rem / 1rem)
- **Label Large:** 14px / 20px (0.875rem / 1.25rem)
- **Label Medium:** 12px / 16px (0.75rem / 1rem)
- **Label Small:** 10px / 14px (0.625rem / 0.875rem)

### Spacing System

#### Base Unit: 4px

- **xs:** 4px (0.25rem)
- **sm:** 8px (0.5rem)
- **md:** 12px (0.75rem)
- **lg:** 16px (1rem)
- **xl:** 20px (1.25rem)
- **2xl:** 24px (1.5rem)
- **3xl:** 32px (2rem)
- **4xl:** 40px (2.5rem)
- **5xl:** 48px (3rem)
- **6xl:** 64px (4rem)
- **7xl:** 80px (5rem)
- **8xl:** 96px (6rem)

### Border Radius

- **xs:** 4px
- **sm:** 6px
- **md:** 8px
- **lg:** 12px
- **xl:** 16px
- **2xl:** 20px
- **3xl:** 24px
- **full:** 9999px

### Shadows & Elevation

#### Standard Shadows
- **xs:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **sm:** `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **md:** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg:** `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl:** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **2xl:** `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

#### Glassmorphism Shadows
- **glass-light:** `0 8px 32px 0 rgba(31, 38, 135, 0.37)`
- **glass-medium:** `0 8px 32px 0 rgba(31, 38, 135, 0.5)`
- **glass-strong:** `0 8px 32px 0 rgba(31, 38, 135, 0.7)`

### Glassmorphism Guidelines

#### Standard Glass Card
- **Background:** `rgba(255, 255, 255, 0.15)`
- **Border:** `1px solid rgba(255, 255, 255, 0.2)`
- **Backdrop Filter:** `blur(10px)`
- **Border Radius:** `16px`
- **Shadow:** `glass-light`

#### Elevated Glass Card
- **Background:** `rgba(255, 255, 255, 0.25)`
- **Border:** `1px solid rgba(255, 255, 255, 0.3)`
- **Backdrop Filter:** `blur(15px)`
- **Border Radius:** `20px`
- **Shadow:** `glass-medium`

#### Modal Glass Overlay
- **Background:** `rgba(0, 0, 0, 0.4)`
- **Backdrop Filter:** `blur(8px)`

### Component Specifications

#### Buttons
- **Primary:** Solid background with primary color, white text
- **Secondary:** Glass background with primary border, primary text
- **Ghost:** Transparent background, primary text
- **Danger:** Solid background with error color, white text

#### Input Fields
- **Default:** Glass background, subtle border, focused state with primary border
- **Error:** Glass background, error border, error text
- **Disabled:** Reduced opacity, no interaction

#### Cards
- **Standard:** Glass background, subtle shadow, rounded corners
- **Elevated:** Enhanced glass effect, stronger shadow
- **Interactive:** Hover/press states with subtle scale transform

#### Navigation
- **Tab Bar:** Glass background, blur effect, floating appearance
- **App Bar:** Glass background, subtle shadow, backdrop blur

### Animation Guidelines

#### Timing Functions
- **Ease Out:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Ease In Out:** `cubic-bezier(0.645, 0.045, 0.355, 1)`
- **Spring:** `cubic-bezier(0.175, 0.885, 0.32, 1.275)`

#### Duration
- **Fast:** 150ms
- **Medium:** 250ms
- **Slow:** 350ms
- **Extra Slow:** 500ms

#### Transforms
- **Scale Hover:** `scale(1.02)`
- **Scale Press:** `scale(0.98)`
- **Translate Y:** `translateY(-2px)` for hover elevation

### Accessibility

#### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have sufficient contrast in all states

#### Touch Targets
- Minimum 44px x 44px for all interactive elements
- Adequate spacing between touch targets

#### Focus States
- Clear focus indicators for keyboard navigation
- Focus rings with primary color and sufficient contrast