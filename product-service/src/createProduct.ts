import { winstonLogger } from './utils/winstonLogger';
import { errorResponse, successResponse } from './utils/apiResponseBuilder';
import { insertProduct } from './utils/insertProduct';

export type ProductBody = {
    id?: string;
    title: string;
    description: string;
    price: number;
    count: number;
}

export const createProduct = async (event) => {
    winstonLogger.logRequest(`Incoming event: ${ JSON.stringify( event ) }`);

    try {
        const { title, description, price, count }: ProductBody = JSON.parse(event.body) as any as ProductBody;

        if (!title || !description || !price || !count) {
            return successResponse({ message: 'Mailformed payload' }, 400);
        }
        
        const productId = await insertProduct({ title, description, price, count });

        winstonLogger.logRequest(`Created product: ${ JSON.stringify(productId) }`);

        return successResponse({ id: productId });
    } 
    catch (err) {
        return errorResponse(err);
    }
}
