
import { Outlet } from 'react-router-dom';

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WhatsAppButton from '../components/WhatsAppButton';

export default function PublicLayout() {
  return (
    <>
      {/* Header navigasi website */}
      <SiteHeader />

      {/* Konten halaman sesuai route aktif */}
      <main>
        <Outlet />
      </main>

      {/* Footer website */}
      <SiteFooter />

      {/* Tombol WhatsApp mengambang */}
      <WhatsAppButton />
    </>
  );
}
