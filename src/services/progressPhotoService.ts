import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

const BUCKET_NAME = "progress-photos";

export type ProgressPhoto = {
  id: string;
  photoPath: string;
  note: string | null;
  photoDate: string;
  createdAt: string;
  signedUrl?: string;
};

export async function fetchProgressPhotos(): Promise<ProgressPhoto[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("progress_photos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const photos = await Promise.all(
    data.map(async (photo) => {
      const { data: signedData } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(photo.photo_path, 60 * 60);

      return {
        id: photo.id,
        photoPath: photo.photo_path,
        note: photo.note,
        photoDate: photo.photo_date,
        createdAt: photo.created_at,
        signedUrl: signedData?.signedUrl,
      };
    })
  );

  return photos;
}

export async function uploadProgressPhoto(uri: string, note: string) {
  const userId = await getCurrentUserId();

  const response = await fetch(uri);
  const blob = await response.blob();

  const filePath = `${userId}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: insertError } = await supabase.from("progress_photos").insert({
    user_id: userId,
    photo_path: filePath,
    note,
  });

  if (insertError) {
    throw insertError;
  }
}

export async function deleteProgressPhoto(photo: ProgressPhoto) {
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([photo.photoPath]);

  if (storageError) {
    throw storageError;
  }

  const { error: dbError } = await supabase
    .from("progress_photos")
    .delete()
    .eq("id", photo.id);

  if (dbError) {
    throw dbError;
  }
}