import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LoginPage } from '../features/auth/LoginPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { RiskPage } from '../features/risk/RiskPage';
import { HistoryPage } from '../features/history/HistoryPage';
import { FairnessPage } from '../features/fairness/FairnessPage';
import { PerformancePage } from '../features/performance/PerformancePage';
import { ImpactPage } from '../features/impact/ImpactPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/risk" replace />} />
          <Route path="risk" element={<RiskPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="fairness" element={<FairnessPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="impact" element={<ImpactPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
