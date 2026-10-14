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

  // Memuat foto yang berstatus Published.
  useEffect(() => {
    photoService.getPublished().then(setPhotos);
  }, []);

  // Memfilter foto berdasarkan kategori yang dipilih.
  const filtered = useMemo(() => {
    if (filter === 'all') {
      return photos;
    }

    return photos.filter((photo) =>
      photo.categories.includes(filter)
    );
  }, [photos, filter]);

  // Membatasi jumlah foto yang ditampilkan.
  const visible = filtered.slice(0, visibleCount);

  // Membuka lightbox pada foto yang dipilih.
  const selectPhoto = (photo) => {
    const index = visible.findIndex(
      (item) => item.id === photo.id
    );

    setLightboxIndex(index);
  };

  // Mengubah kategori dan mengatur ulang galeri.
  const changeFilter = (id) => {
    setFilter(id);
    setVisibleCount(6);
    setLightboxIndex(-1);
  };

  // Mengubah indeks foto di dalam lightbox.
  const changeLightbox = useCallback((next) => {
    setLightboxIndex(next);
  }, []);

  return (
    <>
      {/* Hero portofolio */}
      <section className="portfolio-hero">
        <div className="container">
          <div className="section-index">
            <span>04</span>
            <span className="index-line" />
            GALERI KAMI
          </div>

          <div className="portfolio-title-row">
            <h1>
              Every Space
              <br />
              <em>Tells a Story.</em>
            </h1>

            <p>
              Jelajahi dokumentasi pekerjaan kolam renang, kolam ikan,
              taman, dan renovasi CahyanaPool.
            </p>
          </div>

          <a href="#galeri" className="scroll-link">
            JELAJAHI 
            <ArrowDown size={15} />
          </a>
        </div>
      </section>

      {/* Galeri dan filter kategori */}
      <section
        className="portfolio-section section-pad"
        id="galeri"
      >
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
                Semua
                <span>{photos.length}</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={
                    filter === cat.id ? 'active' : ''
                  }
                  onClick={() => changeFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="results-count">
              {filtered.length} FOTO
            </span>
          </div>

          {/* Daftar foto */}
          <PhotoGrid
            photos={visible}
            onSelect={selectPhoto}
          />

          {/* Tombol untuk menampilkan foto berikutnya */}
          {visibleCount < filtered.length && (
            <div className="load-more-wrap">
              <button
                className="button button-outline"
                onClick={() =>
                  setVisibleCount((count) => count + 6)
                }
              >
                Muat foto berikutnya
                <ArrowDown size={17} />
              </button>
            </div>
          )}

          {/* Pesan ketika galeri kosong */}
          {!filtered.length && (
            <p className="gallery-empty-note">
              Belum ada foto untuk kategori ini.
            </p>
          )}

          {/* Informasi galeri */}
          <div className="gallery-footnote">
            <span className="footnote-line" />

            <span>
              Dokumentasi proyek Kami
            </span>

            <span className="gallery-count">
              {visible.length} / {filtered.length}
            </span>
          </div>
        </div>
      </section>

      {/* Ajakan menghubungi CahyanaPool */}
      <div className="portfolio-cta container">
        <div>
          <span className="eyebrow">MERASA TERTARIK?</span>

          <h2>
            Diskusikan dengan Kami.
          </h2>
        </div>

        <a
          className="button button-primary"
          href="#kontak"
        >
          Bicarakan ide
          <ArrowUpRight size={18} />
        </a>
      </div>

      {/* Informasi kontak */}
      <ContactSection />

      {/* Tampilan foto dalam lightbox */}
      <Lightbox
        photos={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onChange={changeLightbox}
      />
    </>
  );
}