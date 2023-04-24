import { APIGatewayProxyEvent } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from './utils/getSignedUrl';
import { successResponse } from './utils/apiResponseBuilder';

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
    const { REGION: region, BUCKET: bucket } = process.env;

    const file = event.queryStringParameters
        ? event.queryStringParameters['name']
        : undefined;

    if (!file) {
        return successResponse({ message: 'Mailformed payload' }, 400);
    }

    const s3client = new S3Client({region: region});
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: 'uploaded/' + file,
    });

    const url = await getSignedUrl(s3client, command, { expiresIn: 3600 });

    return successResponse({ url });
}