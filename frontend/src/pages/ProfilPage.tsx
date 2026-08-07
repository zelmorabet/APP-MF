import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { UserCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ prenom: user?.prenom || '', nom: user?.nom || '', telephone: user?.telephone || '', adresse: user?.adresse || '', ville: user?.ville || '', noPermis: user?.noPermis || '', nas: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const update = useMutation({
    mutationFn: (data: any) => api.put('/rsge/profil', data),
    onSuccess: () => toast.success('Profil mis à jour'),
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const changePw = useMutation({
    mutationFn: (data: any) => api.post('/auth/change-password', data),
    onSuccess: () => { toast.success('Mot de passe modifié'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });

  const { data: bc } = useQuery({
    queryKey: ['profil'],
    queryFn: () => api.get('/rsge/profil').then((r) => r.data),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <UserCircle size={28} className="text-blue-600" />
        <h1>Mon profil RSGE</h1>
      </div>

      <div className="card">
        <h2 className="mb-4">Informations personnelles</h2>
        <form onSubmit={(e) => { e.preventDefault(); update.mutate(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Prénom</label><input className="input" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
            <div><label className="label">Nom</label><input className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Téléphone</label><input className="input" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
            <div><label className="label">No de permis BC</label><input className="input" value={form.noPermis} onChange={(e) => setForm({ ...form, noPermis: e.target.value })} /></div>
          </div>
          <div><label className="label">Adresse</label><input className="input" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div>
          <div><label className="label">Ville</label><input className="input" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} /></div>
          <div>
            <label className="label">NAS (numéro d'assurance sociale)</label>
            <input type="password" autoComplete="off" placeholder="••• ••• •••  (laisser vide pour ne pas modifier)" className="input" value={form.nas} onChange={(e) => setForm({ ...form, nas: e.target.value })} />
            <p className="text-xs text-gray-400 mt-1">Chiffré avec AES-256-GCM</p>
          </div>
          {bc?.bureauCoord && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-800">Bureau Coordinateur : {bc.bureauCoord.nom}</p>
              <p className="text-blue-600">{bc.bureauCoord.email}</p>
            </div>
          )}
          <button type="submit" disabled={update.isPending} className="btn-primary">
            <Save size={16} /> Sauvegarder
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="mb-4">Changer le mot de passe</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (pwForm.newPassword !== pwForm.confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
          changePw.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
        }} className="space-y-4">
          <div><label className="label">Mot de passe actuel</label><input required type="password" className="input" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} /></div>
          <div><label className="label">Nouveau mot de passe (min. 8 caractères)</label><input required type="password" minLength={8} className="input" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} /></div>
          <div><label className="label">Confirmer le nouveau mot de passe</label><input required type="password" className="input" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} /></div>
          <button type="submit" disabled={changePw.isPending} className="btn-primary">Modifier le mot de passe</button>
        </form>
      </div>
    </div>
  );
}
