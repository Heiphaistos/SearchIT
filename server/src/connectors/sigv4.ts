import { createHash, createHmac } from 'node:crypto';

// Signature AWS Signature Version 4, telle qu'exigée par Amazon PA-API 5.0.

export interface SigV4Params {
  accessKey: string;
  secretKey: string;
  region: string;
  service: string;
  host: string;
  path: string;
  body: string;
  headers: Record<string, string>;
  date?: Date;
}

function sha256Hex(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex');
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

export function amzDate(date: Date): { amzDate: string; dateStamp: string } {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  return { amzDate: iso, dateStamp: iso.slice(0, 8) };
}

/** Renvoie les en-têtes complets (dont Authorization et X-Amz-Date) à envoyer. */
export function signV4(p: SigV4Params): Record<string, string> {
  const { amzDate: xAmzDate, dateStamp } = amzDate(p.date ?? new Date());
  const headers: Record<string, string> = { ...p.headers, host: p.host, 'x-amz-date': xAmzDate };
  const lower = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v.trim()]));
  const signedHeaderNames = Object.keys(lower).sort();
  const canonicalHeaders = signedHeaderNames.map((k) => `${k}:${lower[k]}\n`).join('');
  const signedHeaders = signedHeaderNames.join(';');

  const canonicalRequest = ['POST', p.path, '', canonicalHeaders, signedHeaders, sha256Hex(p.body)].join('\n');
  const scope = `${dateStamp}/${p.region}/${p.service}/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', xAmzDate, scope, sha256Hex(canonicalRequest)].join('\n');

  const kDate = hmac(`AWS4${p.secretKey}`, dateStamp);
  const kRegion = hmac(kDate, p.region);
  const kService = hmac(kRegion, p.service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  return {
    ...lower,
    authorization: `AWS4-HMAC-SHA256 Credential=${p.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}
