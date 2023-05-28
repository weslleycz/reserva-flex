import { Injectable } from '@nestjs/common';
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class GridFsService {
  private bucket: GridFSBucket;

  constructor() {
    this.connectToMongo();
  }
  private async connectToMongo() {
    const client = await MongoClient.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017/imagens?authSource=admin&retryWrites=true&w=majority`,
    );

    const db = client.db('imagens');
    this.bucket = new GridFSBucket(db);
  }

  async uploadFile(
    fileStream: NodeJS.ReadableStream,
    filename: string,
  ): Promise<ObjectId> {
    const uploadStream = this.bucket.openUploadStream(filename);
    return new Promise((resolve, reject) => {
      fileStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve(uploadStream.id));
    });
  }

  async getFileStream(fileId: ObjectId): Promise<NodeJS.ReadableStream> {
    return this.bucket.openDownloadStream(fileId);
  }
}
