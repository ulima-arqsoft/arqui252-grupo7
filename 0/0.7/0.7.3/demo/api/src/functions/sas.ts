import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { generateSASUrl } from '../lib/azure-storage.js';

export async function getGenerateSasToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  try {
    if (
      !process.env?.Azure_Storage_AccountName ||
      !process.env?.Azure_Storage_AccountKey
    ) {
      return { status: 405, jsonBody: 'Missing required app configuration' };
    }

    const containerName = request.query.get('container') || 'uploads';
    const fileName = request.query.get('file') || 'nonamefile';
    const permissions = request.query.get('permission') || 'w';
    const timerange = parseInt(request.query.get('timerange') || '5');

    const url = await generateSASUrl(
      process.env.Azure_Storage_AccountName as string,
      process.env.Azure_Storage_AccountKey as string,
      containerName,
      fileName,
      permissions,
      timerange
    );

    return { jsonBody: { url } };

  } catch (error) {
    context.log('SAS error:', error);
    return { status: 500, jsonBody: error };
  }
}

app.http('sas', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getGenerateSasToken
});
