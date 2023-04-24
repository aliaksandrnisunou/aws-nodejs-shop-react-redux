import csv from 'csv-parser';
import type { Readable } from 'stream';
import { Callback, Context, S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { winstonLogger } from './utils/winstonLogger';
import { moveFileToDirectory } from './utils/moveFileToDirectory';

export const importFileParser = async (event: S3Event, _context: Context, callback: Callback): Promise<void> => {
    try {
        winstonLogger.logRequest(`Incoming event: ${ JSON.stringify(event) }`);

        const s3client = new S3Client({ region: process.env.REGION });
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const params = {
            Bucket: bucket,
            Key: key,
        };

        const result = await s3client.send(new GetObjectCommand(params));

        if (result.Body) {
            const stream = result.Body as Readable;
            const promise = new Promise((resolve, reject) => {
                stream
                    .pipe(csv())
                    .on('data', async (data) => {
                        winstonLogger.logRequest(data);
                    })
                    .on('close', () => {
                        callback();
                        resolve(1);
                    })
                    .on('error', () => {
                        callback();
                        reject();
                    })
                    .on('end', async () => {
                        await moveFileToDirectory(s3client, bucket, key, 'uploaded', 'parsed');

                        callback();
                        resolve(1);
                    });
            });

            await promise;
        }

        winstonLogger.logRequest('File parsed successfully');
    } 
    catch (err) {
        winstonLogger.logRequest(`Error getting object from bucket.`);
        throw new Error(`Error getting object from bucket.`)
    }
}
