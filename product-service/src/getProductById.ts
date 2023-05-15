import { winstonLogger } from "./utils/winstonLogger";
import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import products from './data/products-data.json';
// import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
//import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const getProductById = async (event) => {
    try {
        winstonLogger.logRequest(`Incoming event: ${ JSON.stringify( event ) }`);

        const { productId = '' } = event.pathParameters;

        // const db = new DynamoDBClient({})
        // const { Item: product } = await db.send(new GetItemCommand({
        //     TableName: process.env.PRODUCTS_TABLE,
        //     Key: marshall({
        //         id: productId,
        //     }),
        // }));

        // const { Item: stock } = await db.send(new GetItemCommand({
        //     TableName: process.env.STOCKS_TABLE,
        //     Key: marshall({
        //         product_id: productId,
        //     }),
        // }));

        // winstonLogger.logRequest(`Received product with id: ${ productId }: ${ JSON.stringify( unmarshall(product) ) }`);
        const parsedProduct = products.filter((i) => i.id === productId)

        if (parsedProduct)
            return successResponse({ parsedProduct });
        // if(product)
            // return successResponse({ ...unmarshall(product), ...unmarshall(stock) });

        return successResponse({ message: 'Product not found' }, 404);
    }
    catch (err) {
        return errorResponse(err);
    }
}
