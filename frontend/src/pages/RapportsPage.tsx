import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MOIS_LABELS } from '../types';
import { BarChart3, Send, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RapportsPage() {
  const now = new Date();
  const [mois, setMois] = useState(now.getMonth() + 1);
  const [annee, setAnnee] = useState(now.getFullYear());
  const [emailBC, setEmailBC] = useState('');

  const { data: rapport, refetch } = useQuery({
    queryKey: ['rapport-assiduites', mois, annee],
    queryFn: () => api.get(`/rapports/assiduites/${annee}/${mois}`).then((r) => r.data),
    enabled: false,
  });

  const { data: inscriptions } = useQuery({
    queryKey: ['rapport-inscriptions'],
    queryFn: () => api.get('/rapports/inscriptions').then((r) => r.data),
  });

  const envoyerBC = useMutation({
    mutationFn: () => api.post(`/rapports/assiduites/${annee}/${mois}/envoyer-bc`, { emailBC }),
    onSuccess: () => toast.success('Rapport envoyé au Bureau Coordinateur'),
    onError: () => toast.error('Erreur lors de l\'envoi'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 size={28} className="text-blue-600" />
        <h1>Rapports pour le Bureau Coordinateur</h1>
      </div>

      {/* Rapport assiduité */}
      <div className="card">
        <h2 className="mb-4">Rapport d'assiduité mensuel</h2>
        <div className="flex flex-wrap items-end gap-4 mb-4">
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
          <button onClick={() => refetch()} className="btn-secondary"><Download size={16} /> Générer</button>
        </div>

        {rapport && (
          <>
            <h3 className="font-medium text-gray-700 mb-3">Période : {rapport.periode}</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 border-b">Enfant</th>
                  <th className="px-3 py-2 border-b text-center">Présents</th>
                  <th className="px-3 py-2 border-b text-center">Absents</th>
                  <th className="px-3 py-2 border-b text-center">Fériés/Fermés</th>
                </tr>
              </thead>
              <tbody>
                {rapport.lignes?.map((l: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b font-medium">{l.enfant}</td>
                    <td className="px-3 py-2 border-b text-center text-green-700">{l.presents}</td>
                    <td className="px-3 py-2 border-b text-center text-red-600">{l.absents}</td>
                    <td className="px-3 py-2 border-b text-center text-gray-500">{l.feries + l.fermetures}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 pt-4 border-t">
              <label className="label">Email Bureau Coordinateur</label>
              <div className="flex gap-3">
                <input className="input flex-1" type="email" value={emailBC} onChange={(e) => setEmailBC(e.target.value)} placeholder="bc@exemple.com" />
                <button onClick={() => envoyerBC.mutate()} disabled={!emailBC} className="btn-primary">
                  <Send size={16} /> Envoyer au BC
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Inscriptions */}
      {inscriptions && (
        <div className="card">
          <h2 className="mb-4">Liste des inscriptions</h2>
          <div className="flex gap-6 mb-4">
            <div className="text-center"><p className="text-2xl font-bold text-blue-600">{inscriptions.actifs}</p><p className="text-sm text-gray-500">Enfants actifs</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-gray-400">{inscriptions.total - inscriptions.actifs}</p><p className="text-sm text-gray-500">Inactifs</p></div>
          </div>
          <div className="space-y-2">
            {inscriptions.enfants?.map((e: any) => (
              <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className={e.actif ? 'badge-green' : 'badge-gray'}>{e.actif ? 'Actif' : 'Inactif'}</span>
                <span className="font-medium text-sm">{e.prenom} {e.nom}</span>
                <span className="text-xs text-gray-500">Inscrit le {new Date(e.dateInscription).toLocaleDateString('fr-CA')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
