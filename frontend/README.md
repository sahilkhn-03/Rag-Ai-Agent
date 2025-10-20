# 🚀 RAG AI Agent - Modern React Landing Page

A premium, modern landing page built with **React**, **Tailwind CSS**, and **Framer Motion** for the RAG-based AI Teaching Assistant system.

## ✨ Features Implemented

### 🎨 **Design & UX Improvements**

1. **Modern Gradient Theme**
   - Professional purple-to-pink gradient color scheme
   - Mesh gradient backgrounds with animated effects
   - Glassmorphism effects with backdrop blur

2. **Smooth Animations**
   - Fade-in animations for sections
   - Slide-up animations for cards
   - Floating tech cards with continuous animation
   - Scroll-based reveal animations using Framer Motion

3. **Responsive Design**
   - Fully mobile-responsive (mobile, tablet, desktop)
   - Mobile-friendly navigation with hamburger menu
   - Adaptive grid layouts
   - Touch-friendly buttons and interactions

4. **Enhanced Typography**
   - **Font Pairing**: 
     - Display font: **Space Grotesk** (headings)
     - Body font: **Inter** (content)
   - Optimized font weights and sizes
   - Better readability with proper spacing

5. **Improved Buttons**
   - Gradient backgrounds with hover effects
   - Shadow effects that intensify on hover
   - Scale animations on click
   - Loading states for AI interactions

6. **Hover Effects**
   - Tech cards scale and lift on hover
   - Feature cards with gradient overlays
   - Button scale and glow effects
   - Smooth transitions (300ms)

### 🧩 **Sections**

1. **Navbar**
   - Fixed position with blur effect on scroll
   - Smooth scroll navigation
   - Active section highlighting
   - Mobile responsive menu
   - Branding: "RAG AI Agent" 🤖

2. **Hero Section**
   - Compelling headline with gradient text
   - Animated floating tech cards (HTML5, CSS3, JavaScript, React)
   - Two CTA buttons with distinct styles
   - Stats showcase (100+ Videos, AI Powered, 24/7)
   - Scroll indicator

3. **About Section**
   - 4 feature cards with icons
   - Hover effects with gradient overlays
   - Technology badges (Whisper AI, all-MiniLM-L6-v2, Llama 3.1)
   - Stagger animations

4. **Features (How It Works)**
   - 4-step RAG process visualization
   - Numbered badges with rotating animation
   - Connecting arrows between steps
   - Technology labels for each step

5. **AI Assistant**
   - Fully functional chat interface
   - Real-time messaging with bot
   - Loading states with animated dots
   - Example questions as clickable buttons
   - Status indicator (Ready/Thinking/Error)
   - 3 info cards explaining benefits
   - Auto-scroll to latest message

6. **Contact**
   - "Ready to Start Learning" CTA
   - Single button removed ("Enroll Now" removed as requested)
   - Stats grid (AI Powered, Response Time, Accuracy, Available)

7. **Footer**
   - Brand identity with logo
   - Quick navigation links
   - Technology list
   - Social media placeholders
   - Copyright notice

## 🛠️ Tech Stack

- **React 18.3** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set
- **Google Fonts** - Inter + Space Grotesk

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend API running at `http://localhost:5000`
- For embeddings the project uses `all-MiniLM-L6-v2` by default

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The app runs on `http://localhost:3000` by default.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── Hero.jsx           # Hero section
│   │   ├── About.jsx          # About course
│   │   ├── Features.jsx       # How it works
│   │   ├── AIAssistant.jsx    # Chat interface
│   │   ├── Contact.jsx        # CTA section
│   │   └── Footer.jsx         # Footer
│   ├── App.jsx                # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## 🎨 Design System

### Colors

- **Primary**: Purple shades (`#8b5cf6`, `#7c3aed`, etc.)
- **Accent**: Pink/Magenta (`#d946ef`, `#c026d3`, etc.)
- **Background**: Dark slate (`#0f172a`, `#1e293b`)
- **Text**: Light slate (`#f1f5f9`, `#cbd5e1`)

### Animations

- **Float**: 3s ease-in-out infinite (tech cards)
- **Slide-up**: 0.5s ease-out (section reveals)
- **Fade-in**: 0.5s ease-out (elements)
- **Gradient**: 8s linear infinite (backgrounds)

### Spacing

- Sections: `py-24` (96px top/bottom)
- Container: `max-w-7xl` (1280px)
- Gaps: `gap-6` or `gap-8` for grids

## 🔌 API Integration

The AI Assistant connects to the Flask backend:

**Endpoint**: `POST http://localhost:5000/ask`

**Request**:
```json
{
  "question": "How do websites work?"
}
```

**Response**:
```json
{
  "response": "AI generated answer...",
  "question": "...",
  "sources": [...]
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ✅ Changes Made (Per Requirements)

✅ Smooth scroll and animations (fade-in, slide-up)  
✅ Responsive layout for mobile and tablet  
✅ Modern gradients and better spacing  
✅ Hover effects on buttons and cards  
✅ Better typography (Inter + Space Grotesk)  
✅ Attractive button colors with gradients  
✅ Clean React + Tailwind CSS code  
✅ Removed "Enroll Now" button  
✅ Changed branding to "RAG AI Agent"  

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- The app uses Framer Motion's `useInView` hook for scroll-based animations
- All animations respect user's motion preferences
- Custom scrollbar styling for webkit browsers
- Smooth scroll behavior enabled globally

---

**Built with ❤️ using React + Tailwind CSS + Framer Motion**
