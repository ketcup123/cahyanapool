import { MessageCircle } from 'lucide-react';

import { getWhatsAppUrl } from '../services/contactService';

export default function WhatsAppButton() {
  const href = getWhatsAppUrl('main');
  const isConfigured = Boolean(href);

  const buttonClassName = [
    'whatsapp-float',
    !isConfigured && 'is-unconfigured',
  ]
    .filter(Boolean)
    .join(' ');

  const label = isConfigured
    ? 'Hubungi CahyanaPool melalui WhatsApp'
    : 'Lihat informasi kontak';

  const title = isConfigured
    ? 'Chat WhatsApp'
    : 'Lihat informasi kontak';

  return (
    <a
      className={buttonClassName}
      href={href || '#kontak'}
      target={isConfigured ? '_blank' : undefined}
      rel={isConfigured ? 'noreferrer' : undefined}
      aria-label={label}
      title={title}
    >
      <MessageCircle size={23} />

      <span>
        {isConfigured ? 'Chat kami' : 'Kontak'}
      </span>
    </a>
  );
}