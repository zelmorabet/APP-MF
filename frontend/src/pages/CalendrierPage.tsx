import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CalendrierEvenement, TypeEvenement } from '../types';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TYPE_LABELS: Record<TypeEvenement, string> = {
  FERIE: 'Jour férié', FERMETURE: 'Fermeture', FORMATION: 'Formation',
  CONGE: 'Congé', AUTRE: 'Autre',
};
const TYPE_STYLE: Record<TypeEvenement, string> = {
  FERIE: 'badge-red', FERMETURE: 'badge-yellow', FORMATION: 'badge-blue', CONGE: 'badge-green', AUTRE: 'badge-gray',
};

export default function CalendrierPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: '', type: 'FERMETURE' as TypeEvenement, dateDebut: '', dateFin: '', touteJournee: true, description: '' });

  const { data: evenements = [] } = useQuery<CalendrierEvenement[]>({
    queryKey: ['calendrier'],
    queryFn: () => api.get('/calendrier').then((r) => r.data),
  });

  const creer = useMutation({
    mutationFn: (data: typeof form) => api.post('/calendrier', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['calendrier'] }); toast.success('Événement ajouté'); setShowForm(false); },
  });

  const supprimer = useMutation({
    mutationFn: (id: string) => api.delete(`/calendrier/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendrier'] }),
  });

  const importerFeries = useMutation({
    mutationFn: () => api.post('/calendrier/importer-feries'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['calendrier'] }); toast.success('Jours fériés 2025 importés'); },
  });

  const grouped = evenements.reduce((acc, e) => {
    const year = new Date(e.dateDebut).getFullYear();
    const month = new Date(e.dateDebut).getMonth();
    const key = `${year}-${month}`;
    if (!acc[key]) acc[key] = { label: format(new Date(e.dateDebut), 'MMMM yyyy', { locale: fr }), items: [] };
    acc[key].items.push(e);
    return acc;
  }, {} as Record<string, { label: string; items: CalendrierEvenement[] }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Calendrier</h1>
        <div className="flex gap-3">
          <button onClick={() => importerFeries.mutate()} className="btn-secondary">
            <CalendarDays size={16} /> Importer fériés QC 2025
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> Ajouter</button>
        </div>
      </div>

      {Object.entries(grouped).map(([key, { label, items }]) => (
        <div key={key} className="card">
          <h2 className="mb-4 capitalize">{label}</h2>
          <div className="space-y-2">
            {items.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 text-center flex-shrink-0">
                  <p className="text-lg font-bold text-gray-800">{format(new Date(e.dateDebut), 'd')}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{e.titre}</p>
                  {e.description && <p className="text-xs text-gray-500">{e.description}</p>}
                </div>
                <span className={TYPE_STYLE[e.type]}>{TYPE_LABELS[e.type]}</span>
                <button onClick={() => supprimer.mutate(e.id)} className="text-gray-400 hover:text-red-500 p-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {evenements.length === 0 && (
        <div className="card text-center py-8 text-gray-400">
          <p>Aucun événement. Importez les jours fériés du Québec ou ajoutez des fermetures.</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="mb-4">Nouvel événement</h2>
            <form onSubmit={(e) => { e.preventDefault(); creer.mutate(form); }} className="space-y-4">
              <div><label className="label">Titre *</label><input required className="input" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} /></div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TypeEvenement })}>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Date début *</label><input required type="date" className="input" value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} /></div>
                <div><label className="label">Date fin</label><input type="date" className="input" value={form.dateFin} onChange={(e) => setForm({ ...form, dateFin: e.target.value })} /></div>
              </div>
              <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" className="btn-primary flex-1">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
