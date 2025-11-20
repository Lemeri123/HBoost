# Streamify - Video Streaming Platform

A beautiful TikTok-like video streaming application built with Next.js, featuring a powerful donation/boost system for creators.

## Features

- **TikTok-like Vertical Video Feed**: Smooth scrolling vertical video feed with snap scrolling
- **Powerful Boost/Donation Button**: Extra powerful button with animations to support creators
- **Creator Profiles**: Beautiful creator profiles with follow functionality
- **Video Player**: Full-screen video player with play/pause controls
- **Interactive UI**: Like, comment, and share buttons
- **Modern Design**: Beautiful gradient backgrounds and smooth animations

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React 19

## Getting Started

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Components

- **VideoFeed**: Main feed component with vertical scrolling
- **VideoPlayer**: Video player with play/pause functionality
- **DonationButton**: Powerful boost button with donation amounts
- **CreatorProfile**: Creator profile display with follow button

## Boost/Donation Feature

The boost button features:
- Beautiful gradient animations
- Multiple preset donation amounts ($5, $10, $25, $50, $100, $500)
- Custom amount option
- Visual feedback with animations
- Success notifications

## Development

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Notes

- Currently uses mock video data (videos from Pexels)
- In production, replace with your own video URLs and API endpoints
- The donation functionality is currently logging to console - integrate with your payment system
