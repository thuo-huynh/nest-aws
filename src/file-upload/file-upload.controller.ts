import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { response } from 'express';
import { FileUploadService } from './file-upload.service';
import { imageFileFilter } from './interceptor/interceptor';
import { PublicFile } from './dto/public-file.dto';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() request, @UploadedFile() file: Express.Multer.File) {
    try {
      await this.fileUploadService.uploadFile(file.buffer, file.originalname);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }

  @Post('uploads')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 4 }], {
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 * 4 },
    }),
  )
  async uploadFiles(
    @UploadedFiles()
    params: {
      files: Array<Express.Multer.File>;
    },
  ): Promise<PublicFile[]> {
    return await this.fileUploadService.uploadFiles(params.files);
  }

  @Get('preSignedUrlForPut')
  async getPreSignedUrlForPut(@Req() request) {
    return this.fileUploadService.getPreSignedUrlForPut(request.query.fileName);
  }

  @Get('preSignedUrlForGet')
  async getPreSignedUrlForGet(@Req() request) {
    const key = request.query.key;
    return this.fileUploadService.getPreSignedUrlForGet(key);
  }
}
