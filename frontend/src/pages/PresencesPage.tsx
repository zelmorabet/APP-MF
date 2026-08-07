import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Enfant, StatutPresence, STATUT_PRESENCE_LABELS } from '../types';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { clsx } from 'clsx';

const COULEURS: Record<StatutPresence, string> = {
  PRESENT: 'bg-green-100 text-green-800 border-green-300',
  ABSENT: 'bg-red-100 text-red-800 border-red-300',
  ABSENT_JUSTIFIE: 'bg-orange-100 text-orange-800 border-orange-300',
  CONGE_FERIE: 'bg-blue-100 text-blue-800 border-blue-300',
  FERMETURE: 'bg-gray-100 text-gray-800 border-gray-300',
};

type PresenceLocal = { statut: StatutPresence; heureArrivee: string; heureDepart: string };

export default function PresencesPage() {
  const qc = useQueryClient();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [presences, setPresences] = useState<Record<string, PresenceLocal>>({});

  const { data: enfants = [] } = useQuery<any[]>({
    queryKey: ['presences-date', date],
    queryFn: () => api.get(`/presences/date/${date}`).then((r) => r.data),
    onSuccess: (data: any[]) => {
      const map: Record<string, PresenceLocal> = {};
      data.forEach((e: any) => {
        const p = e.presences?.[0];
        map[e.id] = { statut: p?.statut || 'ABSENT', heureArrivee: p?.heureArrivee || '07:30', heureDepart: p?.heureDepart || '17:00' };
      });
      setPresences(map);
    },
  } as any);

  const sauvegarder = useMutation({
    mutationFn: () => api.post('/presences/bulk', {
      date,
      presences: Object.entries(presences).map(([enfantId, p]) => ({ enfantId, ...p })),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['presences-date'] }); toast.success('Présences sauvegardées'); },
    onError: () => toast.error('Erreur lors de la sauvegarde'),
  });

  const setStatut = (enfantId: string, statut: StatutPresence) => {
    setPresences((prev) => ({ ...prev, [enfantId]: { ...prev[enfantId], statut } }));
  };

  const nbPresents = Object.values(presences).filter((p) => p.statut === 'PRESENT').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Saisie des présences</h1>
          <p className="text-gray-500 mt-1">{nbPresents} enfant(s) présent(s)</p>
        </div>
        <button onClick={() => sauvegarder.mutate()} disabled={sauvegarder.isPending} className="btn-primary">
          <Save size={18} /> Sauvegarder
        </button>
      </div>

      {/* Navigation date */}
      <div className="flex items-center gap-3">
        <button onClick={() => setDate(format(subDays(new Date(date), 1), 'yyyy-MM-dd'))} className="btn-secondary p-2"><ChevronLeft size={18} /></button>
        <input type="date" className="input w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => setDate(format(addDays(new Date(date), 1), 'yyyy-MM-dd'))} className="btn-secondary p-2"><ChevronRight size={18} /></button>
        <span className="text-gray-600 font-medium">{format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}</span>
      </div>

      {/* Grille présences */}
      <div className="space-y-3">
        {enfants.map((enfant: any) => {
          const p = presences[enfant.id] || { statut: 'ABSENT', heureArrivee: '07:30', heureDepart: '17:00' };
          return (
            <div key={enfant.id} className="card flex flex-wrap items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                {enfant.prenom[0]}{enfant.nom[0]}
              </div>
              <div className="w-32">
                <p className="font-medium text-sm">{enfant.prenom} {enfant.nom}</p>
              </div>

              {/* Boutons statut */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUT_PRESENCE_LABELS) as StatutPresence[]).map((s) => (
                  <button key={s} onClick={() => setStatut(enfant.id, s)}
                    className={clsx('px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                      p.statut === s ? COULEURS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    )}>
                    {STATUT_PRESENCE_LABELS[s]}
                  </button>
                ))}
              </div>

              {/* Heures (seulement si présent) */}
              {p.statut === 'PRESENT' && (
                <div className="flex items-center gap-3 ml-auto">
                  <label className="text-xs text-gray-500">Arrivée</label>
                  <input type="time" className="input py-1.5 text-sm w-28"
                    value={p.heureArrivee}
                    onChange={(e) => setPresences((prev) => ({ ...prev, [enfant.id]: { ...prev[enfant.id], heureArrivee: e.target.value } }))} />
                  <label className="text-xs text-gray-500">Départ</label>
                  <input type="time" className="input py-1.5 text-sm w-28"
                    value={p.heureDepart}
                    onChange={(e) => setPresences((prev) => ({ ...prev, [enfant.id]: { ...prev[enfant.id], heureDepart: e.target.value } }))} />
                </div>
              )}
            </div>
          );
        })}
        {enfants.length === 0 && <p className="text-center text-gray-400 py-8">Aucun enfant actif</p>}
      </div>
    </div>
  );
}
