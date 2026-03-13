import { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  companion: {
    id: string;
    name: string;
    price: string;
    activities: string[];
  };
  onBook: (data: {
    companionId: string;
    activity: string;
    location?: string;
    scheduledAt: string;
    duration: number;
    notes?: string;
  }) => Promise<void>;
}

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM',
];

const DURATIONS = [
  { label: '1 hour', value: 1 },
  { label: '1.5 hours', value: 1.5 },
  { label: '2 hours', value: 2 },
  { label: '3 hours', value: 3 },
];

function generateNextDays(count: number) {
  const days: Date[] = [];
  for (let i = 1; i <= count; i++) {
    days.push(addDays(new Date(), i));
  }
  return days;
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

export default function BookingModal({ open, onClose, companion, onBook }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [activity, setActivity] = useState(companion.activities[0] || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableDays = generateNextDays(7);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !activity) {
      setError('Please select a date, time, and activity');
      return;
    }

    if (step === 'form') {
      setStep('confirm');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { hours, minutes } = parseTime(selectedTime);
      const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

      await onBook({
        companionId: companion.id,
        activity,
        location: location || undefined,
        scheduledAt: scheduledAt.toISOString(),
        duration,
        notes: notes || undefined,
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hourlyRate = parseInt(companion.price.replace('$', '')) || 40;
  const totalPrice = hourlyRate * duration;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-[#F0EDE8] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 600 }}>
            {step === 'success' ? 'Booking Confirmed!' : step === 'confirm' ? 'Confirm Booking' : `Book with ${companion.name}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Success State */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-gray-900 mb-2" style={{ fontSize: '20px', fontWeight: 600 }}>
                You're all set!
              </h3>
              <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>
                Your session with {companion.name} is booked.
              </p>
              <p className="text-gray-400 mb-6" style={{ fontSize: '13px' }}>
                {selectedDate && format(selectedDate, 'EEEE, MMMM d')} at {selectedTime} · {duration}h · {activity}
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl px-8 h-11"
              >
                Done
              </Button>
            </div>
          )}

          {/* Confirmation State */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-[#F7F5F2] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="text-gray-400 block" style={{ fontSize: '11px' }}>Date & Time</span>
                    <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                      {selectedDate && format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="text-gray-400 block" style={{ fontSize: '11px' }}>Duration</span>
                    <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="text-gray-400 block" style={{ fontSize: '11px' }}>Activity</span>
                    <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>{activity}</span>
                  </div>
                </div>
                {location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-gray-400 block" style={{ fontSize: '11px' }}>Location</span>
                      <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>{location}</span>
                    </div>
                  </div>
                )}
                {notes && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-gray-400 block" style={{ fontSize: '11px' }}>Notes</span>
                      <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>{notes}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0EDE8]">
                <span className="text-gray-500" style={{ fontSize: '14px' }}>Total</span>
                <span className="text-gray-900" style={{ fontSize: '22px', fontWeight: 600 }}>${totalPrice}</span>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2 border border-red-100">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { setStep('form'); setError(''); }}
                  className="flex-1 rounded-xl border-[#E8E4DF] h-11"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl h-11"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Confirm · $${totalPrice}`}
                </Button>
              </div>
            </div>
          )}

          {/* Form State */}
          {step === 'form' && (
            <div className="space-y-5">
              {/* Activity Selection */}
              <div>
                <label className="text-gray-600 mb-2 block" style={{ fontSize: '13px', fontWeight: 500 }}>Activity</label>
                <div className="flex flex-wrap gap-2">
                  {companion.activities.map((act) => (
                    <button
                      key={act}
                      onClick={() => setActivity(act)}
                      className={`px-3.5 py-2 rounded-xl text-sm border transition-all ${
                        activity === act
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                          : 'bg-[#F7F5F2] border-[#E8E4DF] text-gray-600 hover:border-rose-200'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-gray-600 mb-2 block" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableDays.map((day) => (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border transition-all ${
                        selectedDate?.toDateString() === day.toDateString()
                          ? 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'bg-[#F7F5F2] border-[#E8E4DF] text-gray-600 hover:border-rose-200'
                      }`}
                    >
                      <span style={{ fontSize: '11px' }}>{format(day, 'EEE')}</span>
                      <span style={{ fontSize: '16px', fontWeight: 600 }}>{format(day, 'd')}</span>
                      <span style={{ fontSize: '10px' }}>{format(day, 'MMM')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-gray-600 mb-2 block" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-2 py-2 rounded-xl border text-center transition-all ${
                        selectedTime === time
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                          : 'bg-[#F7F5F2] border-[#E8E4DF] text-gray-600 hover:border-rose-200'
                      }`}
                      style={{ fontSize: '12px' }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-gray-600 mb-2 block" style={{ fontSize: '13px', fontWeight: 500 }}>Duration</label>
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-center transition-all ${
                        duration === d.value
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                          : 'bg-[#F7F5F2] border-[#E8E4DF] text-gray-600 hover:border-rose-200'
                      }`}
                      style={{ fontSize: '13px' }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location (optional) */}
              <div>
                <label className="text-gray-600 mb-2 block" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Location <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Central Park, coffee shop nearby..."
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-[#E8E4DF] rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-rose-300 transition-colors"
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Notes (optional) */}
              <div>
                <label className="text-gray-600 mb-2 block" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <FileText className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything you'd like your companion to know..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-[#E8E4DF] rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-rose-300 transition-colors resize-none"
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Price summary + Submit */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE8]">
                <div>
                  <span className="text-gray-400 block" style={{ fontSize: '11px' }}>Estimated total</span>
                  <span className="text-gray-900" style={{ fontSize: '20px', fontWeight: 600 }}>${totalPrice}</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedDate || !selectedTime || !activity}
                  className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 text-white rounded-xl px-6 h-11"
                >
                  Review Booking
                </Button>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2 border border-red-100">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
