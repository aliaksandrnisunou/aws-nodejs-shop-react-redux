import { winstonLogger } from "./utils/winstonLogger";
import { errorResponse, successResponse } from "./utils/apiResponseBuilder";
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";

type ProductBody = {
    id: number;
    title: string;
    description: string;
    price: number;
    count: number;
}

export const createProduct = async (event) => {
    try {
        const db = new DynamoDBClient({});
        const { title, description, price, count }: ProductBody = JSON.parse(event.body) as any as ProductBody;

        winstonLogger.logRequest(`Incoming event: ${ JSON.stringify( event ) }`);

        if (!title || !description || !price || !count) {
            return successResponse({ message: 'Mailformed payload' }, 400);
        }
        
        const productId = uuidv4();

        await db.send(new TransactWriteItemsCommand({
            ReturnItemCollectionMetrics: 'NONE',
            ReturnConsumedCapacity: 'TOTAL',
            TransactItems: [
                {
                    Put: {
                        TableName: process.env.PRODUCTS_TABLE,
                        Item: {
                            id: { S: productId },
                            title: { S: title },
                            description: { S: description },
                            price: { N: `${price}` },
                        },
                    },
                },
                {
                    Put: {
                        TableName: process.env.STOCKS_TABLE,
                        Item: {
                            product_id: { S: productId },
                            count: { N: `${count}` },
                        },
                    },
                },
            ],
        }));

        winstonLogger.logRequest(`Created product: ${ JSON.stringify(productId) }`);

        return successResponse({ id: productId });
    } 
    catch (err) {
        return errorResponse(err);
    }
}
