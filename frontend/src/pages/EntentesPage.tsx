import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { EntenteService, Parent, Enfant, StatutEntente, TypeContribution, STATUT_ENTENTE_LABELS } from '../types';
import { Plus, Send, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const STATUT_STYLE: Record<StatutEntente, string> = {
  BROUILLON: 'badge-gray', ENVOYEE_SIGNATURE: 'badge-yellow',
  SIGNEE: 'badge-green', EXPIREE: 'badge-red', ANNULEE: 'badge-red',
};

export default function EntentesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ parentId: '', enfantId: '', dateDebut: '', tarifJournalier: 10.35, typeContribution: 'REDUIT' as TypeContribution, joursPresence: '["lundi","mardi","mercredi","jeudi","vendredi"]', heureArrivee: '07:30', heureDepart: '17:00' });

  const { data: ententes = [] } = useQuery<EntenteService[]>({
    queryKey: ['ententes'],
    queryFn: () => api.get('/ententes').then((r) => r.data),
  });
  const { data: parents = [] } = useQuery<Parent[]>({
    queryKey: ['parents'],
    queryFn: () => api.get('/parents').then((r) => r.data),
  });
  const { data: enfants = [] } = useQuery<Enfant[]>({
    queryKey: ['enfants'],
    queryFn: () => api.get('/enfants').then((r) => r.data),
  });

  const creer = useMutation({
    mutationFn: (data: typeof form) => api.post('/ententes', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ententes'] }); toast.success('Entente créée'); setShowForm(false); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const envoyer = useMutation({
    mutationFn: (id: string) => api.post(`/ententes/${id}/envoyer-signature`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ententes'] }); toast.success('Demande de signature envoyée par email'); },
    onError: () => toast.error('Erreur lors de l\'envoi'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Ententes de services</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> Nouvelle entente</button>
      </div>

      <div className="space-y-4">
        {ententes.map((e) => (
          <div key={e.id} className="card flex items-center gap-4">
            <FileText size={20} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{e.enfant?.prenom} {e.enfant?.nom}</p>
              <p className="text-sm text-gray-500">{e.parent?.prenom} {e.parent?.nom} — {e.parent?.email}</p>
              <p className="text-sm text-gray-500">Début : {new Date(e.dateDebut).toLocaleDateString('fr-CA')} — {Number(e.tarifJournalier).toFixed(2)} $/j</p>
            </div>
            <span className={STATUT_STYLE[e.statut]}>{STATUT_ENTENTE_LABELS[e.statut]}</span>
            {e.statut === 'BROUILLON' && (
              <button onClick={() => envoyer.mutate(e.id)} disabled={envoyer.isPending} className="btn-primary text-sm py-1.5">
                <Send size={15} /> Envoyer pour signature
              </button>
            )}
          </div>
        ))}
        {ententes.length === 0 && <p className="text-center text-gray-400 py-8">Aucune entente</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="mb-4">Nouvelle entente de services</h2>
            <form onSubmit={(e) => { e.preventDefault(); creer.mutate(form); }} className="space-y-4">
              <div>
                <label className="label">Parent *</label>
                <select required className="input" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                  <option value="">Sélectionner...</option>
                  {parents.map((p) => <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Enfant *</label>
                <select required className="input" value={form.enfantId} onChange={(e) => setForm({ ...form, enfantId: e.target.value })}>
                  <option value="">Sélectionner...</option>
                  {enfants.map((en) => <option key={en.id} value={en.id}>{en.prenom} {en.nom}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date de début *</label>
                  <input required type="date" className="input" value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} />
                </div>
                <div>
                  <label className="label">Type contribution</label>
                  <select className="input" value={form.typeContribution} onChange={(e) => setForm({ ...form, typeContribution: e.target.value as TypeContribution })}>
                    <option value="REDUIT">Contribution réduite</option>
                    <option value="PLEIN">Taux plein</option>
                    <option value="EXONERE">Exonéré</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Tarif ($/jour)</label>
                  <input type="number" step="0.01" className="input" value={form.tarifJournalier} onChange={(e) => setForm({ ...form, tarifJournalier: parseFloat(e.target.value) })} />
                </div>
                <div><label className="label">Arrivée</label><input type="time" className="input" value={form.heureArrivee} onChange={(e) => setForm({ ...form, heureArrivee: e.target.value })} /></div>
                <div><label className="label">Départ</label><input type="time" className="input" value={form.heureDepart} onChange={(e) => setForm({ ...form, heureDepart: e.target.value })} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" disabled={creer.isPending} className="btn-primary flex-1">Créer l'entente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
