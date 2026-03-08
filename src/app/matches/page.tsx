'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MatchCard from '@/components/MatchCard';
import { MatchResult, ServiceRequest } from '@/lib/types';

function MatchesContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>(requestId ?? '');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/requests')
      .then((r) => r.json())
      .then((data) => {
        setRequests(data);
        setLoadingRequests(false);
      })
      .catch(() => setLoadingRequests(false));
  }, []);

  const runMatching = useCallback(async (rid: string) => {
    if (!rid) return;
    setLoading(true);
    setError('');
    setMatches([]);
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: rid }),
      });
      if (!res.ok) throw new Error('Failed to run matching');
      const data = await res.json();
      setMatches(data);
    } catch {
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-run when requestId is provided via URL
  useEffect(() => {
    if (requestId) {
      setSelectedRequestId(requestId);
      runMatching(requestId);
    }
  }, [requestId, runMatching]);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">AI Match Results</h1>
        <p className="text-slate-500 mt-1">
          Select a service request to see AI-ranked provider matches
        </p>
      </div>

      {/* Request selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Select a Service Request</h2>
        {loadingRequests ? (
          <div className="text-slate-400 text-sm">Loading requests…</div>
        ) : requests.length === 0 ? (
          <div className="text-slate-500 text-sm">
            No requests yet.{' '}
            <Link href="/request" className="text-blue-600 underline">Post one now</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {requests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedRequestId === req.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{req.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {req.clientName} · {req.category} · ${req.budget.toLocaleString()} budget
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full flex-shrink-0">
                    {req.timeline.replace(/-/g, ' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedRequestId && (
          <button
            onClick={() => runMatching(selectedRequestId)}
            disabled={loading}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {loading ? 'Running AI Matching…' : '🤖 Run AI Matching'}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm mb-6">{error}</div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Analyzing providers with AI matching engine…</p>
        </div>
      )}

      {/* Results */}
      {!loading && matches.length > 0 && selectedRequest && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {matches.length} providers matched
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">for: {selectedRequest.title}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500" /> ≥80% great match
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-400" /> 60–79% good match
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-400" /> &lt;60% partial match
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match, i) => (
              <MatchCard key={match.provider.id} match={match} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state after run */}
      {!loading && matches.length === 0 && selectedRequestId && !error && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium">Click &quot;Run AI Matching&quot; above to see results</p>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <MatchesContent />
    </Suspense>
  );
}
