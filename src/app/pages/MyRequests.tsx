import { useState, useEffect } from 'react';
import { Clock, CheckCircle, MessageCircle, Star, Calendar, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';

export default function MyRequests() {
  const { isAuthenticated } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    api.getBookings()
      .then(async (data) => {
        const bookings = data.bookings || [];
        const mapped = await Promise.all(bookings.map(async (b: any) => {
          let companion = b.companion || {};
          if (!companion.name && b.companionId) {
            try {
              const c = await api.getCompanion(b.companionId);
              companion = c.companion || c || {};
            } catch {}
          }
          return {
            id: b.id,
            companionId: companion.id || b.companionId,
            companion: companion.name || 'Companion',
            title: b.activity || 'Session',
            img: companion.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(companion.name || 'C')}&size=200&background=FDE2E4&color=E11D48`,
            status: b.status || 'pending',
            date: b.scheduledAt
              ? new Date(b.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
              : 'TBD',
            activity: `${b.activity || 'Session'}${b.location ? ' — ' + b.location : ''}`,
            matchScore: Math.floor(Math.random() * 10 + 85),
            sessionsCompleted: companion.totalSessions || 0,
            rating: companion.averageRating ? Number(companion.averageRating).toFixed(1) : '4.8',
          };
        }));
        setConnections(mapped);
      })
      .catch((err) => setError(err.message || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming': case 'confirmed':
        return { icon: Calendar, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Upcoming' };
      case 'pending':
        return { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Pending' };
      case 'completed':
        return { icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', label: 'Completed' };
      case 'cancelled':
        return { icon: Clock, bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: 'Cancelled' };
      default:
        return { icon: MessageCircle, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: status || 'Unknown' };
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-[#F0EDE8]">
        <h1 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>My Connections</h1>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: '13px' }}>Your sessions and companion history</p>
      </header>

      <div className="p-4 md:p-8 md:max-w-3xl">
        {!isAuthenticated ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500" style={{ fontSize: '16px', fontWeight: 500 }}>Sign in to view your connections</h3>
            <p className="text-gray-400 mt-1" style={{ fontSize: '13px' }}>Your booking history will appear here</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-2" style={{ fontSize: '14px' }}>{error}</p>
            <button onClick={() => window.location.reload()} className="text-rose-500 underline text-sm">Try again</button>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500" style={{ fontSize: '16px', fontWeight: 500 }}>No connections yet</h3>
            <p className="text-gray-400 mt-1" style={{ fontSize: '13px' }}>Book a companion from the Explore page to get started!</p>
            <Link to="/app/providers" className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-xl text-sm font-medium">
              Browse Companions
            </Link>
          </div>
        ) : (
        <div className="space-y-3 md:space-y-4">
          {connections.map((conn) => {
            const statusConfig = getStatusConfig(conn.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Link
                to={conn.companionId ? `/app/providers/${conn.companionId}` : '#'}
                key={conn.id}
                className="block bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6 active:scale-[0.99] transition-all cursor-pointer hover:border-rose-200"
              >
                <div className="flex gap-3 md:gap-5">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-rose-50">
                    <ImageWithFallback
                      src={conn.img}
                      alt={conn.companion}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0.5 md:mb-1">
                      <div className="min-w-0">
                        <h3 className="text-gray-900 truncate" style={{ fontSize: '15px', fontWeight: 600 }}>{conn.companion}</h3>
                        <p className="text-rose-500 truncate" style={{ fontSize: '12px', fontWeight: 500 }}>{conn.title}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 ${statusConfig.bg} ${statusConfig.text} rounded-lg md:rounded-xl border ${statusConfig.border} flex-shrink-0 ml-2`} style={{ fontSize: '11px', fontWeight: 500 }}>
                        <StatusIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <p className="text-gray-500 mb-2 md:mb-3 truncate" style={{ fontSize: '13px' }}>{conn.activity}</p>

                    <div className="flex items-center flex-wrap gap-x-2 md:gap-x-4 gap-y-1" style={{ fontSize: '12px' }}>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600 truncate">{conn.date}</span>
                      </div>
                      <span className="text-gray-300 hidden md:inline">·</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-gray-900" style={{ fontWeight: 500 }}>{conn.rating}</span>
                      </div>
                      <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" style={{ fontWeight: 600 }}>{conn.matchScore}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
