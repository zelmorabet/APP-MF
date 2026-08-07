import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Enfant, GroupeAge, GROUPE_AGE_LABELS } from '../types';
import { Plus, Search, Eye, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EnfantsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ prenom: '', nom: '', dateNaissance: '', groupeAge: 'BAMBIN' as GroupeAge, allergies: '', nomMedecin: '', telephoneMedecin: '' });

  const { data: enfants = [] } = useQuery<Enfant[]>({
    queryKey: ['enfants'],
    queryFn: () => api.get('/enfants').then((r) => r.data),
  });

  const creer = useMutation({
    mutationFn: (data: typeof form) => api.post('/enfants', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enfants'] }); toast.success('Enfant ajouté'); setShowForm(false); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const desactiver = useMutation({
    mutationFn: (id: string) => api.delete(`/enfants/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enfants'] }); toast.success('Enfant désactivé'); },
  });

  const filtered = enfants.filter((e) =>
    `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Enfants</h1>
          <p className="text-gray-500 mt-1">{enfants.length} / 9 places occupées</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={18} /> Ajouter un enfant
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-10" placeholder="Rechercher par nom..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Liste */}
      <div className="grid gap-4">
        {filtered.map((enfant) => (
          <div key={enfant.id} className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
              {enfant.prenom[0]}{enfant.nom[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{enfant.prenom} {enfant.nom}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(enfant.dateNaissance), 'd MMM yyyy', { locale: fr })} —{' '}
                <span className="badge-blue">{GROUPE_AGE_LABELS[enfant.groupeAge]}</span>
              </p>
              {enfant.allergies && <p className="text-xs text-red-600 mt-1">⚠ {enfant.allergies}</p>}
            </div>
            <div className="flex gap-2">
              <Link to={`/enfants/${enfant.id}`} className="btn-secondary text-sm py-1.5">
                <Eye size={15} /> Détails
              </Link>
              <button
                onClick={() => { if (confirm('Désactiver cet enfant ?')) desactiver.mutate(enfant.id); }}
                className="btn text-gray-500 hover:text-red-600 hover:bg-red-50 py-1.5 text-sm"
              >
                <UserMinus size={15} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">Aucun enfant trouvé</p>}
      </div>

      {/* Modal ajout */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="mb-4">Nouvel enfant</h2>
            <form onSubmit={(e) => { e.preventDefault(); creer.mutate(form); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Prénom *</label><input required className="input" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
                <div><label className="label">Nom *</label><input required className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Date de naissance *</label><input required type="date" className="input" value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} /></div>
                <div>
                  <label className="label">Groupe d'âge *</label>
                  <select className="input" value={form.groupeAge} onChange={(e) => setForm({ ...form, groupeAge: e.target.value as GroupeAge })}>
                    {Object.entries(GROUPE_AGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Allergies / Conditions médicales</label><textarea className="input" rows={2} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Médecin</label><input className="input" value={form.nomMedecin} onChange={(e) => setForm({ ...form, nomMedecin: e.target.value })} /></div>
                <div><label className="label">Tél. médecin</label><input className="input" value={form.telephoneMedecin} onChange={(e) => setForm({ ...form, telephoneMedecin: e.target.value })} /></div>
              </div>
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
