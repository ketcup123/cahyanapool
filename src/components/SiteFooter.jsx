import { Link } from 'react-router-dom';
import {
  Leaf,
  ArrowUpRight,
} from 'lucide-react';

import { brand } from '../data/config';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Identitas CahyanaPool */}
        <div className="footer-intro">
          <Link
            to="/"
            className="brand footer-brand"
          >
            <span className="brand-mark">
              <Leaf size={22} />
            </span>

            <span>
              <strong>{brand.name}</strong>

              <small>
                KOLAM · TAMAN · KEHIDUPAN
              </small>
            </span>
          </Link>

          <p>
            Ruang air yang tenang, taman yang hidup,
            dan ruang luar yang terasa dekat dengan alam.
          </p>
        </div>

        {/* Navigasi website */}
        <div className="footer-navigation">
          <h3>Jelajahi</h3>

          <Link to="/">
            Beranda
          </Link>

          <Link to="/portofolio">
            Portofolio
          </Link>

          <a href="/#layanan">
            Layanan
          </a>
        </div>

        {/* Kontak */}
        <div className="footer-contact">
          <h3>Mulai percakapan</h3>

          <a href="/#kontak">
            Kontak CahyanaPool
            <ArrowUpRight size={15} />
          </a>

          <p className="footer-note">
            Kolam renang, kolam ikan, taman, dan renovasi.
          </p>
        </div>
      </div>

      {/* Informasi bagian bawah footer */}
      <div className="container footer-bottom">
        <span>
          © {currentYear} CahyanaPool
        </span>
      </div>
    </footer>
  );
}