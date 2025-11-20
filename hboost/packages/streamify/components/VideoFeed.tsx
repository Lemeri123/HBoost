'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoPlayer from './VideoPlayer';
import BoostModal from './BoostModal';
import Header from './Header';

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    followers: number;
  };
  title: string;
  likes: number;
  comments: number;
  shares: number;
  donations: number;
}

interface VideoFeedProps {
  videos: Video[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [boostModalState, setBoostModalState] = useState<{ isOpen: boolean; video: Video | null }>({ isOpen: false, video: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Mark user interaction when scrolling
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
      
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const newIndex = Math.round(scrollTop / containerHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        setCurrentVideoIndex(newIndex);
      }
    };

    // Also track any user interaction (click, touch, etc.) on the page
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [currentVideoIndex, videos.length, hasUserInteracted]);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <>
      <Header />
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide pt-16"
        style={{ scrollBehavior: 'smooth' }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="h-screen w-full snap-start snap-always relative bg-[#0f0f0f] flex items-center justify-center pt-16"
          >
            <main className="flex items-center justify-center w-full max-w-[580px] h-[calc(100vh-4rem)] min-h-[600px] px-2 sm:px-4 relative">
              {/* Video Container */}
              <div className="w-full h-full min-w-0 relative flex-shrink-0 flex items-center justify-center md:justify-start">
                <div className="w-full h-full max-w-[450px] relative md:mr-[3px]">
                  <VideoPlayer
                    video={video}
                    isActive={index === currentVideoIndex}
                    hasUserInteracted={hasUserInteracted}
                  />
                
                  {/* Video Overlay - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end gap-2 sm:gap-4 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4 text-white z-20 pb-12 md:pb-4">
                    <div className="flex-1 min-w-0 pr-16 sm:pr-20 md:pr-0">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Link 
                        href={`/profile/${video.creator.username.toLowerCase()}`} 
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer relative z-30"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent video click when clicking creator link
                          e.preventDefault(); // Prevent default link behavior
                          router.push(`/profile/${video.creator.username.toLowerCase()}`);
                        }}
                      >
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cover bg-center bg-no-repeat flex-shrink-0" style={{ backgroundImage: `url(${video.creator.avatar})` }}></div>
                        <p className="font-semibold text-sm sm:text-base">@{video.creator.username}</p>
                      </Link>
                      {/* Follow Button - Next to creator name */}
                      <button className="h-7 sm:h-8 px-3 sm:px-4 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
                        Follow
                      </button>
                      {/* Boost Button - Next to Follow button, inside video container (Desktop only) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoostModalState({ isOpen: true, video });
                        }}
                        className="hidden md:flex h-7 sm:h-8 px-3 sm:px-4 rounded-full bg-[#2ba640] text-white text-xs sm:text-sm font-bold hover:bg-[#2ba640]/90 transition-all shadow-lg shadow-[#2ba640]/50 hover:shadow-[#2ba640]/70 flex-shrink-0 items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">attach_money</span>
                        <span>Boost</span>
                      </button>
                    </div>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm line-clamp-2">{video.title}</p>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile: Inside Video, Desktop: Outside */}
                  {/* Mobile: Action buttons inside video */}
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-4 md:hidden flex flex-col items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0 z-30">
                  {/* Like Button */}
                  <button className="flex flex-col items-center gap-0.5">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-base sm:text-lg text-white">favorite</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-white">{formatCount(video.likes)}</span>
                  </button>

                  {/* Comment Button */}
                  <button className="flex flex-col items-center gap-0.5">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-base sm:text-lg text-white">comment</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-white">{formatCount(video.comments)}</span>
                  </button>

                  {/* Share Button */}
                  <button className="flex flex-col items-center gap-0.5">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-base sm:text-lg text-white">share</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-white">{formatCount(video.shares)}</span>
                  </button>

                  {/* More Options Button */}
                  <button className="flex flex-col items-center gap-0.5">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-base sm:text-lg text-white">more_horiz</span>
                    </div>
                  </button>

                  {/* Boost Button - Mobile: At bottom of action buttons column */}
                  <button
                    onClick={() => setBoostModalState({ isOpen: true, video })}
                    className="flex flex-col items-center gap-0.5 relative group"
                  >
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#2ba640] flex items-center justify-center hover:bg-[#2ba640]/90 transition-all shadow-lg shadow-[#2ba640]/50 hover:shadow-[#2ba640]/70 hover:scale-110 relative overflow-hidden">
                      <span className="material-symbols-outlined text-base sm:text-lg text-white relative z-10">attach_money</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#2ba640]">Boost</span>
                  </button>
                  </div>
                </div>
              </div>

              {/* Desktop: Action buttons outside video, positioned at bottom, reversed order */}
              <div className="hidden md:flex absolute left-[470px] bottom-8 flex-col items-center justify-end gap-5 flex-shrink-0 z-30">
                  {/* Like Button - Top */}
                  <button className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-2xl text-white">favorite</span>
                    </div>
                    <span className="text-xs font-medium text-white">{formatCount(video.likes)}</span>
                  </button>

                  {/* Comment Button */}
                  <button className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-2xl text-white">comment</span>
                    </div>
                    <span className="text-xs font-medium text-white">{formatCount(video.comments)}</span>
                  </button>

                  {/* Share Button */}
                  <button className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-2xl text-white">share</span>
                    </div>
                    <span className="text-xs font-medium text-white">{formatCount(video.shares)}</span>
                  </button>

                  {/* More Options Button */}
                  <button className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-[#222222] flex items-center justify-center hover:bg-[#333333] transition-colors">
                      <span className="material-symbols-outlined text-2xl text-white">more_horiz</span>
                    </div>
                  </button>
                </div>
            </main>
          </div>
        ))}
      </div>

      {/* Boost Modal for Mobile */}
      {boostModalState.video && (
        <BoostModal
          isOpen={boostModalState.isOpen}
          onClose={() => setBoostModalState({ isOpen: false, video: null })}
          creator={boostModalState.video.creator}
          onBoost={(amount, paymentData) => {
            console.log(`Donated $${amount} to ${boostModalState.video?.creator.username}`);
            setBoostModalState({ isOpen: false, video: null });
          }}
        />
      )}
    </>
  );
}
