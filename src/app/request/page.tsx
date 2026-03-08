import RequestForm from '@/components/RequestForm';

export default function RequestPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post a Service Request</h1>
        <p className="text-slate-500 mt-1">
          Describe your project and let our AI instantly find the best-matched providers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <RequestForm />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <strong>💡 Tip:</strong> The more detail you provide in your description, the more accurate your AI match results will be. Include technologies, goals, and any constraints.
      </div>
    </div>
  );
}
