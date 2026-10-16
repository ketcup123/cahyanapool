import {
  ArrowUpRight,
  Mail,
  MapPin,
} from 'lucide-react';

import { contacts } from '../data/config';
import { getWhatsAppUrl } from '../services/contactService';

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="contact-brand-icon contact-brand-icon-instagram"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.7" r="1" className="instagram-dot" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="contact-brand-icon contact-brand-icon-tiktok"
    >
      <path
        className="tiktok-shadow"
        d="M15.5 3h-3.2v11.2a3.1 3.1 0 1 1-2.7-3.1V7.8a6.4 6.4 0 1 0 6.1 6.4V8.7a8.1 8.1 0 0 0 4.1 1.1V6.5A4.9 4.9 0 0 1 15.5 3Z"
      />
      <path
        className="tiktok-main"
        d="M14.2 2h-3.1v11.2a3.1 3.1 0 1 1-2.7-3.1V6.8a6.4 6.4 0 1 0 6.1 6.4V7.7a8.1 8.1 0 0 0 4.1 1.1V5.5A4.9 4.9 0 0 1 14.2 2Z"
      />
    </svg>
  );
}

export default function ContactSection() {
  const mainWhatsApp = getWhatsAppUrl('main');

  return (
    <section className="contact-section section-pad" id="kontak">
      <div className="container contact-panel">
        <div className="contact-copy">
          <span className="eyebrow eyebrow-light">MARI BICARAKAN RENCANAMU</span>
          <h2>Sudut luar rumah bisa jadi ruang favorit Anda.</h2>
          <p>
            Ceritakan rencana kolam atau taman yang ingin diwujudkan.
            Tim kami siap membantu kebutuhan proyek Anda.
          </p>
          <a
            className="button button-light"
            href={mainWhatsApp || '#kontak-detail'}
            target={mainWhatsApp ? '_blank' : undefined}
            rel={mainWhatsApp ? 'noreferrer' : undefined}
          >
            {mainWhatsApp ? 'Mulai chat WhatsApp' : 'Lihat informasi kontak'}
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="contact-details" id="kontak-detail">
          <h3>Informasi Kontak</h3>

          <a href={`mailto:${contacts.email}`}>
            <Mail aria-hidden="true" />
            {contacts.email}
            <ArrowUpRight aria-hidden="true" />
          </a>

          <a
            href={contacts.maps}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin aria-hidden="true" />
            {contacts.address}
            <ArrowUpRight aria-hidden="true" />
          </a>

          <a href={contacts.instagram} target="_blank" rel="noreferrer">
            <InstagramIcon />
            Instagram · @cahyanapool
            <ArrowUpRight aria-hidden="true" />
          </a>

          <a href={contacts.tiktok} target="_blank" rel="noreferrer">
            <TikTokIcon />
            TikTok · @inialosha
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
