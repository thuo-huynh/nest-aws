import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

type File = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};
export const imageFileFilter = (
  req: Request,
  file: File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif|avif)$/)) {
    return callback(
      new BadRequestException('おいおい、画像だけを送ってくれよな？'),
      false,
    );
  }
  callback(null, true);
};
