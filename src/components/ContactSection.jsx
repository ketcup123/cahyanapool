import {
  ArrowUpRight,
  Mail,
  MapPin,
  Camera,
  Music2,
} from 'lucide-react';

import { contacts } from '../data/config';
import { getWhatsAppUrl } from '../services/contactService';

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
            <Mail />
            {contacts.email}
            <ArrowUpRight />
          </a>

          <a
            href={contacts.maps}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin />
            {contacts.address}
            <ArrowUpRight />
          </a>

          <a href={contacts.instagram} target="_blank" rel="noreferrer">
            <Camera />
            Instagram · @cahyanapool
            <ArrowUpRight />
          </a>

          <a href={contacts.tiktok} target="_blank" rel="noreferrer">
            <Music2 />
            TikTok · @inialosha
            <ArrowUpRight />
          </a>

        </div>
      </div>
    </section>
  );
}
