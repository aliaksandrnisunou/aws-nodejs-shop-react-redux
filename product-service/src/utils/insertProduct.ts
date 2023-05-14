import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ProductBody } from "../createProduct";

const db = new DynamoDBClient({ region: process.env.REGION });

export async function insertProduct(product: ProductBody) {
    const { title, description, price, count } = product;

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

    return productId;
}