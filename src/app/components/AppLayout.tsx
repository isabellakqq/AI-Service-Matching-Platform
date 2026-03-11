import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Heart, Users, Brain, Settings as SettingsIcon, MessageCircle, LogOut } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useIsMobile } from './ui/use-mobile';
import { useAuth } from '../../lib/auth';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout, isAuthenticated } = useAuth();

  const navigation = [
    { name: 'Home', href: '/app', icon: LayoutDashboard, exact: true },
    { name: 'Connections', href: '/app/requests', icon: MessageCircle },
    { name: 'Companions', href: '/app/providers', icon: Users },
    { name: 'Insights', href: '/app/insights', icon: Brain },
    { name: 'Settings', href: '/app/settings', icon: SettingsIcon },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  // Mobile layout with bottom tab bar
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-[#FBF9F7]">
        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-[72px]">
          <Outlet />
        </main>

        {/* Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0EDE8] px-2 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
          <div className="flex items-center justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-0"
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-gradient-to-r from-rose-50 to-amber-50' : ''}`}>
                    <Icon className={`w-5 h-5 ${active ? 'text-rose-500' : 'text-gray-400'}`} />
                  </div>
                  <span
                    className={active ? 'text-rose-500' : 'text-gray-400'}
                    style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // Desktop layout with sidebar
  return (
    <div className="flex h-screen bg-[#FBF9F7]">
      {/* Left Sidebar */}
      <aside className="w-60 bg-white border-r border-[#F0EDE8] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#F0EDE8]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900" style={{ fontSize: '16px', fontWeight: 600 }}>Kindora</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-rose-50 to-amber-50 text-rose-600'
                    : 'text-gray-500 hover:bg-[#F7F5F2] hover:text-gray-900'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span style={{ fontSize: '14px', fontWeight: active ? 500 : 400 }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-[#F0EDE8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-rose-100 bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <ImageWithFallback
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-rose-700 text-sm font-semibold">{(user?.name || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 truncate" style={{ fontSize: '14px', fontWeight: 500 }}>{user?.name || 'Guest'}</div>
              <div className="text-gray-400 truncate" style={{ fontSize: '12px' }}>{user?.email || ''}</div>
            </div>
            {isAuthenticated && (
              <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-gray-600 p-1" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}