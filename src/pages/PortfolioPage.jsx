import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ArrowDown, ArrowUpRight } from 'lucide-react';

import { photoService } from '../services/photoService';
import { categories } from '../data/config';

import PhotoGrid from '../components/PhotoGrid';
import Lightbox from '../components/Lightbox';
import ContactSection from '../components/ContactSection';

export default function PortfolioPage() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    photoService.getPublished().then(setPhotos);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return photos;
    return photos.filter((photo) => photo.categories.includes(filter));
  }, [photos, filter]);

  const visible = filtered.slice(0, visibleCount);

  const selectPhoto = (photo) => {
    const index = visible.findIndex((item) => item.id === photo.id);
    setLightboxIndex(index);
  };

  const changeFilter = (id) => {
    setFilter(id);
    setVisibleCount(6);
    setLightboxIndex(-1);
  };

  const changeLightbox = useCallback((next) => {
    setLightboxIndex(next);
  }, []);

  return (
    <>
      <section className="portfolio-hero editorial-portfolio-hero">
        <div className="container">
          <div className="editorial-section-label">
            <span className="editorial-number">04</span>
            <span className="editorial-label-rule" />
            PORTOFOLIO · CAHYANAPOOL
          </div>

          <div className="portfolio-title-row editorial-portfolio-title-row">
            <div>
              <p className="editorial-overline">BUILT WITH PURPOSE. MADE TO LAST.</p>
              <h1>
                A collection of
                <br />
                <em>lived-in dreams.</em>
              </h1>
            </div>
            <div className="editorial-portfolio-summary">
              <p>
                Dari kolam renang yang tenang hingga lanskap yang menyatu dengan
                arsitektur, setiap proyek punya cerita dan karakternya sendiri.
              </p>
              <a href="#galeri" className="editorial-inline-link">
                Jelajahi koleksi <ArrowDown size={16} />
              </a>
            </div>
          </div>

          <div className="editorial-portfolio-foot">
            <span>KOLEKSI PROYEK TERPILIH</span>
            <span>EST. 1993 · INDONESIA</span>
          </div>
        </div>
      </section>

      <section className="portfolio-section section-pad" id="galeri">
        <div className="container">
          <div className="portfolio-toolbar">
            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter kategori portofolio"
            >
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => changeFilter('all')}
              >
                Semua <span>{photos.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={filter === cat.id ? 'active' : ''}
                  onClick={() => changeFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="results-count">{filtered.length} FOTO</span>
          </div>

          <PhotoGrid photos={visible} onSelect={selectPhoto} variant="editorial" />

          {visibleCount < filtered.length && (
            <div className="load-more-wrap">
              <button
                className="button button-outline"
                onClick={() => setVisibleCount((count) => count + 6)}
              >
                Muat foto berikutnya <ArrowDown size={17} />
              </button>
            </div>
          )}

          {!filtered.length && (
            <p className="gallery-empty-note">Belum ada foto untuk kategori ini.</p>
          )}

          <div className="gallery-footnote">
            <span className="footnote-line" />
            <span>Dokumentasi proyek CahyanaPool</span>
            <span className="gallery-count">{visible.length} / {filtered.length}</span>
          </div>
        </div>
      </section>

      <div className="portfolio-cta container">
        <div>
          <span className="eyebrow">PUNYA RENCANA?</span>
          <h2>Ruang berikutnya<br /><em>bisa dimulai di sini.</em></h2>
        </div>
        <a className="button button-primary" href="#kontak">
          Bicarakan ide <ArrowUpRight size={18} />
        </a>
      </div>

      <ContactSection />

      <Lightbox
        photos={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onChange={changeLightbox}
      />
    </>
  );
}
