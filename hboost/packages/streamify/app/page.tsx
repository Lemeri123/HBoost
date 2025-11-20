import VideoFeed from '@/components/VideoFeed';

// Professional demo videos - compelling content that motivates creator support
// These videos showcase serious, high-quality content worthy of creator boosts
const mockVideos = [
  {
    id: '1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
    creator: {
      id: 'creator1',
      username: 'TwiineDeEnock',
      avatar: 'https://i.pravatar.cc/150?img=1',
      followers: 125000,
    },
    title: 'Mastering the Future: How I Built a $1M Tech Startup in 90 Days | Full Journey Breakdown',
    likes: 1200000,
    comments: 4500,
    shares: 23000,
    donations: 1250,
  },
  {
    id: '2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://i.ytimg.com/vi/_d6fuiJeXIo/maxresdefault.jpg',
    creator: {
      id: 'creator2',
      username: 'creativemind',
      avatar: 'https://i.pravatar.cc/150?img=12',
      followers: 89000,
    },
    title: 'Creating Award-Winning Digital Art: The Complete Process from Concept to Final Masterpiece',
    likes: 32000,
    comments: 890,
    shares: 450,
    donations: 890,
  },
  {
    id: '3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://i.ytimg.com/vi/4zH5iWG4Ilc/maxresdefault.jpg',
    creator: {
      id: 'creator3',
      username: 'artlover',
      avatar: 'https://i.pravatar.cc/150?img=33',
      followers: 250000,
    },
    title: 'Revolutionary Art Technique That Changed Everything: Step-by-Step Tutorial for Professional Artists',
    likes: 78000,
    comments: 2100,
    shares: 1200,
    donations: 3200,
  },
  {
    id: '4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://i.ytimg.com/vi/x-T9Ys3-scg/maxresdefault.jpg',
    creator: {
      id: 'creator4',
      username: 'dancepro',
      avatar: 'https://i.pravatar.cc/150?img=45',
      followers: 450000,
    },
    title: 'Choreography Breakdown: How I Created a Viral Dance That Got 50M Views | Behind the Scenes',
    likes: 125000,
    comments: 3500,
    shares: 2100,
    donations: 5800,
  },
  {
    id: '5',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://i.ytimg.com/vi/3x1a5fT_6yI/maxresdefault.jpg',
    creator: {
      id: 'creator5',
      username: 'foodie',
      avatar: 'https://i.pravatar.cc/150?img=51',
      followers: 320000,
    },
    title: 'Michelin-Star Chef Secrets: The Ultimate Gourmet Recipe That Takes Your Cooking to the Next Level',
    likes: 95000,
    comments: 2800,
    shares: 1500,
    donations: 4100,
  },
  {
    id: '6',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://i.ytimg.com/vi/4zH5iWG4Ilc/maxresdefault.jpg',
    creator: {
      id: 'creator6',
      username: 'adventure',
      avatar: 'https://i.pravatar.cc/150?img=68',
      followers: 180000,
    },
    title: 'Conquering Mount Everest: My Complete Journey - Training, Challenges, and Lessons Learned',
    likes: 67000,
    comments: 1900,
    shares: 1100,
    donations: 2400,
  },
  {
    id: '7',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://i.ytimg.com/vi/x-T9Ys3-scg/maxresdefault.jpg',
    creator: {
      id: 'creator7',
      username: 'naturelover',
      avatar: 'https://i.pravatar.cc/150?img=47',
      followers: 290000,
    },
    title: 'Wildlife Conservation Success Story: How We Saved 10,000 Endangered Species | Impact Report',
    likes: 89000,
    comments: 2400,
    shares: 1300,
    donations: 3600,
  },
  {
    id: '8',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://i.ytimg.com/vi/5Peo-ivmupE/maxresdefault.jpg',
    creator: {
      id: 'creator8',
      username: 'education',
      avatar: 'https://i.pravatar.cc/150?img=15',
      followers: 520000,
    },
    title: 'How I Taught 1 Million Students to Code: The Complete Learning System That Actually Works',
    likes: 850000,
    comments: 8900,
    shares: 5600,
    donations: 12400,
  },
];

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <VideoFeed videos={mockVideos} />
      </main>
  );
}
