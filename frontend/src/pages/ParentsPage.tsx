import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Parent, TypeContribution } from '../types';
import { Plus, Search, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const CONTRIB_LABELS: Record<TypeContribution, string> = { REDUIT: 'Contribution réduite', PLEIN: 'Taux plein', EXONERE: 'Exonéré' };
const CONTRIB_STYLE: Record<TypeContribution, string> = { REDUIT: 'badge-green', PLEIN: 'badge-blue', EXONERE: 'badge-yellow' };

export default function ParentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', prenom: '', nom: '', telephone: '', adresse: '', ville: '', typeContribution: 'REDUIT' as TypeContribution });

  const { data: parents = [] } = useQuery<Parent[]>({
    queryKey: ['parents'],
    queryFn: () => api.get('/parents').then((r) => r.data),
  });

  const creer = useMutation({
    mutationFn: (data: typeof form) => api.post('/parents', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['parents'] }); toast.success('Parent ajouté'); setShowForm(false); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const filtered = parents.filter((p) =>
    `${p.prenom} ${p.nom} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Parents</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={18} /> Ajouter un parent</button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-10" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4">
        {filtered.map((parent) => (
          <div key={parent.id} className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-lg flex-shrink-0">
              {parent.prenom[0]}{parent.nom[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{parent.prenom} {parent.nom}</p>
                <span className={CONTRIB_STYLE[parent.typeContribution]}>{CONTRIB_LABELS[parent.typeContribution]}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail size={13} /> {parent.email}</span>
                {parent.telephone && <span className="flex items-center gap-1"><Phone size={13} /> {parent.telephone}</span>}
              </div>
              {(parent as any).enfants?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Enfant(s) : {(parent as any).enfants.map((ep: any) => `${ep.enfant.prenom} ${ep.enfant.nom}`).join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">Aucun parent trouvé</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="mb-4">Nouveau parent</h2>
            <form onSubmit={(e) => { e.preventDefault(); creer.mutate(form); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Prénom *</label><input required className="input" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
                <div><label className="label">Nom *</label><input required className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              </div>
              <div><label className="label">Email *</label><input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Téléphone</label><input className="input" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
                <div>
                  <label className="label">Type de contribution</label>
                  <select className="input" value={form.typeContribution} onChange={(e) => setForm({ ...form, typeContribution: e.target.value as TypeContribution })}>
                    <option value="REDUIT">Contribution réduite</option>
                    <option value="PLEIN">Taux plein</option>
                    <option value="EXONERE">Exonéré</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Adresse</label><input className="input" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div>
              <div><label className="label">Ville</label><input className="input" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" disabled={creer.isPending} className="btn-primary flex-1">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
