import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, ArrowRight, Shield, Star, Users, Sparkles, Pencil, Plus, X, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';

const moodTags = [
  { label: 'Relaxed', emoji: '😌' },
  { label: 'Energetic', emoji: '⚡' },
  { label: 'Quiet', emoji: '🤫' },
  { label: 'Social', emoji: '🎉' },
  { label: 'Structured', emoji: '📋' },
  { label: 'Beginner-Friendly', emoji: '🌱' },
];

// Check if SpeechRecognition is available
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

function parseIntent(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  if (lower.includes('golf')) tags.push('Weekend Golf');
  if (lower.includes('coffee') || lower.includes('walk')) tags.push('Coffee Walk');
  if (lower.includes('dog') || lower.includes('park')) tags.push('Dog Park Hangout');
  if (lower.includes('travel') || lower.includes('trip')) tags.push('Travel Adventure');
  if (lower.includes('tutor') || lower.includes('homework') || lower.includes('study')) tags.push('Homework Mentor');
  if (lower.includes('conversation') || lower.includes('chat') || lower.includes('talk')) tags.push('Conversation');
  if (lower.includes('weekend')) tags.push('Weekend');
  if (lower.includes('morning')) tags.push('Morning');
  if (lower.includes('evening') || lower.includes('night')) tags.push('Evening');
  if (lower.includes('relax') || lower.includes('chill') || lower.includes('easy')) tags.push('Relaxed Pace');
  if (lower.includes('bay area') || lower.includes('sf') || lower.includes('san francisco')) tags.push('Bay Area');
  if (lower.includes('outdoor') || lower.includes('nature') || lower.includes('hike')) tags.push('Outdoor Activity');
  if (tags.length === 0 && text.trim().length > 10) {
    tags.push('Companionship');
    if (lower.includes('friend')) tags.push('Friendly Vibe');
  }
  return tags;
}

function getAiResponse(tags: string[], moods: string[]): string {
  const moodStr = moods.length > 0 ? moods.map(m => m.toLowerCase()).join(' and ') + ' ' : '';
  if (tags.length === 0 && moods.length === 0) return '';
  if (tags.length === 0 && moods.length > 0) {
    return `Got it — I'll find companions who match your ${moodStr}energy.`;
  }
  const activity = tags[0] || 'time together';
  return `Got it — I'll find companions who match your ${moodStr}${activity.toLowerCase()} style.`;
}

