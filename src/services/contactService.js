
import { contacts } from '../data/config';

const WHATSAPP_SERVICES = {
  pool: {
    number: 'poolWhatsApp',
    message:
      'Halo CahyanaPool, saya ingin bertanya tentang pembuatan atau renovasi kolam.',
  },

  fish: {
    number: 'fishWhatsApp',
    message:
      'Halo CahyanaPool, saya ingin bertanya tentang kolam ikan.',
  },

  garden: {
    number: 'gardenWhatsApp',
    message:
      'Halo CahyanaPool, saya ingin bertanya tentang taman dan perawatan.',
  },

  main: {
    number: 'mainWhatsApp',
    message:
      'Halo CahyanaPool, saya ingin bertanya tentang layanan CahyanaPool.',
  },
};

const SERVICE_CATEGORY_MAP = {
  'kolam-ikan': 'fish',
  taman: 'garden',
  perawatan: 'garden',
  'kolam-renang': 'pool',
  renovasi: 'pool',
};

export function getWhatsAppUrl(service = 'main') {
  const selectedService =
    WHATSAPP_SERVICES[service] || WHATSAPP_SERVICES.main;

  const number = contacts[selectedService.number];

  if (!number) {
    return '';
  }

  const cleanNumber = number.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(
    selectedService.message,
  );

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function getServiceWhatsApp(service) {
  const whatsappService =
    SERVICE_CATEGORY_MAP[service] || 'main';

  return getWhatsAppUrl(whatsappService);
}