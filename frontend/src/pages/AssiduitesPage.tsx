import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { FeuilleAssiduite, StatutFeuille, MOIS_LABELS } from '../types';
import { FileText, Send, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const STATUT_STYLE: Record<StatutFeuille, string> = {
  BROUILLON: 'badge-gray', GENEREE: 'badge-blue',
  ENVOYEE_BC: 'badge-yellow', CONFIRMEE_BC: 'badge-green',
};
const STATUT_LABEL: Record<StatutFeuille, string> = {
  BROUILLON: 'Brouillon', GENEREE: 'Générée',
  ENVOYEE_BC: 'Envoyée au BC', CONFIRMEE_BC: 'Confirmée BC',
};

export default function AssiduitesPage() {
  const qc = useQueryClient();
  const now = new Date();
  const [mois, setMois] = useState(now.getMonth() + 1);
  const [annee, setAnnee] = useState(now.getFullYear());
  const [emailBC, setEmailBC] = useState('');

  const { data: feuilles = [] } = useQuery<FeuilleAssiduite[]>({
    queryKey: ['assiduites'],
    queryFn: () => api.get('/assiduites').then((r) => r.data),
  });

  const generer = useMutation({
    mutationFn: () => api.post(`/assiduites/${annee}/${mois}/generer`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assiduites'] }); toast.success('Feuille générée'); },
  });

  const envoyerBC = useMutation({
    mutationFn: () => api.post(`/assiduites/${annee}/${mois}/envoyer-bc`, { emailBC }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assiduites'] }); toast.success('Feuille envoyée au BC'); },
    onError: () => toast.error('Erreur lors de l\'envoi'),
  });

  const telechargerPdf = () => {
    window.open(`/api/assiduites/${annee}/${mois}/pdf`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h1>Feuilles d'assiduité</h1>

      {/* Génération */}
      <div className="card">
        <h2 className="mb-4">Générer une feuille</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="label">Mois</label>
            <select className="input w-36" value={mois} onChange={(e) => setMois(parseInt(e.target.value))}>
              {MOIS_LABELS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Année</label>
            <input type="number" className="input w-24" value={annee} onChange={(e) => setAnnee(parseInt(e.target.value))} />
          </div>
          <button onClick={() => generer.mutate()} disabled={generer.isPending} className="btn-primary">
            <RefreshCw size={16} /> Générer
          </button>
          <button onClick={telechargerPdf} className="btn-secondary">
            <Download size={16} /> Télécharger PDF
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="label">Email du Bureau Coordinateur</label>
          <div className="flex gap-3">
            <input className="input flex-1" type="email" placeholder="bc@exemple.com" value={emailBC} onChange={(e) => setEmailBC(e.target.value)} />
            <button onClick={() => envoyerBC.mutate()} disabled={!emailBC || envoyerBC.isPending} className="btn-primary">
              <Send size={16} /> Envoyer au BC
            </button>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="card">
        <h2 className="mb-4">Historique</h2>
        <div className="space-y-3">
          {feuilles.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{MOIS_LABELS[f.mois]} {f.annee}</p>
                  {f.dateEnvoi && <p className="text-xs text-gray-500">Envoyé le {new Date(f.dateEnvoi).toLocaleDateString('fr-CA')}</p>}
                </div>
              </div>
              <span className={STATUT_STYLE[f.statut]}>{STATUT_LABEL[f.statut]}</span>
            </div>
          ))}
          {feuilles.length === 0 && <p className="text-center text-gray-400 py-4">Aucune feuille générée</p>}
        </div>
      </div>
    </div>
  );
}
