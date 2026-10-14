const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

export function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Format file harus JPG, PNG, WebP, atau AVIF.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Ukuran setiap file maksimal 10 MB.';
  }

  return '';
}