import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  Droplets,
  Leaf,
  RefreshCw,
  Sprout,
  Trees,
  Waves,
} from 'lucide-react';

import { photoService } from '../services/photoService';
import {
  services,
  categories,
  brand,
} from '../data/config';
import { getServiceWhatsApp } from '../services/contactService';

import PhotoGrid from '../components/PhotoGrid';
import Lightbox from '../components/Lightbox';
import ContactSection from '../components/ContactSection';

// Ikon untuk masing-masing layanan.
const serviceIcons = {
  pool: Waves,
  leaf: Leaf,
  refresh: RefreshCw,
  sprout: Sprout,
  trees: Trees,
};

export default function HomePage() {
  const [photos, setPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Ambil foto yang sudah dipublikasikan.
  useEffect(() => {
    photoService.getPublished().then(setPhotos);
  }, []);

  // Pilih foto unggulan berdasarkan kategori masing-masing.
  const featured = categories
    .map((category) => {
      const categoryPhotos = photos.filter(
        (photo) =>
          photo &&
          Array.isArray(photo.categories) &&
          photo.categories.includes(category.id)
      );

      // Cari foto yang benar-benar unggulan untuk kategori ini.
      // Jika tidak ada, gunakan foto pertama dalam kategori.
      return (
        categoryPhotos.find(
          (photo) =>
            Array.isArray(photo.featuredCategories) &&
            photo.featuredCategories.includes(category.id)
        ) ||
        categoryPhotos[0] ||
        null
      );
    })
    // Hindari menampilkan foto yang sama dua kali.
    .filter(
      (photo, index, list) =>
        photo &&
        list.findIndex(
          (item) => item && item.id === photo.id
        ) === index
    )
    .slice(0, 4);

  // Buka foto yang dipilih di lightbox.
  const openPhoto = (photo) => {
    const selectedIndex = featured.findIndex(
      (item) => item.id === photo.id
    );

    if (selectedIndex !== -1) {
      setLightboxIndex(selectedIndex);
    }
  };

  return (
    <>
      {/* ==============================
          HERO SECTION
      ============================== */}
      <section className="hero">
        <div
          className="hero-backdrop"
          aria-hidden="true"
        >
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="hero-lines" />
        </div>

        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              KAMI MEMBANGUN DARI {brand.since}
            </span>

            <h1>
              Creating Spaces.
              <br />
              <em>Inspiring Living.</em>
            </h1>

            <p>
              Maksimalkan potensi hunian Anda dengan ruang luar yang indah, nyaman, dan fungsional.
            </p>

            <div className="hero-actions">
              <Link
                className="button button-primary"
                to="/portofolio"
              >
                Jelajahi portofolio
                <ArrowUpRight size={18} />
              </Link>

              <a
                className="button button-quiet"
                href="#layanan"
              >
                Kenali layanan
                <ArrowDown size={16} />
              </a>
            </div>

            <div className="hero-footnote">
              <span className="hero-footnote-line" />
              Ide baik dimulai dari ruang yang terasa tepat.
            </div>
          </div>

          {/* Gambar utama */}
          <div className="hero-art">
            <div className="hero-image-frame">
              <img
                src="/images/herosection.jpg"
                alt="Kolam renang dan lanskap taman CahyanaPool"
                fetchPriority="high"
              />

              <div className="image-label">
                <span>01 / NATURAL LIVING</span>
              </div>
            </div>

            <div className="hero-stamp">
              <span>Ruang luar,</span>
              <strong>lebih hidup.</strong>
              <Leaf size={23} />
            </div>

            <div className="hero-side-note">
              AIR · TANAMAN · RUANG
            </div>
          </div>
        </div>

        <div className="container hero-bottom">
          <span>Kolam · Taman · Renovasi</span>

          <span className="scroll-cue">
            SCROLL UNTUK MENJELAJAHI
            <ArrowDown size={14} />
          </span>
        </div>
      </section>

      {/* ==============================
          TENTANG CAHYANAPOOL
      ============================== */}
      <section className="intro-section section-pad">
        <div className="container intro-grid">
          <div className="section-index">
            <span>01</span>
            <span className="index-line" />
            TENTANG KAMI
          </div>

          <div className="intro-copy">
            <h2>
              Bringing Water, Nature, and Architecture Together to Create{' '}
              <em>Extraordinary Spaces.</em>
            </h2>

            <div className="intro-bottom">
              <p>
                Sejak 1993, kami telah menghadirkan solusi menyeluruh untuk kolam renang dan taman, mulai dari perencanaan desain, pembangunan, perawatan, hingga renovasi. Dengan mengutamakan kualitas pengerjaan dan perhatian terhadap setiap detail, kami berkomitmen menciptakan serta menjaga ruang yang indah, fungsional, dan tahan lama.
              </p>

              <span className="intro-mark">
                <Leaf size={28} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          LAYANAN
      ============================== */}
      <section
        className="services-section section-pad"
        id="layanan"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-index">
                <span>02</span>
                <span className="index-line" />
                YANG KAMI KERJAKAN
              </div>

              <h2>
                Bring Ideas to Life
                <br />
                <em>See What’s Possible.</em>
              </h2>
            </div>

            <p>
              Dari ide sederhana hingga transformasi menyeluruh, jelajahi kemungkinan yang bisa diwujudkan.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const Icon =
                serviceIcons[service.icon] || Leaf;

              const href = getServiceWhatsApp(
                service.category
              );

              return (
                <article
                  className="service-card"
                  key={service.title}
                >
                  <div className="service-card-top">
                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <Icon
                      size={25}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <a
                    href={href || '#kontak'}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noreferrer' : undefined}
                    className="service-link"
                    aria-label={`Tanya tentang ${service.title}`}
                  >
                    Tanyakan layanan
                    <ArrowUpRight size={17} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==============================
          PORTOFOLIO UNGGULAN
      ============================== */}
      <section className="featured-section section-pad">
        <div className="container">
          <div className="section-heading featured-heading">
            <div>
              <div className="section-index">
                <span>03</span>
                <span className="index-line" />
                JELAJAHI GALERI KAMI
              </div>

              <h2>
                See Ideas 
                <em> Come Alive.</em>
              </h2>
            </div>

            <Link
              className="underlined-link"
              to="/portofolio"
            >
              Lihat semua
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <PhotoGrid
              photos={featured}
              onSelect={openPhoto}
            />
          ) : (
            <div className="empty-state">
              <h3>Belum ada foto portofolio</h3>

              <p>
                Foto proyek CahyanaPool akan ditampilkan di bagian ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==============================
          QUOTE SECTION
      ============================== */}
      <section className="quote-band">
        <div className="container quote-inner">
          <span className="quote-mark">“</span>

          <p>
            A beautiful space is more than what you see.
            <br />
            <em>It's what you feel every time you step into it.</em>
          </p>

          <span className="quote-leaf">
            <Droplets size={25} />
          </span>
        </div>
      </section>

      {/* ==============================
          KONTAK
      ============================== */}
      <ContactSection />

      {/* ==============================
          LIGHTBOX FOTO
      ============================== */}
      <Lightbox
        photos={featured}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onChange={setLightboxIndex}
      />
    </>
  );
}
