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
import { services, categories, brand } from '../data/config';
import { getServiceWhatsApp } from '../services/contactService';
import PhotoGrid from '../components/PhotoGrid';
import Lightbox from '../components/Lightbox';
import ContactSection from '../components/ContactSection';

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

  useEffect(() => {
    photoService.getPublished().then(setPhotos);
  }, []);

  // Tetap pilih foto unggulan berdasarkan kategori, lalu hindari duplikasi.
  const featured = categories
    .map((category) => {
      const categoryPhotos = photos.filter(
        (photo) =>
          photo &&
          Array.isArray(photo.categories) &&
          photo.categories.includes(category.id)
      );

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
    .filter(
      (photo, index, list) =>
        photo &&
        list.findIndex((item) => item && item.id === photo.id) === index
    )
    .slice(0, 4);

  const openPhoto = (photo) => {
    const selectedIndex = featured.findIndex((item) => item.id === photo.id);
    if (selectedIndex !== -1) setLightboxIndex(selectedIndex);
  };

  return (
    <>
      <section className="editorial-hero">
        <img
          className="editorial-hero-image"
          src="/images/herosection.jpg"
          alt="Kolam renang dan lanskap taman CahyanaPool"
          fetchPriority="high"
        />
        <div className="editorial-hero-shade" aria-hidden="true" />

        <div className="editorial-hero-content">
          <div className="editorial-kicker">
            <span className="editorial-kicker-line" />
            WATER · LANDSCAPE · LIVING
          </div>
          <p className="editorial-overline">CRAFTED WITH EXPERIENCE SINCE {brand.since}</p>
          <h1>
            Where water meets
            <em>the art of living.</em>
          </h1>
          <p className="editorial-hero-description">
            Kami merancang, membangun, dan merawat ruang air serta lanskap
            yang menyatu dengan cara Anda hidup.
          </p>
          <div className="editorial-hero-actions">
            <Link className="editorial-button editorial-button-light" to="/portofolio">
              Jelajahi karya kami <ArrowUpRight size={17} />
            </Link>
            <a className="editorial-text-link" href="#cerita">
              Kenali CahyanaPool <ArrowDown size={15} />
            </a>
          </div>
        </div>

        <div className="editorial-hero-index" aria-hidden="true">
          <span>01</span>
          <span className="editorial-index-rule" />
          <span>EST. {brand.since}</span>
        </div>
        <div className="editorial-hero-caption">
          <span>RUANG YANG DIRANCANG UNTUK DINIKMATI</span>
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </section>

      <section className="editorial-intro section-pad" id="cerita">
        <div className="container editorial-intro-layout">
          <div className="editorial-section-label">
            <span className="editorial-number">01</span>
            <span className="editorial-label-rule" />
            <span>SEBUAH PENGALAMAN</span>
          </div>
          <div className="editorial-intro-main">
            <p className="editorial-overline">LEBIH DARI SEKADAR KOLAM</p>
            <h2>
              We shape spaces.
              <br />
              <em>You make them yours.</em>
            </h2>
            <div className="editorial-intro-bottom">
              <p>
                Sejak {brand.since}, CahyanaPool menghadirkan solusi menyeluruh
                untuk kolam renang dan taman—dari perencanaan, pembangunan,
                perawatan, hingga renovasi. Setiap detail dikerjakan dengan
                perhatian pada fungsi, ketahanan, dan rasa nyaman.
              </p>
              <div className="editorial-experience">
                <strong>{brand.since}</strong>
                <span>TAHUN MEMBANGUN<br />RUANG YANG BERARTI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-services section-pad" id="layanan">
        <div className="container">
          <div className="editorial-section-heading">
            <div>
              <div className="editorial-section-label">
                <span className="editorial-number">02</span>
                <span className="editorial-label-rule" />
                KEAHLIAN KAMI
              </div>
              <h2>Considered in every detail.<br /><em>Built to be lived in.</em></h2>
            </div>
            <p>Dari elemen air hingga lanskap, setiap layanan dirancang untuk bekerja sebagai satu kesatuan.</p>
          </div>

          <div className="editorial-service-list">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon] || Leaf;
              const href = getServiceWhatsApp(service.category);

              return (
                <article className="editorial-service-row" key={service.title}>
                  <span className="editorial-service-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="editorial-service-icon"><Icon size={26} strokeWidth={1.3} /></div>
                  <div className="editorial-service-copy">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <a
                    className="editorial-service-action"
                    href={href || '#kontak'}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noreferrer' : undefined}
                    aria-label={`Tanya tentang ${service.title}`}
                  >
                    <span>Konsultasikan</span><ArrowUpRight size={20} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-work section-pad">
        <div className="container">
          <div className="editorial-work-heading">
            <div>
              <div className="editorial-section-label">
                <span className="editorial-number">03</span>
                <span className="editorial-label-rule" />
                PILIHAN KARYA
              </div>
              <h2>Spaces made<br /><em>to stay with you.</em></h2>
            </div>
            <div className="editorial-work-aside">
              <p>Setiap proyek punya karakter. Temukan inspirasi dari karya yang telah kami bangun.</p>
              <Link className="editorial-inline-link" to="/portofolio">Lihat seluruh portofolio <ArrowUpRight size={17} /></Link>
            </div>
          </div>

          {featured.length > 0 ? (
            <PhotoGrid photos={featured} onSelect={openPhoto} variant="editorial" />
          ) : (
            <div className="empty-state">
              <h3>Portofolio sedang disiapkan</h3>
              <p>Dokumentasi proyek CahyanaPool akan tampil di sini.</p>
            </div>
          )}
        </div>
      </section>

      <section className="editorial-manifesto">
        <div className="container editorial-manifesto-inner">
          <span className="editorial-manifesto-mark">“</span>
          <p>A space is not just seen.<br /><em>It is felt, lived, and remembered.</em></p>
          <div className="editorial-manifesto-footer">
            <span>CAHYANAPOOL</span>
            <span>RUANG AIR, RUANG TUMBUH.</span>
          </div>
          <Droplets className="editorial-manifesto-icon" size={30} strokeWidth={1.2} />
        </div>
      </section>

      <ContactSection />

      <Lightbox
        photos={featured}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onChange={setLightboxIndex}
      />
    </>
  );
}
