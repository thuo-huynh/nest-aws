import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log(configService.get('aws.accessKey'));
  console.log(configService.get('aws.secretKey'));
  console.log(configService.get('aws.region'));
  config.update({
    accessKeyId: configService.get('aws.accessKey'),
    secretAccessKey: configService.get('aws.secretKey'),
    region: configService.get('aws.region'),
  });
  await app.listen(3000);
}
bootstrap();
