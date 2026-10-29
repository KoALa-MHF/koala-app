import { join } from 'path';
import { FileHandle, open } from 'fs/promises';
import { pipeline } from 'stream/promises';
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

  // the file is opened first, so it stays readable even if it gets deleted (e.g. replaced) while it is sent
  let file: FileHandle;
  try {
    file = await open(getFilePath(media.id, media.name));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new NotFoundException();
    }
    throw error;
  }

  let size: number;
  try {
    ({ size } = await file.stat());
  } catch (error) {
    await file.close();
    throw error;
  }

  res.set({
    'Content-Type': media.mimeType,
    'Content-length': size,
    'Cache-Control': 'no-cache',
  });

  // errors while streaming must not crash the server, an aborted request (e.g. by seeking in the player) is expected
  await pipeline(file.createReadStream(), res).catch((error) => {
    if (error.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      console.log(error);
    }
  });
}
