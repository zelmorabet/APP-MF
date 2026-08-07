import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Facture, StatutFacture, MOIS_LABELS } from '../types';
import { DollarSign, Send, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUT_STYLE: Record<StatutFacture, string> = {
  GENEREE: 'badge-blue', ENVOYEE: 'badge-yellow', PAYEE: 'badge-green', ANNULEE: 'badge-red',
};

export default function FacturationPage() {
  const qc = useQueryClient();
  const now = new Date();
  const [mois, setMois] = useState(now.getMonth() + 1);
  const [annee, setAnnee] = useState(now.getFullYear());

  const { data: factures = [] } = useQuery<Facture[]>({
    queryKey: ['factures', annee],
    queryFn: () => api.get(`/facturation?annee=${annee}`).then((r) => r.data),
  });

  const { data: tableau } = useQuery({
    queryKey: ['tableau-bord', annee],
    queryFn: () => api.get(`/facturation/tableau-de-bord/${annee}`).then((r) => r.data),
  });

  const generer = useMutation({
    mutationFn: () => api.post(`/facturation/generer/${annee}/${mois}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['factures'] }); qc.invalidateQueries({ queryKey: ['tableau-bord'] }); toast.success('Factures générées'); },
  });

  const envoyer = useMutation({
    mutationFn: (id: string) => api.post(`/facturation/${id}/envoyer`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['factures'] }); toast.success('Reçu envoyé'); },
    onError: () => toast.error('Erreur lors de l\'envoi'),
  });

  const filtresMois = factures.filter((f) => f.mois === mois);

  return (
    <div className="space-y-6">
      <h1>Facturation</h1>

      {/* Résumé annuel */}
      {tableau && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Revenu brut', value: tableau.totalBrut, color: 'text-blue-600' },
            { label: 'Subventions Famille QC', value: tableau.totalSubvention, color: 'text-violet-600' },
            { label: 'Revenu net (à recevoir)', value: tableau.totalNet, color: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{Number(s.value).toFixed(2)} $</p>
              <p className="text-sm text-gray-500 mt-1">{s.label} {annee}</p>
            </div>
          ))}
        </div>
      )}

      {/* Génération */}
      <div className="card">
        <h2 className="mb-4">Générer les reçus du mois</h2>
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
            <RefreshCw size={16} /> Générer les reçus
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="card">
        <h2 className="mb-4">{MOIS_LABELS[mois]} {annee} — {filtresMois.length} reçu(s)</h2>
        <div className="space-y-3">
          {filtresMois.map((f) => (
            <div key={f.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <DollarSign size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="font-medium">{f.parent?.prenom} {f.parent?.nom}</p>
                <p className="text-sm text-gray-500">{f.nombreJours} jours × {Number(f.tarifJournalier).toFixed(2)} $ = <strong>{Number(f.montantNet).toFixed(2)} $</strong> (subv. {Number(f.montantSubvention).toFixed(2)} $)</p>
              </div>
              <span className={STATUT_STYLE[f.statut]}>{f.statut}</span>
              {f.statut === 'GENEREE' && (
                <button onClick={() => envoyer.mutate(f.id)} className="btn-secondary text-sm py-1.5">
                  <Send size={15} /> Envoyer
                </button>
              )}
            </div>
          ))}
          {filtresMois.length === 0 && <p className="text-center text-gray-400 py-4">Aucune facture pour ce mois</p>}
        </div>
      </div>
    </div>
  );
}
