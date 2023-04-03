import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductById } from '../getProductById';
import productsData from '../data/products-data.json';

describe('getProductById handler', () => {
    it('should return existing product', async () => {
        const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: productId
            }
        } as any

        const product = await getProductById(event);
        const expectedProduct = productsData.find(item => item.id === productId);
    
        expect(product.statusCode).toEqual(200);
        expect(product.body).toEqual(JSON.stringify(expectedProduct));
    });

    it('should return 404 error if product not found', async () => {
        const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa1';
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                productId: productId
            }
        } as any

        const product = await getProductById(event);

        expect(product.statusCode).toEqual(404);
        expect(product.body).toEqual(JSON.stringify({
            message: `Product not found`
        }));
    });
});