export default function Landing() {
  const [query, setQuery] = useState('');
  const [parsedTags, setParsedTags] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [showUnderstanding, setShowUnderstanding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractedPreferences, setExtractedPreferences] = useState<any>({});
  const [featuredCompanions, setFeaturedCompanions] = useState<any[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceHint, setVoiceHint] = useState('');
  const recognitionRef = useRef<any>(null);
  const pulseTimerRef = useRef<number>(0);

  // Check browser support
  useEffect(() => {
    setVoiceSupported(!!SpeechRecognition);
  }, []);

  // Load real companions for featured section
  useEffect(() => {
    api.getCompanions()
      .then((data) => {
        const mapped = (data.companions || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          title: c.title || 'Companion',
          desc: c.description || '',
          img: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=200&background=FDE2E4&color=E11D48`,
          rating: c.rating || 4.8,
          rebook: `${c.rebookRate || 92}%`,
          price: `$${c.price || 40}`,
        }));
        if (mapped.length > 0) setFeaturedCompanions(mapped);
      })
      .catch(() => {});
  }, []);

  // Setup SpeechRecognition instance
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceHint('Listening… speak naturally');
      finalTranscript = query; // preserve existing text
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
        } else {
          interim = transcript;
        }
      }
      // Show final + interim combined
      setQuery(finalTranscript + (interim ? ' ' + interim : ''));
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setVoiceHint('Microphone access denied');
      } else if (event.error === 'no-speech') {
        setVoiceHint('No speech detected — try again');
      } else {
        setVoiceHint('Something went wrong — try again');
      }
      setTimeout(() => setVoiceHint(''), 3000);
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceHint('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []); // intentionally stable — query is captured via closure in onstart

  const toggleVoice = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      // Re-bind onstart to capture latest query
      const currentQuery = query;
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceHint('Listening… speak naturally');
      };
      // We need to capture the current query for onresult
      let finalTranscript = currentQuery;
      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += (finalTranscript ? ' ' : '') + transcript;
          } else {
            interim = transcript;
          }
        }
        setQuery(finalTranscript + (interim ? ' ' + interim : ''));
      };
      try {
        recognition.start();
      } catch (e) {
        // already started
      }
    }
  }, [isListening, query]);

  // Debounced AI matching via backend
  useEffect(() => {
    const text = query.trim();
    if (text.length < 3 && selectedMoods.length === 0) {
      setParsedTags([]);
      setShowUnderstanding(false);
      setAiResponse('');
      setRecommendations([]);
      setExtractedPreferences({});
      return;
    }
    const timer = setTimeout(async () => {
      const moodSuffix = selectedMoods.length > 0
        ? '. I prefer a ' + selectedMoods.join(', ').toLowerCase() + ' vibe.'
        : '';
      const fullMessage = (text || 'Find me a companion') + moodSuffix;

      setAiLoading(true);
      try {
        const data = await api.sendAIMessage(fullMessage, []);
        setAiResponse(data.response);
        setExtractedPreferences(data.extractedPreferences || {});
        setRecommendations(data.recommendations || []);

        // Build display tags from extracted preferences
        const tags: string[] = [];
        const prefs = data.extractedPreferences || {};
        if (prefs.interests) tags.push(...prefs.interests.map((i: string) => i.charAt(0).toUpperCase() + i.slice(1)));
        if (prefs.activity && !tags.some(t => t.toLowerCase() === prefs.activity.toLowerCase())) {
          tags.push(prefs.activity.charAt(0).toUpperCase() + prefs.activity.slice(1));
        }
        if (prefs.preferredTimes) tags.push(...prefs.preferredTimes.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)));
        if (prefs.budget) tags.push(`Budget: $${prefs.budget}`);
        setParsedTags(tags.length > 0 ? [...new Set(tags)] : parseIntent(text));
        setShowUnderstanding(true);
      } catch (err) {
        // Fallback to local parsing
        const tags = parseIntent(text);
        setParsedTags(tags);
        setShowUnderstanding(tags.length > 0 || selectedMoods.length > 0);
        setAiResponse(getAiResponse(tags, selectedMoods));
      } finally {
        setAiLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [query, selectedMoods]);

  const toggleMood = useCallback((mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  }, []);

  const removeTag = useCallback((tag: string) => {
    setParsedTags(prev => prev.filter(t => t !== tag));
  }, []);

  const addTag = useCallback(() => {
    const newTag = prompt('Add a detail:');
    if (newTag && newTag.trim()) {
      setParsedTags(prev => [...prev, newTag.trim()]);
    }
  }, []);

  const hasIntent = aiLoading || (showUnderstanding && (parsedTags.length > 0 || selectedMoods.length > 0));

  return (
    <div className="min-h-screen bg-[#FBF9F7]" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Pulse animation for mic */}
      <style>{`
        @keyframes voice-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(244, 63, 94, 0); }
        }
        @keyframes voice-wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        .mic-pulse { animation: voice-pulse 1.5s ease-in-out infinite; }
        .voice-bar { animation: voice-wave 0.8s ease-in-out infinite; }
        .voice-bar:nth-child(2) { animation-delay: 0.1s; }
        .voice-bar:nth-child(3) { animation-delay: 0.2s; }
        .voice-bar:nth-child(4) { animation-delay: 0.3s; }
        .voice-bar:nth-child(5) { animation-delay: 0.15s; }
      `}</style>

      {/* Header */}
      <header className="border-b border-[#F0EDE8]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-gray-900" style={{ fontSize: '17px', fontWeight: 600 }}>Kindora</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <Link to="/app">
                <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl px-4 md:px-6 h-9 md:h-10" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Go to App
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="ghost" className="text-gray-500 hover:text-gray-900 hidden md:inline-flex" style={{ fontSize: '14px', fontWeight: 400 }} onClick={() => { setAuthTab('login'); setAuthOpen(true); }}>Sign In</Button>
                <Button className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl px-4 md:px-6 h-9 md:h-10" style={{ fontSize: '14px', fontWeight: 500 }} onClick={() => { setAuthTab('register'); setAuthOpen(true); }}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-12 md:pt-24 pb-16 md:pb-32">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-rose-50 text-rose-600 rounded-full border border-rose-100 mb-6 md:mb-8">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>AI-Powered Human Connection</span>
          </div>

          <h1 className="text-gray-900 mb-4 md:mb-6" style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Find the Right Companion{' '}
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              for Your Moment.
            </span>
          </h1>

          <p className="text-gray-500 max-w-xl mx-auto px-2" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.7, fontWeight: 400 }}>
            Whether it's a round of golf, a coffee walk, or someone to share a quiet afternoon —
            I'll match you with the perfect companion.
          </p>
        </div>

        {/* Conversational AI Interaction Panel */}
        <div className={`bg-white rounded-3xl border shadow-xl shadow-rose-500/5 overflow-hidden transition-all ${isListening ? 'border-rose-300' : 'border-[#E8E4DF]'}`}>
          {/* Multi-line Input + Voice Button */}
          <div className="p-5 md:p-8">
            <div className="flex gap-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? 'Listening… say something like "a relaxed golf buddy this weekend"' : "Tell us what kind of moment you're looking for…"}
                rows={3}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                style={{ fontSize: '16px', lineHeight: 1.7, fontWeight: 400 }}
              />

              {/* Voice Input Button */}
              {voiceSupported && (
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-1">
                  <button
                    onClick={toggleVoice}
                    className={`relative w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                      isListening
                        ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-white mic-pulse'
                        : 'bg-[#F7F5F2] text-gray-500 hover:bg-rose-50 hover:text-rose-500 border border-[#E8E4DF]'
                    }`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-gray-400" style={{ fontSize: '10px', fontWeight: 400 }}>
                    {isListening ? 'Tap to stop' : 'Voice'}
                  </span>
                </div>
              )}
            </div>

            {/* Voice Listening Indicator */}
            {isListening && (
              <div className="mt-3 flex items-center gap-3">
                {/* Animated sound bars */}
                <div className="flex items-end gap-0.5 h-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="voice-bar w-1 bg-gradient-to-t from-rose-400 to-amber-400 rounded-full"
                      style={{ height: '16px', transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
                <span className="text-rose-500" style={{ fontSize: '13px', fontWeight: 500 }}>
                  {voiceHint || 'Listening… speak naturally'}
                </span>
              </div>
            )}

            {/* Voice Hint (error/status messages when not listening) */}
            {!isListening && voiceHint && (
              <div className="mt-2">
                <span className="text-amber-600" style={{ fontSize: '12px', fontWeight: 500 }}>
                  {voiceHint}
                </span>
              </div>
            )}
          </div>

          {/* Dynamic AI Understanding Card */}
          {hasIntent && (
            <div className="mx-5 md:mx-8 mb-4 md:mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-[#F7F5F2] rounded-2xl p-4 md:p-5 border border-[#E8E4DF]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 flex items-center gap-2" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {aiLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />}
                    {aiLoading ? 'Understanding...' : 'Looking for:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={addTag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      <Plus className="w-3 h-3" />
                      Add detail
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E4DF] rounded-xl text-gray-800"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      • {tag}
                      {isEditing && (
                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-rose-500 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {selectedMoods.map((mood) => (
                    <span
                      key={mood}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/50 rounded-xl text-rose-700"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      • {mood}
                      {isEditing && (
                        <button onClick={() => toggleMood(mood)} className="text-rose-400 hover:text-rose-600 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mood / Style Tags */}
          <div className="px-5 md:px-8 pb-4 md:pb-5">
            <div className="flex flex-wrap gap-2">
              {moodTags.map((tag) => {
                const isSelected = selectedMoods.includes(tag.label);
                return (
                  <button
                    key={tag.label}
                    onClick={() => toggleMood(tag.label)}
                    className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-300 text-rose-700'
                        : 'bg-white border-[#E8E4DF] text-gray-600 hover:border-rose-200 hover:bg-rose-50/30'
                    }`}
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    <span>{tag.emoji}</span>
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Response + CTA */}
          <div className="px-5 md:px-8 pb-5 md:pb-8">
            {(aiResponse || aiLoading) && (
              <div className="mb-4 md:mb-5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  {aiLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      <span className="text-gray-400" style={{ fontSize: '14px' }}>Finding your perfect match...</span>
                    </div>
                  ) : (
                    <p className="text-gray-600" style={{ fontSize: '14px', lineHeight: 1.6, fontWeight: 400 }}>
                      {aiResponse}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={() => navigate('/app', { state: { query, preferences: extractedPreferences, recommendations, moods: selectedMoods } })}
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl h-12 md:h-14 shadow-lg shadow-rose-500/10"
              style={{ fontSize: '16px', fontWeight: 500 }}
            >
              {aiLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              {recommendations.length > 0 ? `View ${recommendations.length} Matches` : 'Find My Match'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto mt-12 md:mt-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1.5 md:mb-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <div className="text-gray-900" style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 600 }}>100%</div>
            <div className="text-gray-500" style={{ fontSize: '12px', fontWeight: 400 }}>ID Verified</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1.5 md:mb-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
            </div>
            <div className="text-gray-900" style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 600 }}>4.9</div>
            <div className="text-gray-500" style={{ fontSize: '12px', fontWeight: 400 }}>Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1.5 md:mb-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />
            </div>
            <div className="text-gray-900" style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 600 }}>12K+</div>
            <div className="text-gray-500" style={{ fontSize: '12px', fontWeight: 400 }}>Connections</div>
          </div>
        </div>
      </main>

      {/* Featured Companions Preview */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-16 md:pb-32">
        <h2 className="text-center text-gray-900 mb-2 md:mb-3" style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 600 }}>
          Meet Some of Our Companions
        </h2>
        <p className="text-center text-gray-500 mb-8 md:mb-12" style={{ fontSize: '14px', fontWeight: 400 }}>
          Real people, verified identities, genuine connections
        </p>

        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {(featuredCompanions.length > 0 ? featuredCompanions.slice(0, 3) : companionPreviews).map((companion) => (
            <CompanionPreviewCard key={companion.name} companion={companion} />
          ))}
        </div>
        <div className="md:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {(featuredCompanions.length > 0 ? featuredCompanions.slice(0, 3) : companionPreviews).map((companion) => (
              <div key={companion.name} className="w-[280px] flex-shrink-0">
                <CompanionPreviewCard companion={companion} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F0EDE8] py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-gray-400" style={{ fontSize: '12px', fontWeight: 400 }}>
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>Kindora · Human connection, thoughtfully matched</span>
          </div>
          <span>© 2026</span>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </div>
  );
}

