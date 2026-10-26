import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { emptyDir, ensureDir, exists } from 'fs-extra';
import { NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { config } from '../config/config.module';
import { Media } from './entities/media.entity';

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

export async function sendMediaFile(media: Media | undefined, res: Response): Promise<void> {
  // external media (e.g. YouTube) has no file which could be sent
  if (!media || media.mimeType.startsWith('external/')) {
    throw new NotFoundException();
  }

  const filePath = getFilePath(media.id, media.name);

  let size: number;
  try {
    size = await getFileSize(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new NotFoundException();
    }
    throw error;
  }

  res.set({
    'Content-Type': media.mimeType,
    'Content-length': size,
    'Cache-Control': 'no-cache',
  });

  createReadStream(filePath).pipe(res);
}
