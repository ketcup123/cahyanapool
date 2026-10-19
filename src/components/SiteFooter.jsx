import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';

import { brand, contacts } from '../data/config';
import { getWhatsAppUrl } from '../services/contactService';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsapp = getWhatsAppUrl('main');

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Link to="/" className="brand footer-brand" aria-label={`${brand.name} beranda`}>
            <img src="/images/logokali.jpeg" alt="" className="brand-logo" />
            <span>
              <strong>{brand.name}</strong>
              <small>KOLAM · TAMAN · KEHIDUPAN</small>
            </span>
          </Link>
          <p>
            Ruang air yang tenang, taman yang hidup, dan ruang luar yang terasa
            dekat dengan alam.
          </p>
        </div>

        <nav className="footer-navigation" aria-label="Navigasi footer">
          <h3>Jelajahi</h3>
          <Link to="/">Beranda</Link>
          <Link to="/portofolio">Portofolio</Link>
          <a href="/#layanan">Layanan</a>
          <a href="/#faq">Pertanyaan umum</a>
        </nav>

        <div className="footer-contact">
          <h3>Mulai percakapan</h3>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> Chat WhatsApp <ArrowUpRight size={15} />
            </a>
          )}
          <a href={`mailto:${contacts.email}`}>
            <Mail size={16} /> {contacts.email}
          </a>
          <span className="footer-line">
            <MapPin size={16} /> {contacts.address}
          </span>
          <p className="footer-note">Kolam renang, kolam ikan, taman, dan renovasi.</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {year} {brand.name}. Berdiri sejak {brand.since}.</span>
      </div>
    </footer>
  );
}
