import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0F172A] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/50 border border-blue-700 rounded-full text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered Matching Engine
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Find the <span className="text-blue-400">Perfect Match</span>
            <br />for Every Service Need
          </h1>
          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our AI engine analyzes your requirements and instantly ranks the most compatible
            service providers using keyword similarity, skill scoring, and budget analysis.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-colors w-full sm:w-auto text-center shadow-lg shadow-blue-900/50"
            >
              Post a Request →
            </Link>
            <Link
              href="/providers"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg transition-colors w-full sm:w-auto text-center border border-slate-600"
            >
              Browse Providers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1E293B] border-y border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '10+', label: 'Expert Providers' },
            { value: '8', label: 'Service Categories' },
            { value: 'AI', label: 'Matching Engine' },
            { value: '100%', label: 'Free to Post' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-blue-400">{value}</div>
              <div className="text-sm text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Describe Your Need',
              body: 'Post a request with your project description, budget, timeline, and required skills. The more detail, the better.',
              icon: '✍️',
            },
            {
              step: '02',
              title: 'AI Analyzes & Ranks',
              body: 'Our TF-IDF matching engine scores every provider on keyword overlap, skill coverage, category fit, budget, and availability.',
              icon: '🤖',
            },
            {
              step: '03',
              title: 'Connect with the Best',
              body: 'Review ranked matches with confidence scores and explanations. Choose the provider who fits best and get started.',
              icon: '🤝',
            },
          ].map(({ step, title, body, icon }) => (
            <div
              key={step}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <div className="text-xs font-bold text-blue-500 tracking-widest mb-2">STEP {step}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-t border-slate-200 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Browse by Category</h2>
          <p className="text-center text-slate-500 mb-10">Find specialized experts across 8 service categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Web Development', icon: '💻' },
              { name: 'Data Science', icon: '📊' },
              { name: 'Design', icon: '🎨' },
              { name: 'Marketing', icon: '📣' },
              { name: 'Mobile Development', icon: '📱' },
              { name: 'DevOps', icon: '⚙️' },
              { name: 'Content Writing', icon: '✒️' },
              { name: 'Cybersecurity', icon: '🔒' },
            ].map(({ name, icon }) => (
              <Link
                key={name}
                href={`/providers?category=${encodeURIComponent(name)}`}
                className="flex flex-col items-center gap-3 p-5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors text-center group"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1E40AF] to-[#1D4ED8] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect match?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Post a service request and let our AI rank the best providers for you in seconds.
          </p>
          <Link
            href="/request"
            className="inline-block px-8 py-4 bg-white hover:bg-blue-50 text-blue-700 rounded-xl font-bold text-lg transition-colors shadow-lg"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
