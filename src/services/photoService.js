import { supabase } from '../lib/supabase';

const PRIVATE_BUCKET = 'portfolio';
const PUBLIC_BUCKET = 'portfolio-public';
const SIGNED_URL_SECONDS = 3600;

function throwIfError(error) {
  if (error) {
    throw new Error(error.message);
  }
}

function getBucket(status) {
  return status === 'published'
    ? PUBLIC_BUCKET
    : PRIVATE_BUCKET;
}

function makeStoragePath(file) {
  const safeName = file.name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-');

  return `photos/${crypto.randomUUID()}-${safeName}`;
}

async function getImageUrl(storagePath, status) {
  const bucket = getBucket(status);

  if (status === 'published') {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return data.publicUrl;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(
      storagePath,
      SIGNED_URL_SECONDS
    );

  throwIfError(error);

  return data.signedUrl;
}

/**
 * Mengambil unggulan berdasarkan kategori.
 *
 * Hasilnya berupa Map:
 * photo_id -> daftar category_id yang menjadikan
 * foto tersebut sebagai foto unggulan.
 */
async function getFeaturedByCategory() {
  const { data, error } = await supabase
    .from('featured_photos')
    .select('photo_id, category_id');

  throwIfError(error);

  const featuredByCategory = new Map();

  for (const item of data || []) {
    const categoryIds =
      featuredByCategory.get(item.photo_id) || [];

    categoryIds.push(item.category_id);

    featuredByCategory.set(
      item.photo_id,
      categoryIds
    );
  }

  return featuredByCategory;
}

async function mapPhoto(
  row,
  featuredByCategory = new Map()
) {
  const featuredCategories =
    featuredByCategory.get(row.id) || [];

  return {
    id: row.id,
    title: row.title,
    alt: row.alt_text,

    src: await getImageUrl(
      row.storage_path,
      row.status
    ),

    categories: (row.photo_categories || []).map(
      (item) => item.category_id
    ),

    status: row.status,

    // Kompatibilitas dengan kode yang masih memakai
    // status unggulan berbentuk boolean.
    featured: featuredCategories.length > 0,

    // Status unggulan khusus untuk setiap kategori.
    featuredCategories,

    order: row.sort_order,

    fileName: row.storage_path.split('/').pop(),

    storagePath: row.storage_path,
  };
}

async function loadPhotos(publishedOnly) {
  let query = supabase
    .from('photos')
    .select('*, photo_categories(category_id)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  throwIfError(error);

  const featuredByCategory =
    await getFeaturedByCategory();

  return Promise.all(
    (data || []).map((row) =>
      mapPhoto(row, featuredByCategory)
    )
  );
}

async function moveBetweenBuckets(
  path,
  fromBucket,
  toBucket
) {
  const { data: file, error: downloadError } =
    await supabase.storage
      .from(fromBucket)
      .download(path);

  throwIfError(downloadError);

  const { error: uploadError } =
    await supabase.storage
      .from(toBucket)
      .upload(path, file, {
        contentType:
          file.type || 'application/octet-stream',
        upsert: false,
      });

  throwIfError(uploadError);
}

async function saveCategories(photoId, categoryIds) {
  const { error: deleteError } = await supabase
    .from('photo_categories')
    .delete()
    .eq('photo_id', photoId);

  throwIfError(deleteError);

  const uniqueIds = [
    ...new Set(categoryIds || []),
  ];

  if (!uniqueIds.length) {
    return;
  }

  const { error } = await supabase
    .from('photo_categories')
    .insert(
      uniqueIds.map((categoryId) => ({
        photo_id: photoId,
        category_id: categoryId,
      }))
    );

  throwIfError(error);
}

async function saveFeatured(
  photoId,
  categoryIds,
  featured
) {
  // Hapus status unggulan lama untuk foto ini.
  const { error: deleteError } = await supabase
    .from('featured_photos')
    .delete()
    .eq('photo_id', photoId);

  throwIfError(deleteError);

  if (!featured || !categoryIds?.length) {
    return;
  }

  // Simpan unggulan untuk kategori yang dipilih.
  const { error } = await supabase
    .from('featured_photos')
    .upsert(
      [...new Set(categoryIds)].map(
        (categoryId) => ({
          category_id: categoryId,
          photo_id: photoId,
          updated_at: new Date().toISOString(),
        })
      ),
      {
        onConflict: 'category_id',
      }
    );

  throwIfError(error);
}

export const photoService = {
  async getAll() {
    return loadPhotos(false);
  },

  async getPublished() {
    return loadPhotos(true);
  },

  async save(photo) {
    const file = photo.file || null;

    const desiredStatus =
      photo.status === 'published'
        ? 'published'
        : 'draft';

    let existing = null;

    if (photo.id) {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photo.id)
        .maybeSingle();

      throwIfError(error);

      existing = data;
    }

    const oldPath =
      existing?.storage_path || null;

    const oldBucket = existing
      ? getBucket(existing.status)
      : null;

    const newPath = file
      ? makeStoragePath(file)
      : oldPath;

    if (!newPath) {
      throw new Error(
        'Pilih file foto terlebih dahulu.'
      );
    }

    const targetBucket =
      getBucket(desiredStatus);

    let uploadedNewFile = false;
    let movedExistingFile = false;

    try {
      if (file) {
        const { error } = await supabase.storage
          .from(targetBucket)
          .upload(newPath, file, {
            contentType:
              file.type || 'application/octet-stream',
            upsert: false,
          });

        throwIfError(error);

        uploadedNewFile = true;
      } else if (
        existing &&
        oldBucket !== targetBucket
      ) {
        await moveBetweenBuckets(
          oldPath,
          oldBucket,
          targetBucket
        );

        movedExistingFile = true;
      }

      const row = {
        title: (
          photo.title ||
          file?.name ||
          existing?.title ||
          'Foto portofolio'
        ).trim(),

        alt_text: (
          photo.alt ||
          photo.alt_text ||
          photo.title ||
          existing?.alt_text ||
          'Foto portofolio CahyanaPool'
        ).trim(),

        storage_path: newPath,

        status: desiredStatus,

        sort_order: Number(
          photo.order ??
          existing?.sort_order ??
          0
        ),

        updated_at: new Date().toISOString(),
      };

      let saved;

      if (existing) {
        const { data, error } = await supabase
          .from('photos')
          .update(row)
          .eq('id', existing.id)
          .select('*')
          .single();

        throwIfError(error);

        saved = data;
      } else {
        const { data: authData } =
          await supabase.auth.getUser();

        const { data, error } = await supabase
          .from('photos')
          .insert({
            ...row,
            created_by: authData.user?.id || null,
          })
          .select('*')
          .single();

        throwIfError(error);

        saved = data;
      }

      await saveCategories(
        saved.id,
        photo.categories || []
      );

      await saveFeatured(
        saved.id,
        photo.categories || [],
        Boolean(photo.featured)
      );

      // Hapus file lama setelah metadata berhasil
      // disimpan dan file tujuan sudah tersedia.
      if (
        existing &&
        oldPath &&
        (file || oldBucket !== targetBucket)
      ) {
        const { error: removeError } =
          await supabase.storage
            .from(oldBucket)
            .remove([oldPath]);

        throwIfError(removeError);
      }

      const photos = await this.getAll();

      return photos.find(
        (item) => item.id === saved.id
      );
    } catch (error) {
      // Bersihkan file tujuan jika proses penyimpanan
      // gagal. Jangan menghapus file sumber di sini.
      if (
        uploadedNewFile ||
        movedExistingFile
      ) {
        await supabase.storage
          .from(targetBucket)
          .remove([newPath])
          .catch(() => {});
      }

      throw error;
    }
  },

  async remove(id) {
    const { data: row, error } = await supabase
      .from('photos')
      .select('storage_path, status')
      .eq('id', id)
      .single();

    throwIfError(error);

    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    throwIfError(deleteError);

    const { error: storageError } =
      await supabase.storage
        .from(getBucket(row.status))
        .remove([row.storage_path]);

    if (storageError) {
      throw new Error(
        'Metadata terhapus, tetapi file Storage ' +
        `gagal dihapus: ${storageError.message}`
      );
    }
  },

  async replaceAll() {
    throw new Error(
      'replaceAll tidak tersedia pada mode Supabase. ' +
      'Simpan foto satu per satu.'
    );
  },

  async resetToOriginal() {
    throw new Error(
      'Reset foto lokal dinonaktifkan agar data ' +
      'Supabase tidak terhapus.'
    );
  },
};