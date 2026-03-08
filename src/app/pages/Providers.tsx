import { Link } from 'react-router';
import { Star, Shield, Heart, Search } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Providers() {
  const [searchQuery, setSearchQuery] = useState('');

  const companions = [
    {
      id: 1,
      name: 'Megan T.',
      title: 'Weekend Golf Companion',
      desc: 'Relaxed pace, loves morning tee times, and great conversation on the course.',
      img: 'https://images.unsplash.com/photo-1718965018802-897e94ce7f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwc21pbGUlMjBvdXRkb29yfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 94,
      rating: 4.9,
      reviews: 127,
      rebook: '94%',
      price: '$45',
      verified: true,
    },
    {
      id: 2,
      name: 'James R.',
      title: 'Coffee Walk Partner',
      desc: 'Easy-going listener, thoughtful, available weekday mornings.',
      img: 'https://images.unsplash.com/photo-1764816657425-b3c79b616d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsJTIwb3V0ZG9vciUyMHNtaWxlfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 91,
      rating: 5.0,
      reviews: 93,
      rebook: '97%',
      price: '$35',
      verified: true,
    },
    {
      id: 3,
      name: 'Lily C.',
      title: 'Kids Homework Mentor',
      desc: 'Patient, encouraging, specializes in math & reading for ages 8–14.',
      img: 'https://images.unsplash.com/photo-1673623703556-eafc6dd91c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwZnJpZW5kbHklMjBuYXR1cmFsfGVufDF8fHx8MTc3MjQzMjUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 89,
      rating: 4.8,
      reviews: 156,
      rebook: '91%',
      price: '$40',
      verified: true,
    },
    {
      id: 4,
      name: 'Robert K.',
      title: 'Dog Park Buddy',
      desc: 'Loves dogs of all sizes. Calm, friendly, enjoys morning walks.',
      img: 'https://images.unsplash.com/photo-1617746038583-9726a81f24b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMG1hbiUyMHBvcnRyYWl0JTIwa2luZCUyMGdlbnRsZSUyMHNtaWxlfGVufDF8fHx8MTc3MjQzMjUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 87,
      rating: 4.9,
      reviews: 84,
      rebook: '93%',
      price: '$30',
      verified: true,
    },
    {
      id: 5,
      name: 'Sofia M.',
      title: 'Travel Companion',
      desc: 'Adventurous spirit, great planner, experienced in weekend day trips.',
      img: 'https://images.unsplash.com/photo-1758467796950-1da4615c97b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBuYXR1cmFsJTIwbGlnaHQlMjBoYXBweXxlbnwxfHx8fDE3NzI0MzI1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 85,
      rating: 4.7,
      reviews: 68,
      rebook: '88%',
      price: '$50',
      verified: true,
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-[#F0EDE8]">
        <h1 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>Companions</h1>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: '13px' }}>Browse verified companions in your area</p>
      </header>

      <div className="p-4 md:p-8">
        {/* Search */}
        <div className="mb-5 md:mb-8 md:max-w-lg">
          <div className="relative">
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companions..."
              className="w-full bg-white border border-[#E8E4DF] rounded-xl md:rounded-2xl pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-300 transition-colors"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
          {companions.map((companion) => (
            <Link key={companion.id} to={`/app/providers/${companion.id}`} className="group">
              <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-3.5 md:p-6 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all text-center active:scale-[0.98]">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden mx-auto mb-3 md:mb-4 ring-2 md:ring-3 ring-rose-50">
                  <ImageWithFallback
                    src={companion.img}
                    alt={companion.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-center gap-1 mb-0.5 md:mb-1">
                  <h3 className="text-gray-900 truncate" style={{ fontSize: '14px', fontWeight: 600 }}>{companion.name}</h3>
                  {companion.verified && <Shield className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-rose-500 mb-1.5 md:mb-2 truncate" style={{ fontSize: '12px', fontWeight: 500 }}>{companion.title}</p>
                <p className="text-gray-500 mb-3 md:mb-4 line-clamp-2 hidden md:block" style={{ fontSize: '13px', lineHeight: 1.5 }}>{companion.desc}</p>

                {/* Match Score */}
                <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl md:rounded-2xl p-2 md:p-3 mb-3 md:mb-4 border border-rose-100/50">
                  <div className="flex items-center justify-center gap-1.5 md:gap-2">
                    <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400" />
                    <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" style={{ fontSize: '15px', fontWeight: 600 }}>
                      {companion.matchScore}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-3" style={{ fontSize: '12px' }}>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-gray-900" style={{ fontWeight: 500 }}>{companion.rating}</span>
                  </div>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{companion.rebook}</span>
                </div>

                <div className="pt-3 border-t border-[#F0EDE8] flex items-center justify-between">
                  <span className="text-gray-900" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {companion.price}<span className="text-gray-400" style={{ fontWeight: 400, fontSize: '11px' }}>/hr</span>
                  </span>
                  <span className="text-rose-500" style={{ fontSize: '12px', fontWeight: 500 }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
