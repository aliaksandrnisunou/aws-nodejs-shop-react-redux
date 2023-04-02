import { APIGatewayProxyEvent } from 'aws-lambda';
import { getAllProducts } from '../getAllProducts';
import productsData from '../data/products-data.json';

describe('getAllProducts handler', () => {
    it('should return list of products', async () => {
        const event: APIGatewayProxyEvent = {} as any;
        const products = await getAllProducts(event);

        expect(products.statusCode).toEqual(200);
        expect(products.body).toEqual(JSON.stringify(productsData));
    });
});
