import sinon from 'sinon';
import { importProductsFile } from '../index';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as getSignedUrl from '../utils/getSignedUrl';
import { successResponse } from '../utils/apiResponseBuilder';

describe('importProductsFile handler', () => {
    it('should return 400 code if no filename is provided', async () => {
        process.env = {
            BUCKET: 'awsshoptest',
            REGION: 'us-east-1'
        }
        // @ts-ignore
        const event: APIGatewayProxyEvent = {
            queryStringParameters: {}
        }
        const res = await importProductsFile(event);
        expect(res).toStrictEqual(
            successResponse({
                message: 'Mailformed payload',
            }, 400)
        )
    });

    it('should return 200 code if signed url was generated successfully', async () => {
        process.env = {
            BUCKET: '1',
            REGION: '1'
        }
        const fileName = 'test.csv';
        // @ts-ignore
        const event: APIGatewayProxyEvent = {
            queryStringParameters: {
                name: fileName
            }
        }
        const signedUrl = "https://awsbucket/test.csv";

        const stub = sinon.stub(getSignedUrl, 'getSignedUrl')
            .callsFake(async () => {
                return signedUrl;
            });
        const result = await importProductsFile(event);
        expect(stub.calledOnce).toBeTruthy();
        expect(result).toStrictEqual(successResponse({ url: signedUrl }));
    });
});