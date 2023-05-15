import { winstonLogger } from "./utils/winstonLogger";
import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
// import { DynamoDBClient, ScanCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
// import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import products from './data/products-data.json';

export const getAllProducts = async (event) => {
    try {
        // winstonLogger.logRequest(`Incoming event: ${ JSON.stringify( event ) }`);

        // const db = new DynamoDBClient({})
        // const { Items } = await db.send(new ScanCommand({
        //     TableName: process.env.PRODUCTS_TABLE
        // }));

        // const products = await Promise.all(Items.map(async (item) => {
        //     const parsedItem = unmarshall(item);
        //     const { Item: stock } = await db.send(new GetItemCommand({
        //         TableName: process.env.STOCKS_TABLE,
        //         Key: marshall({
        //             product_id: parsedItem.id,
        //         }),
        //     }));

        //     return { ...parsedItem, ...unmarshall(stock) }
        // }));

        winstonLogger.logRequest(`Received products: ${ JSON.stringify( products ) }`);

        return successResponse(products);
    }
    catch (err) {
        return errorResponse(err);
    }
}
