import { useState, useEffect } from 'react';
import { User, Bell, Lock, Heart, Loader2, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { useAuth } from '../../lib/auth';
import api from '../../lib/api';

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState('Relaxed & Low-key');
  const [preferredTime, setPreferredTime] = useState('Weekend Mornings');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    api.getProfile()
      .then((data) => {
        const u = data.user || data;
        const names = (u.name || '').split(' ');
        setFirstName(names[0] || '');
        setLastName(names.slice(1).join(' ') || '');
        setEmail(u.email || '');
        setLocation(u.location || '');
        if (u.preferences) {
          setSelectedActivities(u.preferences.preferredActivities || []);
          setEnergyLevel(u.preferences.personality?.[0] || 'Relaxed & Low-key');
          setPreferredTime(u.preferences.preferredTimes?.[0] || 'Weekend Mornings');
        }
      })
      .catch(() => {
        if (user) {
          const names = (user.name || '').split(' ');
          setFirstName(names[0] || '');
          setLastName(names.slice(1).join(' ') || '');
          setEmail(user.email || '');
        }
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.updateProfile({ name: `${firstName} ${lastName}`.trim() });
      await api.updatePreferences({
        preferredActivities: selectedActivities,
        personality: [energyLevel],
        preferredTimes: [preferredTime],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-[#F0EDE8]">
        <h1 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>Settings</h1>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: '13px' }}>Manage your account and preferences</p>
      </header>

      <div className="p-4 md:p-8 md:max-w-3xl">
        <div className="space-y-4 md:space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />
              </div>
              <div>
                <h2 className="text-gray-900" style={{ fontSize: '15px', fontWeight: 600 }}>Profile</h2>
                <p className="text-gray-400" style={{ fontSize: '12px' }}>Your personal information</p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>First Name</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-[#F7F5F2] border-[#E8E4DF] rounded-xl h-10" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>Last Name</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-[#F7F5F2] border-[#E8E4DF] rounded-xl h-10" />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#F7F5F2] border-[#E8E4DF] rounded-xl h-10" disabled />
              </div>
              <div>
                <label className="block text-gray-600 mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="bg-[#F7F5F2] border-[#E8E4DF] rounded-xl h-10" />
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl w-full md:w-auto">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <Check className="w-4 h-4 mr-2" /> : null}
                {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Connection Preferences */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-gray-900" style={{ fontSize: '15px', fontWeight: 600 }}>Connection Preferences</h2>
                <p className="text-gray-400" style={{ fontSize: '12px' }}>Help us find better matches</p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-600 mb-2" style={{ fontSize: '12px', fontWeight: 500 }}>Preferred Activities</label>
                <div className="flex flex-wrap gap-2">
                  {['Golf', 'Coffee Walks', 'Dog Park', 'Travel', 'Tutoring', 'Conversation'].map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all cursor-pointer active:scale-95 ${selectedActivities.includes(activity) ? 'bg-rose-50 border border-rose-300 text-rose-600 font-medium' : 'bg-[#F7F5F2] border border-[#E8E4DF] text-gray-700 hover:border-rose-300 hover:bg-rose-50'}`}
                      style={{ fontSize: '13px' }}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>Energy Level</label>
                <select value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} className="w-full px-3 md:px-4 py-2.5 bg-[#F7F5F2] border border-[#E8E4DF] rounded-xl text-gray-900 outline-none" style={{ fontSize: '14px' }}>
                  <option>Relaxed & Low-key</option>
                  <option>Moderate & Balanced</option>
                  <option>Active & Energetic</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>Preferred Times</label>
                <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="w-full px-3 md:px-4 py-2.5 bg-[#F7F5F2] border border-[#E8E4DF] rounded-xl text-gray-900 outline-none" style={{ fontSize: '14px' }}>
                  <option>Weekend Mornings</option>
                  <option>Weekday Mornings</option>
                  <option>Afternoons</option>
                  <option>Evenings</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-gray-900" style={{ fontSize: '15px', fontWeight: 600 }}>Notifications</h2>
                <p className="text-gray-400" style={{ fontSize: '12px' }}>How you hear from us</p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { title: 'New Match Suggestions', desc: 'When AI finds a great match', on: true },
                { title: 'Session Reminders', desc: 'Before upcoming sessions', on: true },
                { title: 'Companion Messages', desc: 'Direct messages', on: true },
                { title: 'Weekly Insights', desc: 'AI connection patterns', on: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-[#F0EDE8] last:border-0">
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="text-gray-900 truncate" style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</div>
                    <div className="text-gray-400 truncate" style={{ fontSize: '12px' }}>{item.desc}</div>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E8E4DF] p-4 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Lock className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-gray-900" style={{ fontSize: '15px', fontWeight: 600 }}>Privacy & Safety</h2>
                <p className="text-gray-400" style={{ fontSize: '12px' }}>Your security matters</p>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              {['Change Password', 'Two-Factor Authentication', 'Block & Report', 'Download My Data'].map((action) => (
                <Button key={action} variant="outline" className="w-full justify-start rounded-xl border-[#E8E4DF] text-gray-600 hover:border-rose-200 h-10 md:h-auto" style={{ fontSize: '14px' }}>
                  {action}
                </Button>
              ))}
              <Button variant="outline" className="w-full justify-start rounded-xl border-[#E8E4DF] text-red-500 hover:text-red-600 hover:border-red-200 h-10 md:h-auto" style={{ fontSize: '14px' }}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
