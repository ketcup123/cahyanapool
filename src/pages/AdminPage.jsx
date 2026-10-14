
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  LogIn,
  LogOut,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import { photoService } from '../services/photoService';
import { categories } from '../data/config';
import PhotoGrid from '../components/PhotoGrid';

const emptyForm = {
  id: null,
  title: '',
  alt: '',
  categories: [],
  status: 'draft',
  featured: false,
  order: 0,
  file: null,
};

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const verifyAdmin = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      return false;
    }

    const { data, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authUser.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !data) {
      await supabase.auth.signOut();
      setUser(null);
      setError(
        roleError
          ? `Gagal memeriksa hak admin: ${roleError.message}`
          : 'Akun ini tidak memiliki hak admin.'
      );
      return false;
    }

    setUser(authUser);
    setError('');
    return true;
  }, []);

  const refreshPhotos = useCallback(async () => {
    const result = await photoService.getAll();
    setPhotos(result);
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (data.session?.user) {
          await verifyAdmin(data.session.user);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Gagal memeriksa sesi login.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setPhotos([]);
        setForm(emptyForm);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [verifyAdmin]);

  useEffect(() => {
    if (!user) return;

    let active = true;

    photoService.getAll()
      .then((result) => {
        if (active) setPhotos(result);
      })
      .catch((err) => {
        if (active) {
          setError(`Gagal memuat foto: ${err.message}`);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleCategory(categoryId) {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(categoryId)
        ? current.categories.filter((id) => id !== categoryId)
        : [...current.categories, categoryId],
    }));
  }

  function editPhoto(photo) {
    setForm({
      id: photo.id,
      title: photo.title || '',
      alt: photo.alt || '',
      categories: photo.categories || [],
      status: photo.status,
      featured: Boolean(photo.featured),
      order: photo.order ?? 0,
      file: null,
    });

    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setError('');
    setNotice('');
  }

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) throw loginError;

      const authorized = await verifyAdmin(data.user);

      if (!authorized) setPassword('');
    } catch (err) {
      setError(
        err.message || 'Login gagal. Periksa email dan password.'
      );
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (!form.id && !form.file) {
        throw new Error('Pilih file foto terlebih dahulu.');
      }

      if (!form.title.trim()) {
        throw new Error('Judul foto wajib diisi.');
      }

      if (!form.alt.trim()) {
        throw new Error('Teks alternatif foto wajib diisi.');
      }

      if (!form.categories.length) {
        throw new Error('Pilih minimal satu kategori.');
      }

      await photoService.save({
        ...form,
        title: form.title.trim(),
        alt: form.alt.trim(),
        order: Number(form.order) || 0,
      });

      await refreshPhotos();

      setForm({ ...emptyForm });
      setNotice(
        form.id
          ? 'Perubahan foto berhasil disimpan.'
          : 'Foto berhasil diunggah dan disimpan.'
      );
    } catch (err) {
      setError(err.message || 'Gagal menyimpan foto.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(photo) {
    const confirmed = window.confirm(
      `Hapus foto "${photo.title || photo.alt}"? Tindakan ini tidak bisa dibatalkan.`
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      await photoService.remove(photo.id);

      if (form.id === photo.id) {
        setForm({ ...emptyForm });
      }

      await refreshPhotos();
      setNotice('Foto berhasil dihapus.');
    } catch (err) {
      setError(err.message || 'Gagal menghapus foto.');
      try {
        await refreshPhotos();
      } catch {
        // Pertahankan pesan error utama.
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setError('');

    try {
      const { error: logoutError } =
        await supabase.auth.signOut();

      if (logoutError) throw logoutError;

      setUser(null);
      setPhotos([]);
      setForm({ ...emptyForm });
      setPassword('');
    } catch (err) {
      setError(err.message || 'Logout gagal.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-setup-page">
      <div
        className="admin-setup-card"
        style={{ maxWidth: user ? 1000 : 480, width: '100%' }}
      >
        <p className="eyebrow">CAHYANAPOOL · ADMINISTRASI</p>
        <h1>Panel pengelolaan konten</h1>

        {loading ? (
          <p role="status">
            <LoaderCircle size={18} /> Memeriksa sesi admin...
          </p>
        ) : !user ? (
          <form onSubmit={handleLogin}>
            <p className="admin-setup-lead">
              Login menggunakan akun admin CahyanaPool.
            </p>

            <label htmlFor="admin-email">Email admin</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ boxSizing: 'border-box', width: '100%', padding: 12, margin: '8px 0 16px' }}
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ boxSizing: 'border-box', width: '100%', padding: 12, margin: '8px 0 16px' }}
            />

            {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}

            <button
              type="submit"
              className="button button-primary"
              disabled={submitting}
            >
              <LogIn size={17} />
              {submitting ? 'Memeriksa...' : 'Login sebagai admin'}
            </button>
          </form>
        ) : (
          <>
            <p className="admin-setup-lead">
              Login sebagai <strong>{user.email}</strong>
            </p>

            {error && (
              <p role="alert" style={{ color: '#b42318' }}>
                {error}
              </p>
            )}

            {notice && (
              <p role="status" style={{ color: '#18794e' }}>
                {notice}
              </p>
            )}

            <form onSubmit={handleSave} style={{ textAlign: 'left', marginTop: 24 }}>
              <h2>{form.id ? 'Edit foto' : 'Tambah foto'}</h2>

              <label htmlFor="photo-file">File foto {form.id ? '(opsional jika tidak mengganti file)' : ''}</label>
              <input
                id="photo-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!form.id}
                onChange={(e) => updateForm('file', e.target.files?.[0] || null)}
                style={{ display: 'block', width: '100%', margin: '8px 0 18px' }}
              />

              <label htmlFor="photo-title">Judul foto</label>
              <input
                id="photo-title"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                required
                maxLength={160}
                style={{ boxSizing: 'border-box', width: '100%', padding: 12, margin: '8px 0 16px' }}
              />

              <label htmlFor="photo-alt">Teks alternatif (alt)</label>
              <input
                id="photo-alt"
                value={form.alt}
                onChange={(e) => updateForm('alt', e.target.value)}
                required
                maxLength={250}
                style={{ boxSizing: 'border-box', width: '100%', padding: 12, margin: '8px 0 16px' }}
              />

              <fieldset style={{ margin: '8px 0 18px', padding: 12 }}>
                <legend>Kategori foto</legend>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    style={{ display: 'flex', gap: 8, margin: '10px 0' }}
                  >
                    <input
                      type="checkbox"
                      checked={form.categories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    {category.label}
                  </label>
                ))}
              </fieldset>

              <label htmlFor="photo-status">Status publikasi</label>
              <select
                id="photo-status"
                value={form.status}
                onChange={(e) => updateForm('status', e.target.value)}
                style={{ display: 'block', width: '100%', padding: 12, margin: '8px 0 16px' }}
              >
                <option value="draft">Draft — hanya admin</option>
                <option value="published">Published — tampil di website</option>
              </select>

              <label htmlFor="photo-order">Urutan foto</label>
              <input
                id="photo-order"
                type="number"
                value={form.order}
                onChange={(e) => updateForm('order', e.target.value)}
                style={{ display: 'block', width: '100%', padding: 12, margin: '8px 0 16px' }}
              />

              <label style={{ display: 'flex', gap: 8, margin: '12px 0 20px' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm('featured', e.target.checked)}
                />
                Jadikan foto unggulan pada kategori yang dipilih
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={submitting}
                >
                  {submitting ? <LoaderCircle size={17} /> : <Save size={17} />}
                  {submitting ? 'Menyimpan...' : 'Simpan foto'}
                </button>

                <button
                  type="button"
                  className="button"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  <X size={17} /> Bersihkan formulir
                </button>

                <button
                  type="button"
                  className="button"
                  onClick={() => refreshPhotos().catch((err) => setError(err.message))}
                  disabled={submitting}
                >
                  <RefreshCw size={17} /> Muat ulang
                </button>
              </div>
            </form>

            <section style={{ textAlign: 'left', marginTop: 36 }}>
              <h2>Daftar foto ({photos.length})</h2>

              {photos.length > 0 ? (
                <PhotoGrid
                  photos={photos}
                  showStatus
                  onSelect={editPhoto}
                  onEdit={editPhoto}
                />
              ) : (
                <p>Belum ada foto di database Supabase.</p>
              )}

              {photos.map((photo) => (
                <div
                  key={`actions-${photo.id}`}
                  style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0 16px' }}
                >
                  <span style={{ flex: 1 }}>{photo.title}</span>
                  <button
                    type="button"
                    className="button"
                    onClick={() => editPhoto(photo)}
                    disabled={submitting}
                  >
                    <Save size={15} /> Edit
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => handleDelete(photo)}
                    disabled={submitting}
                  >
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              ))}

            </section>

            <button
              type="button"
              className="button"
              onClick={handleLogout}
              disabled={submitting}
              style={{ marginTop: 24 }}
            >
              <LogOut size={17} /> Logout
            </button>
          </>
        )}

        <Link
          to="/"
          className="button"
          style={{ marginTop: 20, display: 'inline-flex' }}
        >
          <ArrowLeft size={17} /> Kembali ke website
        </Link>
      </div>
    </main>
  );
}
