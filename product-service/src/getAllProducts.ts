import { winstonLogger } from "./utils/winstonLogger";
import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import productsData from './data/products-data.json';

export const getAllProducts = async (event) => {
    try {
        winstonLogger.logRequest(`Incoming event: ${ JSON.stringify( event ) }`);

        const products = await Promise.resolve(productsData);

        winstonLogger.logRequest(`Received products: ${ JSON.stringify( products ) }`);

        return successResponse(products);
    } 
    catch (err) {
        return errorResponse(err);
    }
}
