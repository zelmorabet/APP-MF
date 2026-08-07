import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { FolderOpen, Upload, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then((r) => r.data),
  });

  const upload = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('fichier', file);
      fd.append('type', 'AUTRE');
      return api.post('/documents/upload', fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); toast.success('Document uploadé'); },
    onError: () => toast.error('Erreur lors de l\'upload'),
  });

  const supprimer = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });

  const getUrl = async (id: string) => {
    const { data } = await api.get(`/documents/${id}/url`);
    window.open(data.url, '_blank');
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} Ko` : `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen size={28} className="text-blue-600" />
          <h1>Documents</h1>
        </div>
        <div>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) upload.mutate(e.target.files[0]); }} />
          <button onClick={() => fileRef.current?.click()} disabled={upload.isPending} className="btn-primary">
            <Upload size={18} /> Téléverser un document
          </button>
        </div>
      </div>

      <div className="card">
        <div className="space-y-3">
          {documents.map((doc: any) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <FolderOpen size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc.nom}</p>
                <p className="text-xs text-gray-400">{new Date(doc.createdAt).toLocaleDateString('fr-CA')} {formatSize(doc.taille)}</p>
              </div>
              <span className="badge-gray text-xs">{doc.type}</span>
              <button onClick={() => getUrl(doc.id)} className="text-blue-500 hover:text-blue-700 p-1"><ExternalLink size={16} /></button>
              <button onClick={() => { if (confirm('Supprimer ce document ?')) supprimer.mutate(doc.id); }} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
            </div>
          ))}
          {documents.length === 0 && <p className="text-center text-gray-400 py-8">Aucun document</p>}
        </div>
      </div>
    </div>
  );
}
