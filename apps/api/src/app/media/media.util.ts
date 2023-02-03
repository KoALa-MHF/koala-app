import { join } from 'path';
import { stat } from 'fs/promises';
import { ensureDir } from 'fs-extra';

const UPLOAD_MEDIA_FOLDER = join(process.cwd(), './uploads/media');

export function getFilePath(id: number, fileName: string): string {
  const mediaFolderPath = getMediaFolderPath(id);
  return `${mediaFolderPath}/${fileName}`;
}

export async function getFileSize(filePath: string): Promise<number> {
  const { size } = await stat(filePath);
  return size;
}

export function getMediaFolderPath(id: number): string {
  return `${UPLOAD_MEDIA_FOLDER}/${id}`;
}

export async function ensureMediaFolder(id: number): Promise<void> {
  await ensureDir(getMediaFolderPath(id));
}
