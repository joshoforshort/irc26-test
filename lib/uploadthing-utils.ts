import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadThingFiles(images: any[] | null | undefined): Promise<void> {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return;
  }

  const fileKeys = images
    .filter((img) => img && typeof img === 'object' && img.key)
    .map((img) => img.key as string);

  if (fileKeys.length === 0) {
    return;
  }

  try {
    await utapi.deleteFiles(fileKeys);
    console.log(`Deleted ${fileKeys.length} file(s) from UploadThing`);
  } catch (error) {
    console.error('Error deleting files from UploadThing:', error);
  }
}
