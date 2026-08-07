import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Dashboard } from '../types';
import { Baby, Users, FileText, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { data } = useQuery<Dashboard>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/rsge/dashboard').then((r) => r.data),
  });

  const stats = [
    { label: 'Enfants actifs', value: data?.nbEnfants ?? '-', icon: Baby, color: 'bg-blue-500', max: 9 },
    { label: 'Parents inscrits', value: data?.nbParents ?? '-', icon: Users, color: 'bg-violet-500' },
    { label: 'Ententes en attente', value: data?.nbEntentesPending ?? '-', icon: FileText, color: 'bg-amber-500' },
    { label: "Présences aujourd'hui", value: data?.nbPresencesAuj ?? '-', icon: CalendarCheck, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Tableau de bord</h1>
        <p className="text-gray-500 mt-1">{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {s.value}
                {s.max && <span className="text-sm font-normal text-gray-400"> / {s.max}</span>}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="mb-4">Accès rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Saisie présences', href: '/presences', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { label: 'Nouvelles ententes', href: '/ententes', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
              { label: "Générer feuille", href: '/assiduites', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              { label: 'Rapports BC', href: '/rapports', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
            ].map((item) => (
              <a key={item.href} href={item.href}
                className={`${item.color} rounded-lg p-4 text-sm font-medium transition-colors text-center`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4">Informations</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Capacité maximale : <strong>9 enfants</strong></p>
            <p>• Taux contribution réduite 2025 : <strong>10,35 $/jour</strong></p>
            <p>• N'oubliez pas de soumettre votre feuille d'assiduité au Bureau Coordinateur avant la fin du mois.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
