import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

type PublishParams = {
    MessageAttributes: any,
    Message: string;
    TopicArn?: string;
}

const snsClient = new SNSClient({ apiVersion: '2010-03-31', region: process.env.REGION });

export async function sendNotification(product: any) {
    const params: PublishParams = {
        MessageAttributes: {
            productPrice: {
                DataType: 'String',
                StringValue: `${product.price}`
            },
            productCount: {
                DataType: 'String',
                StringValue: `${product.count}`
            }
        },
        Message: `New product created: Title: ${product.title}, Price: ${product.price}, Count: ${product.count}`,
        TopicArn: process.env.SNS_TOPIC
    };

    await snsClient.send(new PublishCommand(params));
}