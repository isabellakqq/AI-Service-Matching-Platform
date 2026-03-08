import { Clock, CheckCircle, MessageCircle, Star, Calendar } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function MyRequests() {
  const connections = [
    {
      id: 1,
      companion: 'Megan T.',
      title: 'Weekend Golf Companion',
      img: 'https://images.unsplash.com/photo-1718965018802-897e94ce7f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwc21pbGUlMjBvdXRkb29yfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'upcoming',
      date: 'This Saturday, 9:00 AM',
      activity: 'Golf — 18 holes at Presidio Golf Course',
      matchScore: 94,
      sessionsCompleted: 3,
      rating: 4.9,
    },
    {
      id: 2,
      companion: 'James R.',
      title: 'Coffee Walk Partner',
      img: 'https://images.unsplash.com/photo-1764816657425-b3c79b616d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsJTIwb3V0ZG9vciUyMHNtaWxlfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'pending',
      date: 'Requested for next Tuesday',
      activity: 'Coffee walk — Hayes Valley',
      matchScore: 91,
      sessionsCompleted: 0,
      rating: 5.0,
    },
    {
      id: 3,
      companion: 'Lily C.',
      title: 'Conversation Partner',
      img: 'https://images.unsplash.com/photo-1673623703556-eafc6dd91c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwZnJpZW5kbHklMjBuYXR1cmFsfGVufDF8fHx8MTc3MjQzMjUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'completed',
      date: 'Last Thursday, 4:00 PM',
      activity: 'Afternoon tea at The Mill',
      matchScore: 89,
      sessionsCompleted: 5,
      rating: 4.8,
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { icon: Calendar, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Upcoming' };
      case 'pending':
        return { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Pending' };
      case 'completed':
        return { icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', label: 'Completed' };
      default:
        return { icon: MessageCircle, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: 'Unknown' };
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-[#F0EDE8]">
        <h1 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>My Connections</h1>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: '13px' }}>Your sessions and companion history</p>
      </header>

      <div className="p-4 md:p-8 md:max-w-3xl">
        <div className="space-y-3 md:space-y-4">
          {connections.map((conn) => {
            const statusConfig = getStatusConfig(conn.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={conn.id}
                className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6 active:scale-[0.99] transition-all cursor-pointer"
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
