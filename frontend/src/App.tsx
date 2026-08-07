import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EnfantsPage from './pages/EnfantsPage';
import EnfantDetailPage from './pages/EnfantDetailPage';
import ParentsPage from './pages/ParentsPage';
import PresencesPage from './pages/PresencesPage';
import AssiduitesPage from './pages/AssiduitesPage';
import EntentesPage from './pages/EntentesPage';
import FacturationPage from './pages/FacturationPage';
import RapportsPage from './pages/RapportsPage';
import CalendrierPage from './pages/CalendrierPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilPage from './pages/ProfilPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="enfants" element={<EnfantsPage />} />
          <Route path="enfants/:id" element={<EnfantDetailPage />} />
          <Route path="parents" element={<ParentsPage />} />
          <Route path="presences" element={<PresencesPage />} />
          <Route path="assiduites" element={<AssiduitesPage />} />
          <Route path="ententes" element={<EntentesPage />} />
          <Route path="facturation" element={<FacturationPage />} />
          <Route path="rapports" element={<RapportsPage />} />
          <Route path="calendrier" element={<CalendrierPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="profil" element={<ProfilPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
