import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Shield, Calendar, Heart, Clock, MessageCircle, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import api from '../../lib/api';

export default function ProviderDetail() {
  const { id } = useParams();
  const [companion, setCompanion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getCompanion(id)
      .then((data) => {
        const c = data.companion || data;
        setCompanion({
          name: c.name,
          title: c.title || 'Companion',
          location: c.location || 'Available Online',
          img: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=200&background=FDE2E4&color=E11D48`,
          matchScore: c.matchingProfile?.matchScore || 90,
          rating: c.averageRating ? Number(c.averageRating).toFixed(1) : '4.8',
          reviews: c._count?.reviews || c.reviews?.length || 0,
          rebook: '92%',
          price: `$${c.hourlyRate || 40}`,
          responseTime: '< 30 min',
          sessionsCompleted: c._count?.bookings || 0,
          memberSince: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bio: c.bio || c.description || 'This companion hasn\'t added a bio yet.',
          whyMatch: [
            'Great compatibility match',
            'Available for your preferred times',
            'Similar personality energy',
            'Highly rated by other users',
          ],
          activities: c.activities?.map((a: any) => a.name) || ['Conversation', 'Walking', 'Coffee'],
          recentReviews: (c.reviews || []).slice(0, 3).map((r: any) => ({
            name: r.user?.name || 'Anonymous',
            rating: r.rating,
            text: r.comment || 'Great experience!',
            date: new Date(r.createdAt).toLocaleDateString(),
          })),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500">Companion not found</p>
        <Link to="/app/providers" className="text-rose-500 hover:underline text-sm">← Back to companions</Link>
      </div>
    );
  }

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
              <h2 className="text-gray-900 mb-2 md:mb-3" style={{ fontSize: '15px', fontWeight: 600 }}>About {companion.name}</h2>
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