const companionPreviews = [
  {
    name: 'Megan T.',
    title: 'Weekend Golf Companion',
    desc: 'Relaxed pace, great conversation, loves morning tee times.',
    img: 'https://images.unsplash.com/photo-1718965018802-897e94ce7f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwc21pbGUlMjBvdXRkb29yfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    rebook: '94%',
    price: '$45',
  },
  {
    name: 'James R.',
    title: 'Coffee Walk Partner',
    desc: 'Easy-going listener, thoughtful, available weekday mornings.',
    img: 'https://images.unsplash.com/photo-1764816657425-b3c79b616d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsJTIwb3V0ZG9vciUyMHNtaWxlfGVufDF8fHx8MTc3MjQzMjUzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5.0,
    rebook: '97%',
    price: '$35',
  },
  {
    name: 'Lily C.',
    title: 'Kids Homework Mentor',
    desc: 'Patient, encouraging, specializes in math & reading.',
    img: 'https://images.unsplash.com/photo-1673623703556-eafc6dd91c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjB3YXJtJTIwZnJpZW5kbHklMjBuYXR1cmFsfGVufDF8fHx8MTc3MjQzMjUzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    rebook: '91%',
    price: '$40',
  },
];

function CompanionPreviewCard({ companion }: { companion: any }) {
  return (
    <Link to={companion.id ? `/app/providers/${companion.id}` : '/app'} className="group block">
      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-5 md:p-6 hover:shadow-xl hover:shadow-rose-500/5 hover:border-rose-200 transition-all text-center active:scale-[0.98]">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-4 md:mb-5 ring-4 ring-rose-50">
          <ImageWithFallback
            src={companion.img}
            alt={companion.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-gray-900 mb-1" style={{ fontSize: '17px', fontWeight: 600 }}>{companion.name}</h3>
        <p className="text-rose-500 mb-2 md:mb-3" style={{ fontSize: '13px', fontWeight: 500 }}>{companion.title}</p>
        <p className="text-gray-500 mb-4 md:mb-5" style={{ fontSize: '13px', lineHeight: 1.6, fontWeight: 400 }}>{companion.desc}</p>

        <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-5" style={{ fontSize: '13px' }}>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-gray-900" style={{ fontWeight: 600 }}>{companion.rating}</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500" style={{ fontWeight: 400 }}>{companion.rebook} rebook</span>
          <span className="text-gray-300">·</span>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span className="text-green-600" style={{ fontSize: '11px', fontWeight: 500 }}>Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
          <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>From {companion.price}<span className="text-gray-400" style={{ fontWeight: 400 }}>/session</span></span>
          <span className="text-rose-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500 }}>
            Book <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
