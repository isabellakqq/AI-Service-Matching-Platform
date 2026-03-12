import { useState, useEffect } from 'react';
import { Brain, Database, TrendingUp, Activity, Zap, Eye, Users, MessageSquare, Clock, Target, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';

export default function AIInsights() {
  const { isAuthenticated } = useAuth();
  const [companionCount, setCompanionCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    api.getCompanions().then(d => setCompanionCount((d.companions || []).length)).catch(() => {});
    if (isAuthenticated) {
      api.getBookings().then(d => setBookingCount((d.bookings || []).length)).catch(() => {});
    }
  }, [isAuthenticated]);

  const systemMemory = [
    {
      category: 'Connection Preferences',
      items: [
        { key: 'Social Energy', value: 'Relaxed & Low-key', confidence: 94 },
        { key: 'Activity Pace', value: 'Easy-going, No Rush', confidence: 89 },
        { key: 'Time Preference', value: 'Weekend Mornings', confidence: 97 },
        { key: 'Conversation Style', value: 'Warm & Genuine', confidence: 91 },
      ],
    },
    {
      category: 'Companionship History',
      items: [
        { key: 'Favorite Activities', value: 'Golf, Coffee Walks, Dog Park', confidence: 100 },
        { key: 'Typical Time Together', value: '2-3 hours', confidence: 100 },
        { key: 'Rebooking Rate', value: '92% with same companions', confidence: 100 },
        { key: 'Connection Quality', value: '4.8/5 mutual satisfaction', confidence: 88 },
      ],
    },
  ];

  const patternRecognition = [
    {
      pattern: 'Compatibility Chemistry',
      observation: 'You connect best with companions who match your energy level rather than skill expertise',
      impact: 'High',
      trend: 'up',
      detected: '6 days ago',
    },
    {
      pattern: 'Relationship Building Pace',
      observation: 'You tend to rebook companions after 2-3 sessions, suggesting you value familiarity over variety',
      impact: 'Medium',
      trend: 'up',
      detected: '2 weeks ago',
    },
    {
      pattern: 'Meaningful Connection Threshold',
      observation: 'Sessions longer than 2 hours show 85% higher satisfaction and deeper connection quality',
      impact: 'Medium',
      trend: 'neutral',
      detected: '3 weeks ago',
    },
    {
      pattern: 'Trust Signal Recognition',
      observation: 'Companions with 15+ completed sessions and high rebooking rates align better with your values',
      impact: 'High',
      trend: 'up',
      detected: '1 month ago',
    },
  ];

  const behavioralSignals = [
    {
      signal: 'Your: Response Warmth',
      change: 'Replying to companion messages with longer, more personal responses recently',
      indicator: 'Growing comfort and trust in connections',
      type: 'user',
    },
    {
      signal: 'Your: Session Extension Pattern',
      change: 'Extending 60% of sessions beyond planned time, indicating genuine enjoyment',
      indicator: 'High connection quality and authentic fit',
      type: 'user',
    },
    {
      signal: 'Network: Availability Rhythm',
      change: 'Your favorite companions showing 18% less weekend availability in spring',
      indicator: 'Consider booking earlier or exploring new connections',
      type: 'network',
    },
    {
      signal: 'Network: Companion Retention',
      change: 'Companions you\'ve met 3+ times are now booking 40% longer sessions with all clients',
      indicator: 'Deepening relationship quality across the network',
      type: 'network',
    },
  ];

  const intelligenceEvolution = [
    {
      capability: 'Compatibility Sensing',
      before: 82,
      after: 94,
      improvement: 12,
      description: 'Learned to prioritize personality harmony and emotional resonance over activity expertise',
      status: 'improving',
    },
    {
      capability: 'Connection Chemistry',
      before: 76,
      after: 91,
      improvement: 15,
      description: 'Better prediction of long-term relationship potential and mutual comfort level',
      status: 'improving',
    },
    {
      capability: 'Emotional Context Reading',
      before: 88,
      after: 96,
      improvement: 8,
      description: 'Enhanced understanding of what kind of companionship you need in different life moments',
      status: 'improving',
    },
    {
      capability: 'Relationship Diversity Balance',
      before: 91,
      after: 89,
      improvement: -2,
      description: 'Slightly over-favoring familiar companions, adjusting to introduce fresh connections',
      status: 'calibrating',
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-[#F0EDE8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-400 to-amber-500 rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>Connection Intelligence</h1>
              <p className="text-gray-400 mt-0.5 hidden md:block" style={{ fontSize: '13px' }}>How AI learns to match you with the right companions</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-rose-50 border border-rose-200 rounded-lg md:rounded-xl">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full animate-pulse"></div>
            <span className="text-rose-700" style={{ fontSize: '11px', fontWeight: 500 }}>Learning Active</span>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* 1️⃣ System Memory */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 md:gap-3">
            <Database className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            <h2 className="text-gray-900" style={{ fontSize: '17px', fontWeight: 600 }}>System Memory</h2>
            <span className="text-sm text-gray-500">What I remember about your connection style</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            {systemMemory.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl md:rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {section.category}
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                    {section.items.length} stored
                  </span>
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">{item.key}</div>
                        <div className="font-medium text-gray-900">{item.value}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-gray-500">confidence</div>
                        <div className="text-sm font-semibold text-blue-600">{item.confidence}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl md:rounded-2xl border border-blue-200 p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Memory Utilization</h4>
                <p className="text-gray-700 leading-relaxed">
                  The system has stored <span className="font-semibold text-blue-600">{companionCount > 0 ? companionCount * 9 + bookingCount * 3 : 47} data points</span> about your preferences, 
                  behavior, and context across <span className="font-semibold text-blue-600">{companionCount || 5} available companions</span>. This memory layer enables <span className="font-semibold text-blue-600">personalized matching</span> without 
                  requiring manual configuration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Pattern Recognition */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 md:gap-3">
            <Eye className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
            <h2 className="text-gray-900" style={{ fontSize: '17px', fontWeight: 600 }}>Pattern Recognition</h2>
            <span className="text-sm text-gray-500">Relationship trends I've discovered</span>
          </div>

          <div className="space-y-3 md:space-y-4">
            {patternRecognition.map((pattern, idx) => {
              const impactColors = {
                High: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
                Medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
                Low: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
              }[pattern.impact];

              return (
                <div key={idx} className="bg-white rounded-2xl md:rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{pattern.pattern}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Detected {pattern.detected}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1.5 ${impactColors.bg} ${impactColors.text} rounded-lg border ${impactColors.border} font-medium`}>
                        {pattern.impact} Impact
                      </span>
                      {pattern.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-[52px]">{pattern.observation}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3️⃣ Behavioral Signals */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 md:gap-3">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            <h2 className="text-gray-900" style={{ fontSize: '17px', fontWeight: 600 }}>Behavioral Signals</h2>
            <span className="text-sm text-gray-500">Behavior shifts that reveal deeper insights</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            {behavioralSignals.map((signal, idx) => {
              const typeConfig = signal.type === 'user' 
                ? { icon: Users, color: 'green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
                : { icon: Target, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
              
              const Icon = typeConfig.icon;

              return (
                <div key={idx} className="bg-white rounded-2xl md:rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 ${typeConfig.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${typeConfig.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{signal.signal}</h3>
                      </div>
                      <span className={`inline-block text-xs px-2 py-1 ${typeConfig.bg} ${typeConfig.text} rounded-md border ${typeConfig.border}`}>
                        {signal.type === 'user' ? 'Your Behavior' : 'Network Insight'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pl-[52px]">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Observed Change</div>
                      <div className="text-sm text-gray-900">{signal.change}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Concierge Interpretation</div>
                      <div className="text-sm font-medium text-gray-900">{signal.indicator}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4️⃣ Intelligence Evolution */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 md:gap-3">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
            <h2 className="text-gray-900" style={{ fontSize: '17px', fontWeight: 600 }}>Intelligence Evolution</h2>
            <span className="text-sm text-gray-500">Where I'm becoming smarter at matching</span>
          </div>

          <div className="space-y-3 md:space-y-4">
            {intelligenceEvolution.map((capability, idx) => {
              const isImproving = capability.status === 'improving';
              const statusConfig = isImproving
                ? { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Improving' }
                : { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Calibrating' };

              return (
                <div key={idx} className="bg-white rounded-2xl md:rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{capability.capability}</h3>
                      <p className="text-sm text-gray-600">{capability.description}</p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 ${statusConfig.bg} ${statusConfig.text} rounded-lg border ${statusConfig.border} font-medium whitespace-nowrap ml-4`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500">Before</span>
                          <span className="font-semibold text-gray-900">{capability.before}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-gray-400 h-2 rounded-full" 
                            style={{ width: `${capability.before}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500">After</span>
                          <span className="font-semibold text-gray-900">{capability.after}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isImproving ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${capability.after}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center pt-2">
                      <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig.bg} rounded-xl border ${statusConfig.border}`}>
                        {isImproving ? (
                          <>
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">+{capability.improvement}% improvement</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">{capability.improvement}% change (recalibrating)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl md:rounded-2xl border border-orange-200 p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Continuous Learning</h4>
                <p className="text-gray-700 leading-relaxed">
                  I've analyzed <span className="font-semibold text-orange-600">{companionCount || 5} companions</span>{bookingCount > 0 ? <> and <span className="font-semibold text-orange-600">{bookingCount} of your bookings</span></> : null} to understand your preferences.
                  With <span className="font-semibold text-orange-600">{companionCount > 0 ? companionCount * 37 : 186} data points</span> across our community, 
                  every conversation, session, and connection teaches me more about finding companions who truly fit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}