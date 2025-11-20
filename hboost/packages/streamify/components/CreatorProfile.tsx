'use client';

interface Creator {
  id: string;
  username: string;
  avatar: string;
  followers: number;
}

interface CreatorProfileProps {
  creator: Creator;
}

export default function CreatorProfile({ creator }: CreatorProfileProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-black p-0.5">
            <img
              src={creator.avatar}
              alt={creator.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      <button className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold hover:bg-white/30 transition-all">
        Follow
      </button>
    </div>
  );
}

