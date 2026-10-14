import { useState } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setOpen(false);
  };

  // Klik logo: kembali ke homepage dan scroll ke atas.
  const handleLogoClick = (event) => {
    event.preventDefault();
    closeMenu();

    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo dan identitas CahyanaPool */}
        <Link
          to="/"
          className="brand"
          aria-label="CahyanaPool beranda"
          onClick={handleLogoClick}
        >
          <img
            src="/images/logokali.jpeg"
            alt="Logo CahyanaPool"
            className="brand-logo"
          />

          <span>
            <strong>CahyanaPool</strong>
            <small>KOLAM · TAMAN · KEHIDUPAN</small>
          </span>
        </Link>

        {/* Tombol menu perangkat mobile */}
        <button
          type="button"
          className="menu-toggle icon-button"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((previous) => !previous)}
        >
          {open ? <X /> : <Menu />}
        </button>

        {/* Navigasi utama */}
        <nav
          id="main-navigation"
          className={`main-nav ${open ? 'is-open' : ''}`}
          aria-label="Navigasi utama"
        >
          <NavLink to="/" end onClick={closeMenu}>
            Beranda
          </NavLink>

          <NavLink
            to="/portofolio"
            onClick={closeMenu}
          >
            Portofolio
          </NavLink>

          <a href="/#layanan" onClick={closeMenu}>
            Layanan
          </a>

          <a
            className="nav-cta"
            href="/#kontak"
            onClick={closeMenu}
          >
            Hubungi kami <span>↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}