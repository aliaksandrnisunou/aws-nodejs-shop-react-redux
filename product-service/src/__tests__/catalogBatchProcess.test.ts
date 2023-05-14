import { SQSEvent } from 'aws-lambda';
import { catalogBatchProcess } from '../catalogBatchProcess';
import { mockClient } from 'aws-sdk-client-mock';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const snsMock = mockClient(SNSClient);

process.env = {
    PRODUCTS_TABLE: 'products',
    STOCKS_TABLE: 'stocks',
    SNS_TOPIC: 'topic'
}

const dynamoDBMock = mockClient(DynamoDBDocumentClient);
dynamoDBMock.on(PutCommand).callsFake((input) => {
    if (!input.Item.title) {
        throw new Error('Error')
    } else {
        return {}
    }
}).on(PutCommand, { TableName: 'stocks' }).resolves({
    Attributes: undefined,
    ItemCollectionMetrics: undefined,
})

snsMock
    .on(PublishCommand)
    .callsFake((input) => {
        if(!input.TopicArn) {
            throw new Error('Not topic');
        }
        return {
            $metadata: {}
        }
})


describe('catalogBatchProcess handler', () => {
    it('should return 200 code if no errors during processing', async () => {
        const event: SQSEvent = {
            Records: []
        }

        const result = await catalogBatchProcess(event);
        expect(result.statusCode).toEqual(200);
    })

    it('should return 500 code if passed invalid body', async () => {
        const event: SQSEvent = {
            Records: [
                // @ts-ignore
                {
                    body: 'test',
                    eventSource: '',
                    awsRegion: '',
                    receiptHandle: '',
                    messageId: '',
                    md5OfBody: '',
                    eventSourceARN: '',
                }
            ]
        }
        const result = await catalogBatchProcess(event);
        expect(result.statusCode).toEqual(500);
    })

    it('should return 200 code if message send success', async () => {
        const event: SQSEvent = {
            Records: [
                // @ts-ignore
                {
                    body: JSON.stringify({
                        'title': 'test',
                        'description': 'test',
                        'count': 5,
                        'price': 5
                    }),
                }
            ]
        }
        const result = await catalogBatchProcess(event);
        expect(result.statusCode).toEqual(200);
    })

    it('should return 500 code if messages send unsuccess', async () => {
        const event: SQSEvent = {
            Records: [
                // @ts-ignore
                {
                    body: JSON.stringify({
                        'title': 'test',
                        'description': 'test',
                        'count': 5,
                        'price': 5
                    }),
                }
            ]
        }

        process.env.SNS_TOPIC = '';
        const result = await catalogBatchProcess(event);
        expect(result.statusCode).toEqual(500);
    })
});