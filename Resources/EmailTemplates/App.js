import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* E-postadaki linkler buradaki rotalara vuracak */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}