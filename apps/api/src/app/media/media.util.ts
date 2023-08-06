import { join } from 'path';
import { stat } from 'fs/promises';
import { emptyDir, ensureDir, exists } from 'fs-extra';
import { config } from '../config/config.module';

const MEDIA_FOLDER = '/media';
const UPLOAD_MEDIA_FOLDER = join(process.cwd(), config.uploadFolderPath + MEDIA_FOLDER);

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

export async function clearMediaFolder(): Promise<void> {
  const mediaFolderExists = await exists(UPLOAD_MEDIA_FOLDER);
  if (mediaFolderExists) {
    await emptyDir(UPLOAD_MEDIA_FOLDER);
  }
}
