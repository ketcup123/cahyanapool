import { ArrowUpRight } from 'lucide-react';
import { categories } from '../data/config';

export default function PhotoGrid({
  photos,
  onSelect,
  showStatus = false,
  onEdit,
  variant,
}) {
  if (!photos.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">✳</span>
        <h3>Belum ada foto di sini</h3>
        <p>Belum ada foto untuk ditampilkan pada pilihan ini.</p>
      </div>
    );
  }

  return (
    <div className={`photo-grid${variant === 'editorial' ? ' photo-grid--editorial' : ''}`}>
      {photos.map((photo, index) => {
        const category =
          categories.find((item) => item.id === photo.categories?.[0])?.label ||
          'Portofolio';
        const statusLabel = photo.status === 'published' ? 'Published' : 'Draft';

        return (
          <article className="photo-card" key={photo.id}>
            <button
              className="photo-open"
              onClick={() => onSelect?.(photo)}
              aria-label={`Lihat foto ${photo.alt}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={index > 1 ? 'lazy' : 'eager'}
              />
              <span className="photo-open-icon">
                <ArrowUpRight size={20} />
              </span>
            </button>

            <div className="photo-card-meta">
              <span>{category}</span>
              {showStatus && (
                <span className={`status-pill ${photo.status}`}>
                  {statusLabel}
                </span>
              )}
              {onEdit && (
                <button className="text-button" onClick={() => onEdit(photo)}>
                  Kelola
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
