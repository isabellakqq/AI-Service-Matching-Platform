import { useParams, Link } from 'react-router';
import { ArrowLeft, Star, Shield, Calendar, Heart, Clock, MessageCircle, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function ProviderDetail() {
  const { id } = useParams();

  const companion = {
    name: 'Megan T.',
    title: 'Weekend Golf Companion',
    location: 'San Francisco, CA',
    img: 'https://images.unsplash.com/photo-1718965018802-897e94ce7f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwc21pbGUlMjBvdXRkb29yfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    matchScore: 94,
    rating: 4.9,
    reviews: 127,
    rebook: '94%',
    price: '$45',
    responseTime: '< 30 min',
    sessionsCompleted: 312,
    memberSince: 'March 2024',
    bio: 'I believe the best rounds of golf are the ones where the conversation is as good as the game. I play at a relaxed pace and enjoy getting to know people. Whether you\'re a scratch golfer or just starting out, I\'m here for good company first and birdie putts second.',
    whyMatch: [
      'Matches your relaxed, no-pressure pace',
      'Available on weekend mornings — your preferred time',
      'Similar personality energy and conversation style',
      'Highly rated by people with similar preferences',
    ],
    activities: ['Golf (18 holes)', 'Driving Range', 'Coffee Walk', 'Dog Park'],
    recentReviews: [
      {
        name: 'David L.',
        rating: 5,
        text: 'Megan made my first time golfing in years feel so comfortable. No judgment, just fun.',
        date: '2 weeks ago',
      },
      {
        name: 'Sandra W.',
        rating: 5,
        text: 'We ended up chatting for an hour after our round! Already rebooked for next weekend.',
        date: '1 month ago',
      },
      {
        name: 'Tom H.',
        rating: 4,
        text: 'Great companion. Very genuine and warm. Made the whole experience feel like hanging out with an old friend.',
        date: '1 month ago',
      },
    ],
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FBF9F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#F0EDE8] px-4 md:px-8 py-3 md:py-5">
        <Link to="/app/providers" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors" style={{ fontSize: '13px' }}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="p-4 md:p-8 md:max-w-4xl md:mx-auto space-y-4 md:space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] overflow-hidden">
          {/* Warm gradient banner */}
          <div className="h-16 md:h-24 bg-gradient-to-r from-rose-100 via-amber-50 to-rose-50"></div>

          <div className="px-4 md:px-8 pb-5 md:pb-8">
            {/* Mobile: centered, Desktop: side by side */}
            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6 -mt-10 md:-mt-12">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg flex-shrink-0 mx-auto md:mx-0">
                <ImageWithFallback
                  src={companion.img}
                  alt={companion.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left md:pb-2">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
                  <h1 className="text-gray-900" style={{ fontSize: '22px', fontWeight: 600 }}>{companion.name}</h1>
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-rose-500" style={{ fontSize: '15px', fontWeight: 500 }}>{companion.title}</p>
                <div className="flex items-center justify-center md:justify-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-400" style={{ fontSize: '13px' }}>{companion.location}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4 md:hidden">
              <Button variant="outline" className="flex-1 rounded-xl border-[#E8E4DF] text-gray-600 h-10" style={{ fontSize: '14px' }}>
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Message
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl h-10" style={{ fontSize: '14px' }}>
                <Calendar className="w-4 h-4 mr-1.5" />
                Book Session
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-3 mt-4 justify-end">
              <Button variant="outline" className="rounded-2xl border-[#E8E4DF] text-gray-600 hover:border-rose-200">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl px-6">
                <Calendar className="w-4 h-4 mr-2" />
                Book Session
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
              {[
                { value: companion.rating.toString(), sub: `${companion.reviews} reviews`, icon: Star },
                { value: companion.rebook, sub: 'rebook', icon: Heart },
                { value: companion.responseTime, sub: 'reply', icon: Clock },
                { value: companion.sessionsCompleted.toString(), sub: 'sessions', icon: CheckCircle },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-[#F7F5F2] rounded-xl md:rounded-2xl p-2.5 md:p-4 text-center">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400 mx-auto mb-1 md:mb-2" />
                    <div className="text-gray-900" style={{ fontSize: '16px', fontWeight: 600 }}>{stat.value}</div>
                    <div className="text-gray-400 truncate" style={{ fontSize: '10px' }}>{stat.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content - single column on mobile, 3-col on desktop */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
              <h2 className="text-gray-900 mb-2 md:mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>About Megan</h2>
              <p className="text-gray-600" style={{ fontSize: '14px', lineHeight: 1.7 }}>{companion.bio}</p>
            </div>

            {/* AI Why Match */}
            <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl md:rounded-3xl border border-rose-100/50 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />
                <h2 className="text-gray-900" style={{ fontSize: '15px', fontWeight: 600 }}>Why this match</h2>
                <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" style={{ fontSize: '14px', fontWeight: 600 }}>— {companion.matchScore}%</span>
              </div>
              <div className="space-y-2 md:space-y-2.5">
                {companion.whyMatch.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 md:gap-3">
                    <CheckCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700" style={{ fontSize: '13px' }}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
              <h2 className="text-gray-900 mb-4 md:mb-5" style={{ fontSize: '15px', fontWeight: 600 }}>Recent Reviews</h2>
              <div className="space-y-4 md:space-y-5">
                {companion.recentReviews.map((review, idx) => (
                  <div key={idx} className="pb-4 md:pb-5 border-b border-[#F0EDE8] last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full flex items-center justify-center">
                          <span className="text-rose-700" style={{ fontSize: '11px', fontWeight: 600 }}>{review.name[0]}</span>
                        </div>
                        <span className="text-gray-900" style={{ fontSize: '13px', fontWeight: 500 }}>{review.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600" style={{ fontSize: '13px', lineHeight: 1.6 }}>{review.text}</p>
                    <span className="text-gray-400 mt-1.5 block" style={{ fontSize: '11px' }}>{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4 md:space-y-6">
            {/* Pricing - sticky on mobile bottom */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6 text-center">
              <h3 className="text-gray-400 mb-1 md:mb-2" style={{ fontSize: '12px' }}>Starting from</h3>
              <div className="text-gray-900 mb-1" style={{ fontSize: '32px', fontWeight: 600 }}>
                {companion.price}<span className="text-gray-400" style={{ fontSize: '14px', fontWeight: 400 }}>/session</span>
              </div>
              <p className="text-gray-400 mb-4" style={{ fontSize: '12px' }}>Flexible scheduling</p>
              <Button className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl md:rounded-2xl h-11 md:h-12">
                Book Session
              </Button>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
              <h3 className="text-gray-900 mb-3 md:mb-4" style={{ fontSize: '14px', fontWeight: 600 }}>Activities</h3>
              <div className="flex flex-wrap gap-2">
                {companion.activities.map((activity, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-[#F7F5F2] text-gray-700 rounded-lg md:rounded-xl border border-[#E8E4DF]" style={{ fontSize: '12px' }}>
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
              <h3 className="text-gray-900 mb-3 md:mb-4" style={{ fontSize: '14px', fontWeight: 600 }}>This Week</h3>
              <div className="space-y-2 md:space-y-2.5">
                {[
                  { day: 'Saturday', time: '8 AM – 12 PM', open: true },
                  { day: 'Sunday', time: '9 AM – 1 PM', open: true },
                  { day: 'Monday', time: '—', open: false },
                  { day: 'Tuesday', time: '10 AM – 2 PM', open: true },
                ].map((slot, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontSize: '13px' }}>{slot.day}</span>
                    <span className={slot.open ? 'text-green-600' : 'text-gray-300'} style={{ fontSize: '13px', fontWeight: slot.open ? 500 : 400 }}>
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="bg-green-50/70 rounded-2xl md:rounded-3xl border border-green-100 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Shield className="w-4 h-4 text-green-500" />
                <h3 className="text-green-800" style={{ fontSize: '14px', fontWeight: 600 }}>Verified & Trusted</h3>
              </div>
              <div className="space-y-1.5 md:space-y-2" style={{ fontSize: '12px' }}>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ID Verified</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Background Checked</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Member since {companion.memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
