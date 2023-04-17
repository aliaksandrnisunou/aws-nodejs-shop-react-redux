import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function moveFileToDirectory(s3: S3Client, bucket: string, file: string, sourceFolder: string, destFolder: string) {
    const [_, fileName] = file.split('/');

    try {
        await s3.send(new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${sourceFolder}/${fileName}`,
            Key: `${destFolder}/${fileName}`
        }));
        await s3.send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: `${sourceFolder}/${fileName}`
        }));
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}