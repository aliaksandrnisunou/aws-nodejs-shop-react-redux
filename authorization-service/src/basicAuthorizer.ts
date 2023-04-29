import { Context } from 'aws-lambda';
import { winstonLogger } from './utils/winstonLogger';

const generatePolicy = (principalId: string, resource: string, effect = 'Allow') => ({
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                }
            ]
        }
    });

export const basicAuthorizer = async (event, _context: Context): Promise<any> => {
    winstonLogger.logRequest(`Incoming event: ${ JSON.stringify(event) }`);

    const clientToken = event.authorizationToken;

    const encodedCredentials = clientToken.split(' ')[1];
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const plainCredentials = buffer.toString('utf-8').split(':');

    const username = plainCredentials[0];
    const password = plainCredentials[1];

    const envPassword = process.env[username];

    const effect = !envPassword || envPassword !== password ? 'Deny' : 'Allow';

    winstonLogger.logRequest(effect);

    return generatePolicy(encodedCredentials, event.methodArn, effect);
}
