import { MatchResult } from '@/lib/types';

interface MatchCardProps {
  match: MatchResult;
  rank: number;
}

function ScoreBadge({ score }: { score: number }) {
  let colorClass = 'bg-orange-100 text-orange-700 border-orange-200';
  if (score >= 80) colorClass = 'bg-green-100 text-green-700 border-green-200';
  else if (score >= 60) colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';

  return (
    <div className={`px-3 py-1.5 rounded-full border text-sm font-bold ${colorClass}`}>
      {score}% match
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  let barColor = 'bg-orange-400';
  if (score >= 80) barColor = 'bg-green-500';
  else if (score >= 60) barColor = 'bg-yellow-400';

  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${barColor}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

const availabilityLabels: Record<string, string> = {
  immediate: 'Available Now',
  'within-week': 'Within a Week',
  'within-month': 'Within a Month',
};

export default function MatchCard({ match, rank }: MatchCardProps) {
  const { provider, score, reasons, categoryMatch, budgetCompatible, availabilityMatch, keywordScore } = match;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {provider.name.charAt(0)}
            </div>
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#0F172A] border-2 border-white flex items-center justify-center text-white text-xs font-bold">
              {rank}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{provider.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">{provider.category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                <span className="text-yellow-400">★</span> {provider.rating} ({provider.completedProjects} jobs)
              </span>
            </div>
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>

      <div className="mt-4">
        <ScoreBar score={score} />
      </div>

      <p className="mt-3 text-sm text-slate-600 line-clamp-2">{provider.description}</p>

      {/* Match indicators */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryMatch ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>
          {categoryMatch ? '✓' : '○'} Category
        </span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${budgetCompatible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {budgetCompatible ? '✓' : '✗'} Budget
        </span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${availabilityMatch ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
          {availabilityMatch ? '✓' : '○'} Timeline
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {keywordScore}% keyword match
        </span>
      </div>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.skills.slice(0, 5).map((skill) => (
          <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            {skill}
          </span>
        ))}
        {provider.skills.length > 5 && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
            +{provider.skills.length - 5} more
          </span>
        )}
      </div>

      {/* Match reasons */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Why this match</p>
        <ul className="space-y-1">
          {reasons.slice(0, 4).map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-base font-bold text-slate-900">
          ${provider.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span>
        </div>
        <span className="text-xs text-slate-500">
          {availabilityLabels[provider.availability] ?? provider.availability}
        </span>
      </div>
    </div>
  );
}
