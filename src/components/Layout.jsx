import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../store/auth';

const links = [
  { path: '/', label: 'الرئيسية', icon: '📊' },
  { path: '/subjects', label: 'المواد', icon: '📚' },
  { path: '/exams', label: 'الامتحانات', icon: '📝' },
  { path: '/students', label: 'الطلاب', icon: '👥' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold">صواب</h1>
          <p className="text-white/60 text-sm mt-1">لوحة الإدارة</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                location.pathname === link.path
                  ? 'bg-white/20 font-bold'
                  : 'hover:bg-white/10'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <div className="mb-3 px-4">
            <p className="font-bold">{user?.name}</p>
            <p className="text-white/60 text-sm">@{user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 mr-64 p-8">
        {children}
      </div>
    </div>
  );
}