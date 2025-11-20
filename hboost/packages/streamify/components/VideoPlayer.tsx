'use client';

import { useRef, useEffect, useState } from 'react';

interface Creator {
  id: string;
  username: string;
  avatar: string;
  followers: number;
}

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  creator: Creator;
  title: string;
  likes: number;
  comments: number;
  shares: number;
  donations: number;
}

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
  hasUserInteracted?: boolean;
}

export default function VideoPlayer({ video, isActive, hasUserInteracted: globalHasUserInteracted = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted if possible
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Update local interaction state when global state changes
  useEffect(() => {
    if (globalHasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [globalHasUserInteracted]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || videoError) return;

    if (isActive) {
      // Try to play with sound if user has interacted, otherwise start muted
      videoElement.volume = 1.0;
      
      // Use global user interaction status or local
      const userHasInteracted = hasUserInteracted || globalHasUserInteracted;
      
      // If user has interacted, try to unmute
      if (userHasInteracted) {
        videoElement.muted = isMuted;
      } else {
        // Start muted for autoplay policy compliance
        videoElement.muted = true;
      }
      
      // Only try to play if video has loaded
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // After successful play, try to unmute if user has interacted
            if (userHasInteracted && !isMuted) {
              videoElement.muted = false;
            }
          })
          .catch((error) => {
            // Auto-play might be blocked by browser
            console.log('Auto-play blocked:', error);
            setIsPlaying(false);
          });
      }
    } else {
      // Mute and pause when video is not active
      videoElement.muted = true;
      videoElement.pause();
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isMuted, hasUserInteracted, globalHasUserInteracted]);
  
  // Separate effect to handle video error state changes
  useEffect(() => {
    if (videoError && isActive) {
      setIsPlaying(false);
    }
  }, [videoError, isActive]);

  const handleVideoClick = () => {
    const videoElement = videoRef.current;
    if (!videoElement || videoError) return;

    // Mark that user has interacted
    setHasUserInteracted(true);

    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      // Try to unmute on user interaction
      videoElement.muted = isMuted;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // After user interaction, we can unmute
            if (!isMuted) {
              videoElement.muted = false;
            }
          })
          .catch((error) => {
            console.log('Play failed:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent video pause/play
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Mark that user has interacted
    setHasUserInteracted(true);

    const newMutedState = !videoElement.muted;
    videoElement.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // Ensure volume is at max when unmuting
    if (!newMutedState) {
      videoElement.volume = 1.0;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#222222] rounded-xl overflow-hidden">
      <div
        className="relative w-full h-full cursor-pointer group"
        onClick={handleVideoClick}
      >
        {/* Fallback gradient background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
        
        {/* Video element */}
        {!videoError && (
          <video
            ref={videoRef}
            src={video.url}
            poster={video.thumbnail}
            loop
            playsInline
            preload={isActive ? 'auto' : 'none'}
            className="relative w-full h-full object-cover z-10"
            onError={(e) => {
              // Handle video load errors gracefully
              console.log('Video failed to load:', video.url);
              setVideoError(true);
            }}
            onLoadedData={() => {
              setVideoError(false);
            }}
          />
        )}
        
        {/* Show fallback when video fails to load */}
        {videoError && (
          <div className="relative w-full h-full z-10 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">Video unavailable</p>
              <p className="text-sm text-white/60">This video could not be loaded</p>
            </div>
          </div>
        )}
        
        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Mute/Unmute button */}
        {isPlaying && (
          <button
            onClick={handleMuteToggle}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-all"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

