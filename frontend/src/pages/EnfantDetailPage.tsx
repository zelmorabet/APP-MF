import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Enfant, Parent, ContactUrgence, RelationParent, GROUPE_AGE_LABELS, RELATION_PARENT_LABELS } from '../types';
import { ArrowLeft, Plus, Trash2, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EnfantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ prenom: '', nom: '', relation: '', telephone1: '', telephone2: '', priorite: 1, autoriseDepart: false });
  const [showLierForm, setShowLierForm] = useState(false);
  const [lierForm, setLierForm] = useState({ parentId: '', relation: 'MERE' as RelationParent, estCustodial: true });

  const { data: enfant } = useQuery<Enfant>({
    queryKey: ['enfant', id],
    queryFn: () => api.get(`/enfants/${id}`).then((r) => r.data),
  });

  const { data: parents = [] } = useQuery<Parent[]>({
    queryKey: ['parents'],
    queryFn: () => api.get('/parents').then((r) => r.data),
  });

  const lierParent = useMutation({
    mutationFn: (data: typeof lierForm) => api.post(`/enfants/${id}/parents`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enfant', id] }); toast.success('Parent lié'); setShowLierForm(false); setLierForm({ parentId: '', relation: 'MERE', estCustodial: true }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const ajouterContact = useMutation({
    mutationFn: (data: any) => api.post('/contacts-urgence', { ...data, enfantId: id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enfant', id] }); toast.success('Contact ajouté'); setShowContactForm(false); },
  });

  const supprimerContact = useMutation({
    mutationFn: (contactId: string) => api.delete(`/contacts-urgence/${contactId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enfant', id] }),
  });

  if (!enfant) return <div className="text-center py-20 text-gray-400">Chargement...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/enfants')} className="btn-secondary py-2 px-3">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1>{enfant.prenom} {enfant.nom}</h1>
          <p className="text-gray-500 text-sm">{GROUPE_AGE_LABELS[enfant.groupeAge]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="card">
          <h2 className="mb-4">Informations générales</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Date de naissance</dt><dd>{format(new Date(enfant.dateNaissance), 'd MMMM yyyy', { locale: fr })}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Groupe d'âge</dt><dd>{GROUPE_AGE_LABELS[enfant.groupeAge]}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Date d'inscription</dt><dd>{format(new Date(enfant.dateInscription), 'd MMM yyyy', { locale: fr })}</dd></div>
            {enfant.nomMedecin && <div className="flex justify-between"><dt className="text-gray-500">Médecin</dt><dd>{enfant.nomMedecin}</dd></div>}
            {enfant.telephoneMedecin && <div className="flex justify-between"><dt className="text-gray-500">Tél. médecin</dt><dd>{enfant.telephoneMedecin}</dd></div>}
          </dl>
        </div>

        {/* Santé */}
        <div className="card">
          <h2 className="mb-4">Santé</h2>
          {enfant.allergies ? <div className="mb-3"><p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Allergies</p><p className="text-sm bg-red-50 text-red-800 p-3 rounded-lg">{enfant.allergies}</p></div> : <p className="text-sm text-gray-400">Aucune allergie connue</p>}
          {enfant.medicaments && <div className="mt-3"><p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Médicaments</p><p className="text-sm bg-orange-50 text-orange-800 p-3 rounded-lg">{enfant.medicaments}</p></div>}
          {enfant.conditionsMedicales && <div className="mt-3"><p className="text-xs font-medium text-yellow-600 uppercase tracking-wide mb-1">Conditions médicales</p><p className="text-sm bg-yellow-50 text-yellow-800 p-3 rounded-lg">{enfant.conditionsMedicales}</p></div>}
        </div>

        {/* Parents */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2>Parents / Tuteurs</h2>
            {(enfant.parents?.length ?? 0) < 2 && (
              <button onClick={() => setShowLierForm(true)} className="btn-secondary text-sm py-1.5">
                <Link2 size={15} /> Lier
              </button>
            )}
          </div>
          {enfant.parents?.length === 0 ? <p className="text-sm text-gray-400">Aucun parent lié</p> : (
            <div className="space-y-3">
              {enfant.parents?.map((ep) => (
                <div key={ep.parentId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm">
                    {ep.parent?.prenom[0]}{ep.parent?.nom[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{ep.parent?.prenom} {ep.parent?.nom}</p>
                    <p className="text-xs text-gray-500">{RELATION_PARENT_LABELS[ep.relation]}{ep.estCustodial ? ' • Gardien légal' : ''}</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">{ep.parent?.telephone}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contacts d'urgence */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2>Contacts d'urgence</h2>
            <button onClick={() => setShowContactForm(true)} className="btn-secondary text-sm py-1.5">
              <Plus size={15} /> Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {enfant.contactsUrgence?.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{c.priorite}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.prenom} {c.nom} <span className="text-gray-500 text-xs">— {c.relation}</span></p>
                  <p className="text-xs text-gray-500">{c.telephone1}{c.telephone2 ? ` / ${c.telephone2}` : ''}</p>
                  {c.autoriseDepart && <span className="badge-green text-xs mt-1">Autorisé départ</span>}
                </div>
                <button onClick={() => supprimerContact.mutate(c.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal lier parent */}
      {showLierForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="mb-4">Lier un parent</h2>
            <form onSubmit={(e) => { e.preventDefault(); lierParent.mutate(lierForm); }} className="space-y-4">
              <div>
                <label className="label">Parent *</label>
                <select required className="input" value={lierForm.parentId} onChange={(e) => setLierForm({ ...lierForm, parentId: e.target.value })}>
                  <option value="">Sélectionner un parent...</option>
                  {parents
                    .filter((p) => !enfant.parents?.some((ep) => ep.parentId === p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="label">Relation *</label>
                <select required className="input" value={lierForm.relation} onChange={(e) => setLierForm({ ...lierForm, relation: e.target.value as RelationParent })}>
                  {(Object.keys(RELATION_PARENT_LABELS) as RelationParent[]).map((r) => (
                    <option key={r} value={r}>{RELATION_PARENT_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={lierForm.estCustodial} onChange={(e) => setLierForm({ ...lierForm, estCustodial: e.target.checked })} />
                Gardien légal (gardien officiel de l'enfant)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowLierForm(false)} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" disabled={lierParent.isPending} className="btn-primary flex-1">Lier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal contact urgence */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="mb-4">Nouveau contact d'urgence</h2>
            <form onSubmit={(e) => { e.preventDefault(); ajouterContact.mutate(contactForm); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Prénom *</label><input required className="input" value={contactForm.prenom} onChange={(e) => setContactForm({ ...contactForm, prenom: e.target.value })} /></div>
                <div><label className="label">Nom *</label><input required className="input" value={contactForm.nom} onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Relation *</label><input required className="input" placeholder="mère, père, grand-mère..." value={contactForm.relation} onChange={(e) => setContactForm({ ...contactForm, relation: e.target.value })} /></div>
                <div><label className="label">Priorité *</label><input required type="number" min={1} max={5} className="input" value={contactForm.priorite} onChange={(e) => setContactForm({ ...contactForm, priorite: parseInt(e.target.value) })} /></div>
              </div>
              <div><label className="label">Téléphone 1 *</label><input required className="input" value={contactForm.telephone1} onChange={(e) => setContactForm({ ...contactForm, telephone1: e.target.value })} /></div>
              <div><label className="label">Téléphone 2</label><input className="input" value={contactForm.telephone2} onChange={(e) => setContactForm({ ...contactForm, telephone2: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={contactForm.autoriseDepart} onChange={(e) => setContactForm({ ...contactForm, autoriseDepart: e.target.checked })} />
                Autorisé à récupérer l'enfant
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowContactForm(false)} className="btn-secondary flex-1">Annuler</button>
                <button type="submit" className="btn-primary flex-1">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
