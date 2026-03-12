import { useState, useEffect, useRef } from 'react';
import { Send, Heart, Star, Shield, Sparkles, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import InsightsPanel from '../components/InsightsPanel';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useIsMobile } from '../components/ui/use-mobile';
import api from '../../lib/api';

export default function Dashboard() {
  const location = useLocation();
  const landingState = location.state as { query?: string; preferences?: any; recommendations?: any[]; moods?: string[] } | null;
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const isMobile = useIsMobile();

  // Companions from API
  const [companions, setCompanions] = useState<any[]>([]);
  const [loadingCompanions, setLoadingCompanions] = useState(true);

  // AI chat
  const [chatMessages, setChatMessages] = useState<Array<{ type: string; content: string }>>([
    { type: 'ai', content: "Hey! I'd love to help you find the right companion. What are you looking for today?" },
  ]);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCompanions()
      .then((data) => {
        // Map backend companion data to UI format
        const mapped = (data.companions || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          title: c.title || 'Companion',
          desc: c.bio || c.description || '',
          img: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=200&background=FDE2E4&color=E11D48`,
          matchScore: c.matchingProfile?.matchScore || Math.floor(Math.random() * 10 + 85),
          rating: c.averageRating ? Number(c.averageRating).toFixed(1) : '4.8',
          rebook: '92%',
          price: `$${c.hourlyRate || 40}/session`,
          availability: 'Available',
          whyMatch: ['Great match', 'Compatible energy', 'Available'],
        }));
        setCompanions(mapped);
      })
      .catch(console.error)
      .finally(() => setLoadingCompanions(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle state passed from Landing page
  const landingHandled = useRef(false);
  useEffect(() => {
    if (!landingState || landingHandled.current) return;
    landingHandled.current = true;

    // If landing page passed recommendations, show them
    if (landingState.recommendations && landingState.recommendations.length > 0) {
      const mapped = landingState.recommendations.map((c: any) => ({
        id: c.id,
        name: c.name,
        title: c.title || 'Companion',
        desc: c.bio || c.description || '',
        img: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=200&background=FDE2E4&color=E11D48`,
        matchScore: c.matchScore || Math.floor(Math.random() * 10 + 85),
        rating: c.averageRating ? Number(c.averageRating).toFixed(1) : '4.8',
        rebook: '92%',
        price: `$${c.hourlyRate || 40}/session`,
        availability: 'Available',
        whyMatch: c.matchReasons || ['Great match', 'Compatible energy'],
      }));
      setCompanions(mapped);
      setLoadingCompanions(false);
    }

    // If landing page passed a query, show it in chat
    if (landingState.query) {
      const moodStr = landingState.moods?.length ? ' (' + landingState.moods.join(', ') + ')' : '';
      setChatMessages(prev => [
        ...prev,
        { type: 'user', content: landingState.query + moodStr },
        { type: 'ai', content: 'I found some great matches based on your preferences! Check out the companions below.' },
      ]);
    }

    // Clear the state so it doesn't re-trigger on navigation
    window.history.replaceState({}, '');
  }, [landingState]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    const userMsg = message.trim();
    setMessage('');
    setChatMessages(prev => [...prev, { type: 'user', content: userMsg }]);

    const newHistory = [...conversationHistory, { role: 'user', content: userMsg }];
    setConversationHistory(newHistory);
    setSending(true);

    try {
      const data = await api.sendAIMessage(userMsg, newHistory);
      setChatMessages(prev => [...prev, { type: 'ai', content: data.response }]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: data.response }]);

      // If AI returned recommendations, update companions
      if (data.recommendations && data.recommendations.length > 0) {
        const mapped = data.recommendations.map((c: any) => ({
          id: c.id,
          name: c.name,
          title: c.title || 'Companion',
          desc: c.bio || c.description || '',
          img: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=200&background=FDE2E4&color=E11D48`,
          matchScore: c.matchScore || Math.floor(Math.random() * 10 + 85),
          rating: c.averageRating ? Number(c.averageRating).toFixed(1) : '4.8',
          rebook: '92%',
          price: `$${c.hourlyRate || 40}/session`,
          availability: 'Available',
          whyMatch: c.matchReasons || ['Great match', 'Compatible energy'],
        }));
        setCompanions(mapped);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { type: 'ai', content: "I'm having trouble connecting right now. Please try again!" }]);
    } finally {
      setSending(false);
    }
  };

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
                {sending && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-[#F7F5F2] rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="px-3 md:px-5 py-3 md:py-4 border-t border-[#F0EDE8]">
                <div className="flex gap-2 md:gap-3">
                  <input
                    placeholder="What kind of companion?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-[#F7F5F2] border border-[#E8E4DF] rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-300 transition-colors min-w-0"
                    style={{ fontSize: '14px' }}
                  />
                  <Button onClick={handleSend} disabled={sending} className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl md:rounded-2xl px-4 md:px-5 flex-shrink-0">
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
                {loadingCompanions ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
                  </div>
                ) : companions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-sm">No companions yet. Try chatting with AI to find matches!</p>
                  </div>
                ) : (
                companions.map((companion) => (
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
                ))
                )}
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
