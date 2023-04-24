import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: process.env.REGION });

export async function sendSQSEvent(product: any) {
    const params = {
        MessageGroupId: 'products',
        MessageBody: JSON.stringify(product),
        QueueUrl: process.env.SQS_URL,
    };

    await sqsClient.send(new SendMessageCommand(params));
}