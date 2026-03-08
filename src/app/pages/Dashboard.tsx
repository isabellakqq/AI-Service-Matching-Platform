import { useState } from 'react';
import { Send, Heart, Star, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import InsightsPanel from '../components/InsightsPanel';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useIsMobile } from '../components/ui/use-mobile';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const isMobile = useIsMobile();

  const companions = [
    {
      id: 1,
      name: 'Megan T.',
      title: 'Weekend Golf Companion',
      desc: 'Relaxed pace, loves morning tee times. Great at keeping the conversation flowing without pressure.',
      img: 'https://images.unsplash.com/photo-1718965018802-897e94ce7f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwc21pbGUlMjBvdXRkb29yfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 94,
      rating: 4.9,
      rebook: '94%',
      price: '$45/session',
      availability: 'Available This Weekend',
      whyMatch: ['Similar pace', 'Weekend availability', 'High compatibility'],
    },
    {
      id: 2,
      name: 'James R.',
      title: 'Coffee Walk Partner',
      desc: 'Easy-going listener with thoughtful insights. Enjoys exploring new neighborhoods on foot.',
      img: 'https://images.unsplash.com/photo-1764816657425-b3c79b616d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsJTIwb3V0ZG9vciUyMHNtaWxlfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 91,
      rating: 5.0,
      rebook: '97%',
      price: '$35/session',
      availability: 'Available Tomorrow',
      whyMatch: ['Matching energy', 'Morning availability', 'Shared interests'],
    },
    {
      id: 3,
      name: 'Lily C.',
      title: 'Conversation Partner',
      desc: 'Warm, genuine, and curious. Perfect for afternoon tea or a quiet evening chat.',
      img: 'https://images.unsplash.com/photo-1673623703556-eafc6dd91c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwZnJpZW5kbHklMjBuYXR1cmFsfGVufDF8fHx8MTc3MjQzMjUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      matchScore: 89,
      rating: 4.8,
      rebook: '91%',
      price: '$40/session',
      availability: 'Available Now',
      whyMatch: ['Conversational match', 'Calm energy', 'Evening availability'],
    },
  ];

  const chatMessages = [
    {
      type: 'ai',
      content: 'Hey! I\'d love to help you find the right companion. What are you looking for today?',
    },
    {
      type: 'user',
      content: 'Looking for a golf buddy this weekend. Someone relaxed.',
    },
    {
      type: 'ai',
      content: 'A laid-back round with good company — love it. I found 3 companions who match your energy. Megan T. is your top match at 94%!',
    },
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-[#F0EDE8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900" style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 600 }}>Find Your Companion</h1>
              <p className="text-gray-400" style={{ fontSize: '12px' }}>Tell me what you're looking for</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 space-y-6 md:space-y-8 md:max-w-3xl">
            {/* AI Chat */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] shadow-sm">
              <div className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-64 md:max-h-80 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 md:gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.type === 'ai' && (
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] md:max-w-md rounded-2xl px-3.5 md:px-4 py-2.5 md:py-3 ${
                        msg.type === 'ai'
                          ? 'bg-[#F7F5F2] text-gray-900'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                      }`}
                    >
                      <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 md:px-5 py-3 md:py-4 border-t border-[#F0EDE8]">
                <div className="flex gap-2 md:gap-3">
                  <input
                    placeholder="What kind of companion?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-[#F7F5F2] border border-[#E8E4DF] rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-300 transition-colors min-w-0"
                    style={{ fontSize: '14px' }}
                  />
                  <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl md:rounded-2xl px-4 md:px-5 flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Match Results */}
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-5">
                <h2 className="text-gray-900" style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600 }}>Your Top Matches</h2>
                {!isMobile && <span className="text-gray-400" style={{ fontSize: '13px' }}>AI-matched based on compatibility</span>}
              </div>

              <div className="space-y-4 md:space-y-5">
                {companions.map((companion) => (
                  <Link key={companion.id} to={`/app/providers/${companion.id}`} className="block group">
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 transition-all active:scale-[0.99]">
                      {/* Mobile: stacked, Desktop: side by side */}
                      <div className="flex gap-3 md:gap-5">
                        {/* Avatar */}
                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 md:ring-3 ring-rose-50">
                          <ImageWithFallback
                            src={companion.img}
                            alt={companion.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-0.5 md:mb-1">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 md:gap-2">
                                <h3 className="text-gray-900 truncate" style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: 600 }}>{companion.name}</h3>
                                <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                              </div>
                              <p className="text-rose-500 truncate" style={{ fontSize: '13px', fontWeight: 500 }}>{companion.title}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <div className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 600 }}>
                                {companion.matchScore}%
                              </div>
                              <span className="text-gray-400" style={{ fontSize: '10px' }}>match</span>
                            </div>
                          </div>

                          {!isMobile && (
                            <p className="text-gray-500 mb-3" style={{ fontSize: '14px', lineHeight: 1.5 }}>{companion.desc}</p>
                          )}

                          {/* Why this match */}
                          <div className="bg-rose-50/50 rounded-xl md:rounded-2xl p-2 md:p-3 mb-2 md:mb-3 border border-rose-100/50 mt-2 md:mt-0">
                            <div className="flex flex-wrap gap-1 md:gap-1.5">
                              {companion.whyMatch.map((reason, idx) => (
                                <span key={idx} className="text-rose-600 bg-white px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg border border-rose-100" style={{ fontSize: '11px' }}>
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-4" style={{ fontSize: '12px' }}>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-gray-900" style={{ fontWeight: 500 }}>{companion.rating}</span>
                              </div>
                              <span className="text-gray-300">·</span>
                              <span className="text-gray-900" style={{ fontWeight: 500 }}>{companion.price}</span>
                            </div>
                            <span className="text-green-600 bg-green-50 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-green-100" style={{ fontSize: '11px', fontWeight: 500 }}>
                              {companion.availability}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Insights Panel - hidden on mobile */}
      {!isMobile && <InsightsPanel />}
    </div>
  );
}
