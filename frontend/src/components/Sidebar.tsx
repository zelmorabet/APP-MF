import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Baby, Users, CalendarCheck, ClipboardList,
  FileText, CreditCard, BarChart3, Calendar, FolderOpen, UserCircle, LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { clsx } from 'clsx';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/enfants', icon: Baby, label: 'Enfants' },
  { to: '/parents', icon: Users, label: 'Parents' },
  { to: '/presences', icon: CalendarCheck, label: 'Présences' },
  { to: '/assiduites', icon: ClipboardList, label: "Feuilles d'assiduité" },
  { to: '/ententes', icon: FileText, label: 'Ententes de services' },
  { to: '/facturation', icon: CreditCard, label: 'Facturation' },
  { to: '/rapports', icon: BarChart3, label: 'Rapports BC' },
  { to: '/calendrier', icon: Calendar, label: 'Calendrier' },
  { to: '/documents', icon: FolderOpen, label: 'Documents' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Baby size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Milieu Familial</p>
            <p className="text-xs text-gray-500">RSG Québec</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profil & logout */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100')
          }
        >
          <UserCircle size={18} />
          {user?.prenom} {user?.nom}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
