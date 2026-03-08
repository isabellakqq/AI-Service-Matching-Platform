import { ServiceProvider } from '@/lib/types';

interface ProviderCardProps {
  provider: ServiceProvider;
}

const availabilityLabels: Record<string, { label: string; color: string }> = {
  immediate: { label: 'Available Now', color: 'bg-green-100 text-green-700' },
  'within-week': { label: 'Within a Week', color: 'bg-yellow-100 text-yellow-700' },
  'within-month': { label: 'Within a Month', color: 'bg-orange-100 text-orange-700' },
};

export default function ProviderCard({ provider }: ProviderCardProps) {
  const avail = availabilityLabels[provider.availability] ?? {
    label: provider.availability,
    color: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {provider.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{provider.name}</h3>
            <span className="text-xs text-slate-500">{provider.category}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-slate-900">${provider.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span></div>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm font-medium text-slate-700">{provider.rating}</span>
            <span className="text-xs text-slate-400">({provider.completedProjects} jobs)</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600 line-clamp-2">{provider.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {provider.skills.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
        {provider.skills.length > 5 && (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
            +{provider.skills.length - 5} more
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${avail.color}`}>
          {avail.label}
        </span>
        <span className="text-xs text-slate-400">
          Joined {new Date(provider.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
