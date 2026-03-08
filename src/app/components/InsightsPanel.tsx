import { Heart, TrendingUp, Star, Clock, Shield, Sparkles } from 'lucide-react';

export default function InsightsPanel() {
  const compatibilityMetrics = [
    { label: 'Energy Match', score: 96, color: 'from-rose-400 to-rose-500' },
    { label: 'Personality Fit', score: 92, color: 'from-amber-400 to-amber-500' },
    { label: 'Availability Sync', score: 98, color: 'from-green-400 to-green-500' },
    { label: 'Interest Overlap', score: 88, color: 'from-purple-400 to-purple-500' },
  ];

  return (
    <aside className="w-72 bg-white border-l border-[#F0EDE8] overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Compatibility Score */}
        <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-5 border border-rose-100/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600" style={{ fontSize: '13px', fontWeight: 500 }}>Compatibility Score</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-center mb-3">
            <div className="text-gray-900 mb-1" style={{ fontSize: '48px', fontWeight: 600 }}>
              94<span className="text-gray-400" style={{ fontSize: '28px' }}>%</span>
            </div>
            <p className="text-rose-500" style={{ fontSize: '13px', fontWeight: 500 }}>Exceptional Match</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-600" style={{ fontSize: '12px', fontWeight: 500 }}>+12% from last match</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <h3 className="text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>Match Breakdown</h3>
          {compatibilityMetrics.map((metric, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500" style={{ fontSize: '13px' }}>{metric.label}</span>
                <span className="text-gray-900" style={{ fontSize: '13px', fontWeight: 600 }}>{metric.score}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`bg-gradient-to-r ${metric.color} h-1.5 rounded-full transition-all`}
                  style={{ width: `${metric.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Score */}
        <div className="bg-green-50/70 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-800" style={{ fontSize: '13px', fontWeight: 500 }}>Trust Score</span>
            <Shield className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-green-900 mb-1" style={{ fontSize: '28px', fontWeight: 600 }}>
            4.9<span className="text-green-500" style={{ fontSize: '18px' }}>/5.0</span>
          </div>
          <p className="text-green-600" style={{ fontSize: '12px' }}>Based on 127 sessions</p>
        </div>

        {/* Quick Insights */}
        <div className="space-y-2.5">
          <h3 className="text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>Connection Insights</h3>

          <div className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-2xl border border-rose-100/50">
            <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 500 }}>High Rebooking</p>
              <p className="text-gray-500 mt-0.5" style={{ fontSize: '12px' }}>94% of people rebook this companion</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50/50 rounded-2xl border border-green-100/50">
            <Clock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 500 }}>Quick Responder</p>
              <p className="text-gray-500 mt-0.5" style={{ fontSize: '12px' }}>Usually replies within 30 minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
            <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 500 }}>Natural Chemistry</p>
              <p className="text-gray-500 mt-0.5" style={{ fontSize: '12px' }}>Shares your pace & energy level</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
