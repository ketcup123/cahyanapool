import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';

import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik menggunakan layout utama */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/portofolio"
            element={<PortfolioPage />}
          />
        </Route>

        {/* Halaman admin menggunakan layout terpisah */}
        <Route
          path="/admin"
          element={<AdminPage />}
        />

        {/* Arahkan URL yang tidak ditemukan ke halaman utama */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}