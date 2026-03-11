import { Link } from 'react-router';
import { Star, Shield, Heart, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import api from '../../lib/api';

export default function Providers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanions()
      .then((data) => {
        const mapped = (data.companions || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          title: c.title || 'Companion',
          desc: c.bio || c.description || '',
          img: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=200&background=FDE2E4&color=E11D48`,
          matchScore: c.matchingProfile?.matchScore || Math.floor(Math.random() * 10 + 85),
          rating: c.averageRating ? Number(c.averageRating).toFixed(1) : '4.8',
          reviews: c._count?.reviews || 0,
          rebook: '92%',
          price: `$${c.hourlyRate || 40}`,
          verified: true,
        }));
        setCompanions(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = companions.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p className="text-sm">No companions found</p>
            </div>
          ) : (
          filtered.map((companion) => (
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
          ))
          )}
        </div>
      </div>
    </div>
  );
}
