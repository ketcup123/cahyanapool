import { useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}) {
  const totalPhotos = photos.length;

  useEffect(() => {
    if (index < 0 || totalPhotos === 0) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowRight') {
        onChange((index + 1) % totalPhotos);
      }

      if (event.key === 'ArrowLeft') {
        onChange(
          (index - 1 + totalPhotos) % totalPhotos
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;
    };
  }, [index, totalPhotos, onClose, onChange]);

  // Jangan tampilkan lightbox jika foto tidak valid.
  if (index < 0 || !photos[index]) {
    return null;
  }

  const photo = photos[index];

  const showPreviousPhoto = () => {
    onChange(
      (index - 1 + totalPhotos) % totalPhotos
    );
  };

  const showNextPhoto = () => {
    onChange((index + 1) % totalPhotos);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto"
      onMouseDown={handleBackdropClick}
    >
      {/* Tombol tutup */}
      <button
        className="lightbox-close icon-button"
        onClick={onClose}
        aria-label="Tutup foto"
      >
        <X />
      </button>

      {/* Foto sebelumnya */}
      <button
        className="lightbox-arrow prev icon-button"
        onClick={showPreviousPhoto}
        aria-label="Foto sebelumnya"
      >
        <ChevronLeft />
      </button>

      {/* Foto yang sedang ditampilkan */}
      <figure>
        <img
          src={photo.src}
          alt={photo.alt}
        />

        <figcaption>
          {photo.alt}

          <span>
            {index + 1} / {totalPhotos}
          </span>
        </figcaption>
      </figure>

      {/* Foto berikutnya */}
      <button
        className="lightbox-arrow next icon-button"
        onClick={showNextPhoto}
        aria-label="Foto berikutnya"
      >
        <ChevronRight />
      </button>
    </div>
  );
}