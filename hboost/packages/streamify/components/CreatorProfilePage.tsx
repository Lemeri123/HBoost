'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './Header';
import BoostModal from './BoostModal';

interface CreatorProfilePageProps {
  username: string;
}

// Mock creator database - in production, this would come from an API
const creatorsDatabase: Record<string, {
  name: string;
  username: string;
  subscribers: number;
  videoCount: number;
  avatar: string;
  description: string;
  videos: Array<{
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    timeAgo: string;
  }>;
}> = {
  'twiinedeenock': {
    name: 'TwiineDeEnock',
    username: 'twiinedeenock',
    subscribers: 1200000,
    videoCount: 437,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMy_61nNkkvciT6OKGGqxPvDLny7vTYL8H6hWAwFwxpYweDcDEGqlJx5bbmJQJmv_ju4D_7TGi9f3UW_igXsTKaDZCSddp0A_wHJmlDX3iIS-AwVu-nzupu8d8KxPdGwSkWHWMEX8pmuADNhP3Jp5kl_sPax5rVA5o4lEe_zZsctnQp5_oEkerqN2MANMRFyz86PCTzc1UGEcBZYhkCmYdoLESY0UWvAtJuYCbLrGf_nv6329_AwjLw2RqJTIfGrRAwsGCFIilG8',
    description: 'Exploring the digital frontier. Welcome to my stream. >',
    videos: [
      {
        id: '1',
        title: 'Cybernetic Dreams',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC47cDGbnjJSKmChLwYbb_Ayth2kJOWz5DrG9-HcaLmz54e-6ayPbNRuywazw9Z9FJ6New2U2aouFbfPXjCX4rojWmztHz2Ikd0CDJktNgeKlnaKvWA9I5vxDCkLiRN8C3TZBuaO7Uvpbw5YRIoLP-NixcwY9D078QKhppeWF26noQixF1AI6-v3wZE2CtYjqUzNBj5n2f5wdbWatpgHGcGj1ZRHvboV5E20VGSMiSF3v0UH36zUZyrF_a17u83m_sJ2bxNQOW1rRU',
        views: 1500000,
        timeAgo: '2 days ago',
      },
      {
        id: '2',
        title: 'Neon Alleyways',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj84ZjjgFDmZE9_THh7cbDyxN-A5vjaNqLFoF84ShJm8URDsor3Ex8QyHGiZYcw0W4FuJPflG7Dx1YAeUMOKsrl33SP8rsHDMhZ3KWnF2jWncOY9iH_NJtzKXKOmSMMyYZVJvG9lXMQuNRdsdApO2VBCJBnzhMoGqBHQz1mRyEpP3pefuv-PqZWbkS3951HSZX5I333vMPtjbtzVDQEsTc1aUVWXSpWBkTCkWXwjXNaZN6PzdVlXf0I-SinSBqTS91dAAnJaUmImc',
        views: 890000,
        timeAgo: '1 week ago',
      },
      {
        id: '3',
        title: 'Data Stream Glitch',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDofeChDKbGiIMl9mGqY_sY9pp-jX5OidwfQYmBy8Ee67ZfigvZVObFePUsOJbtdUnKowbXUbe_XzJLcRvxRaW1wfatuZwJ-pST_Yr92bc8S2bHF9TdWDrsxr99fHomYhkcg-EcNgKChU4MmYWxocNejUeHD7LZcbBQIo7XBTVzgTWtR5gTmtKv6aADwFXxknsZ51Bjjdjrz-YPdSk70n7Hzg8Q4V_1EOtLAn96YBp1tHomYLFjpH4We1WPYuDuR5wJsnDMdX3nACc',
        views: 2100000,
        timeAgo: '2 weeks ago',
      },
      {
        id: '4',
        title: 'Future Funk Groove',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY8nOx6kxtkvUYUyxOINgCzjm5cTnQBVpFlCsYEdRV99LwRchQ8oy-T4TvYbOBYnBEA1wk7Hj-hZ_GS4Hqt5qQivCImpIM6GM7E6BIqUtn4p2wlN0XBztObWLfzfmCH2aQWgBGzCJJ955qbHDetStf-im4RwC0vZgmNWV1J1gvkBXFmx9vmoaOMIRz19Vw4RNOqqAwDZmXY_muaU324Dr6XyfVCYv52x9X5_AAToLdwEG5OFNRiAgq902ZiyUh1RN8UxHdDzUf9jo',
        views: 750000,
        timeAgo: '3 weeks ago',
      },
      {
        id: '5',
        title: 'Holographic Echoes',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI1RODUU5qR5FJuAUXmOjZhm7ZlJLNJFSNoVh-sNxwQwqy0vEqkU0ASpDkuZw0q4exNY4WNLYkAi0Ztu41rZO7EpuSx_I8McrkW2jV-ZJB0AWbx7sUdK10cvbTxzTtoSt8ViJrpaGBRTkBcEqC7ollKkTCVaEZwc0zAKZCs0ST9ERSbu8sGmBsoT8YL1Mnocyq3JggA7MpvEHEndjNw4fUoE9lKmbZrCXhqk4Bt-bX8vteM13UagFzOMFoZpZekWGtBEIB-7GUMF4',
        views: 3200000,
        timeAgo: '1 month ago',
      },
      {
        id: '6',
        title: 'Synthwave Sunset',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVODx7NHTDishFzZi-H0hq3Y7RERd1pbs5kvhNzur5GMDN7FjImWP59aa2MsPyJykkPD2h3pf4jfaFj3tV03Gr4K086MKxkrweZsyeyJ6Y447Sox4yjISoMjOGWHAMn3JCk6EIUfGsjgzbune6yckfqVuKkQ_d9EzRQXZUw5vKgXMO6xIwwH_EW7ZHBHNz6M65qPW7LKTrnkvZQfYsrUk52pxjc2zvG0mAT-IrMlpokKEzxNFS3tFn1LsTNJHVeGXb5k28N4XN9Is',
        views: 980000,
        timeAgo: '1 month ago',
      },
      {
        id: '7',
        title: 'Virtual Reality Dive',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPVS9e0TALVmmeerqN6C3ruuzUHwrkSHd5neZWkY4lTPadwC08-Ooul_xmThVYa0yYXVZdSDff8xijcbjqRJdvMSUR3vsDgmH69CnHPTPTvYtEP6PpdUIz1JxZRevnNjNzxCQb5kemeHCoCflJtDyH9jMyql-kUVwO2WTXoiv8YTUA1KIytIkM3G50qtshabrAOgi8Jqc45arLxGZv8ZWsbaO-vaRJRmjAuLARWq-uRSIIGuqIkTWMeoEHPc2d1B3FIqNASWFC4x0',
        views: 1100000,
        timeAgo: '2 months ago',
      },
      {
        id: '8',
        title: 'Quantum Leap',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFskcnGgA7uozeDB8vH2TIm5yk_3GnQ5iMVXzgJUNrthC1WFhcZbjPt-5wWdLFxuU5V666O3LjFjZD8mHEFPH7uhivd79cdAanTUqJzx9DLulN53DFsLCG5Q2T_dWvDQcgqc0zgJg9SGcuhxbnyOO5Ki7vRTNBYol7TatoUj8_0nMsbtzEuwGHrKndB-Q5sXzn5530CxGEqffPvAXJys4QWlKfwj1TXDtnCCMwXCDDuUUgspowCsIbAKxo92cqR0B1PWv3rSRn7fs',
        views: 4500000,
        timeAgo: '2 months ago',
      },
    ],
  },
  // Add more creators here as needed
};

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K views`;
  }
  return `${views} views`;
};

export default function CreatorProfilePage({ username }: CreatorProfilePageProps) {
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  
  // Normalize username (lowercase) for lookup
  const normalizedUsername = username.toLowerCase();
  
  // Get creator data from database, or use default if not found
  const creatorData = creatorsDatabase[normalizedUsername] || creatorsDatabase['twiinedeenock'];
  const videos = creatorData.videos;

  const formatSubscribers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K subscribers`;
    }
    return `${count} subscribers`;
  };

  const handleBoost = (amount: number, paymentData: any) => {
    // Here you would integrate with Hedera backend
    console.log('Boost initiated from profile:', {
      amount,
      creator: creatorData.username,
      paymentData: {
        email: paymentData.email,
        // Don't log sensitive card data
      },
    });
    
    // Close modal after boost
    setIsBoostModalOpen(false);
  };

  // Create creator object for BoostModal
  const creator = {
    id: 'creator',
    username: creatorData.username,
    avatar: creatorData.avatar,
    followers: creatorData.subscribers,
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        
        <main className="flex flex-1 justify-center pt-24 pb-10">
          <div className="layout-content-container flex flex-col w-full max-w-6xl px-4 sm:px-6">
            {/* Profile Section */}
            <div className="flex p-4 @container pb-8 mb-4">
              <div className="flex w-full flex-col gap-6 @[640px]:flex-row @[640px]:items-center">
                <div className="flex items-center gap-6 flex-1">
                  <div className="relative flex-shrink-0">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 sm:h-40 sm:w-40"
                      style={{ backgroundImage: `url(${creatorData.avatar})` }}
                    ></div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <h1 className="text-white text-3xl sm:text-4xl font-bold">{creatorData.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#aaaaaa] text-sm">
                      <span>@{creatorData.username}</span>
                      <span>{formatSubscribers(creatorData.subscribers)}</span>
                      <span>{creatorData.videoCount} videos</span>
                    </div>
                    <p className="text-[#aaaaaa] text-sm mt-2 hidden @[400px]:block">{creatorData.description}</p>
                  </div>
                </div>
                <div className="flex w-full gap-3 @[640px]:w-auto @[640px]:justify-end">
                  <button 
                    onClick={() => setIsBoostModalOpen(true)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#2ba640] text-white text-sm font-bold leading-normal flex-1 @[640px]:flex-none hover:bg-[#2ba640]/90 transition-all shadow-lg shadow-[#2ba640]/50 hover:shadow-[#2ba640]/70"
                  >
                    <span className="truncate font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">attach_money</span>
                      <span>Boost</span>
                    </span>
                  </button>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-white text-black text-sm font-medium leading-normal flex-1 @[640px]:flex-none hover:bg-gray-200 transition-colors">
                    <span className="truncate">Subscribe</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/20">
              <div className="flex px-4 gap-8">
                <button className="flex flex-col items-center justify-center border-b-2 border-b-white text-white py-3">
                  <p className="text-sm font-medium uppercase tracking-wide">Videos</p>
                </button>
                <button className="flex flex-col items-center justify-center border-b-2 border-b-transparent text-[#aaaaaa] py-3 hover:text-white transition-colors">
                  <p className="text-sm font-medium uppercase tracking-wide">Playlists</p>
                </button>
                <button className="flex flex-col items-center justify-center border-b-2 border-b-transparent text-[#aaaaaa] py-3 hover:text-white transition-colors">
                  <p className="text-sm font-medium uppercase tracking-wide">About</p>
                </button>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-8 p-4 mt-6">
              {videos.map((video) => (
                <Link key={video.id} href="/" className="group relative flex flex-col gap-2 cursor-pointer">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <div
                      className="bg-cover bg-center w-full h-full transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                    ></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9"
                        style={{ backgroundImage: `url(${creatorData.avatar})` }}
                      ></div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white text-base font-medium leading-snug overflow-hidden text-ellipsis line-clamp-2">{video.title}</p>
                      <p className="text-[#aaaaaa] text-sm">{creatorData.name}</p>
                      <p className="text-[#aaaaaa] text-sm">{formatViews(video.views)} · {video.timeAgo}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Boost Modal */}
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        creator={creator}
        onBoost={handleBoost}
      />
    </div>
  );
}
