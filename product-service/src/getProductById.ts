import { winstonLogger } from "./utils/winstonLogger";
import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import productsData from './data/products-data.json';

export const getProductById = async (event) => {
    try {
        winstonLogger.logRequest(`Incoming event: ${ JSON.stringify( event ) }`);

        const { productId = '' } = event.pathParameters;

        const product = await Promise.resolve(productsData.find(item => item.id === productId));

        winstonLogger.logRequest(`Received product with id: ${ productId }: ${ JSON.stringify( product ) }`);
        
        if(product)
            return successResponse(product);

        return successResponse({ message: 'Product not found' }, 404);
    }
    catch (err) {
        return errorResponse( err );
    }
}
