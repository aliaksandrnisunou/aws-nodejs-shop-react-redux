import { SQSEvent } from 'aws-lambda';
import { successResponse, errorResponse } from './utils/apiResponseBuilder';
import { sendNotification } from './utils/sendNotification';
import { winstonLogger } from './utils/winstonLogger';
import { insertProduct } from './utils/insertProduct';

export const catalogBatchProcess = async (event: SQSEvent) => {
    winstonLogger.logRequest(`Incoming event: ${ JSON.stringify(event) }`);

    for (let i = 0; i < event.Records.length; i++) {
        try {
            const { body } = event.Records[i];

            const product = JSON.parse(body);

            await insertProduct(product);
            await sendNotification(product);
        } catch (err) {
            return errorResponse(err);
        }
    }

    winstonLogger.logRequest(`Lambda successfully invoked and finished.`);

    return successResponse({});
}
