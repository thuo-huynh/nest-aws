import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PublicFile } from './dto/public-file.dto';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('aws.s3BucketName'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    console.log('Key:', uploadResult.Key);
    console.log('url:', uploadResult.Location);
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<PublicFile[]> {
    const s3 = new S3();
    console.log('length: ', files.length);
    const publicFiles: PublicFile[] = [];
    for (const file of files) {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('aws.s3BucketName'),
          Body: file.buffer,
          Key: `${uuid()}-${file.originalname}`,
        })
        .promise();
      console.log(`${file.originalname} の Key: ${uploadResult.Key}`);
      console.log(`${file.originalname} の Location: ${uploadResult.Location}`);
      publicFiles.push({
        originalname: file.originalname,
        key: uploadResult.Key,
        location: uploadResult.Location,
      });
    }
    return publicFiles;
  }

  async getPreSignedUrlForPut(filename: string) {
    const s3 = new S3();
    const key = `${uuid()}-${filename}`;
    const params = {
      Bucket: this.configService.get('aws.s3BucketName'),
      Key: key,
      Expires: 60 * 5,
    };
    const url = s3.getSignedUrl('putObject', params);
    return {
      key,
      preSignedUrl: url,
    };
  }

  async getPreSignedUrlForGet(key: string) {
    const s3 = new S3();
    const params = {
      Bucket: this.configService.get('aws.s3BucketName'),
      Key: key,
      Expires: 60 * 5,
    };
    const url = s3.getSignedUrl('getObject', params);
    return {
      key,
      preSignedUrl: url,
    };
  }
}
