import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const CREDENTIALS_PATH = path.join(process.cwd(), 'e2e', 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'e2e', 'token.json');

function decodeB64Url(data = '') {
  if (!data) return '';
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf-8');
}

function collectBodies(payload, out = []) {
  if (!payload) return out;
  if (payload.body && payload.body.data) out.push(decodeB64Url(payload.body.data));
  const parts = payload.parts || [];
  for (const p of parts) {
    if (p.mimeType && (p.mimeType.includes('text/plain') || p.mimeType.includes('text/html'))) {
      if (p.body && p.body.data) out.push(decodeB64Url(p.body.data));
    }
    if (p.parts || (p.body && p.body.data == null)) collectBodies(p, out);
  }
  return out;
}

function buildQuery({ fromList = [], subjectAny = [], newerThan = '2d' }) {
  const q = [];
  q.push('in:inbox');
  if (fromList.length) q.push('(' + fromList.map(f => `from:${JSON.stringify(f)}`).join(' OR ') + ')');
  if (subjectAny.length) q.push('subject:(' + subjectAny.map(s => JSON.stringify(s)).join(' OR ') + ')');
  if (newerThan) q.push(`newer_than:${newerThan}`);
  return q.join(' ');
}

function extractCode(subject, text) {
  let m = text.match(/enter the following code[\s\S]{0,80}?([A-Z0-9]{6})/i);
  if (m?.[1]) return m[1].toUpperCase();

  m = text.match(/(?:verification|security|one[-\s]*time)\s*code[^\n\r:]*[:\s-]*([A-Z0-9]{6})/i);
  if (m?.[1]) return m[1].toUpperCase();

  m = subject.match(/([A-Z0-9]{6})(?![A-Z0-9])/i);
  if (m?.[1]) return m[1].toUpperCase();

  m = text.match(/(^|[^A-Z0-9])([A-Z0-9]{6})(?![A-Z0-9])/i);
  if (m?.[2]) return m[2].toUpperCase();

  return null;
}


export async function getGmailCode({
  fromContains = 'Confluence',
  subjectContains = "Verifying it's you",
  timeoutMs = 120000,
  pollIntervalMs = 2000
} = {}) {
  const cred = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = cred.installed;
  const oAuth2 = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2.setCredentials(token);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2 });

  const q = buildQuery({
    fromList: [fromContains, 'no-reply@mail.notifications.atlassian.com', 'atlassian.net'],
    subjectAny: [subjectContains, 'verification code', 'verify your identity', 'security code', 'one-time code'],
    newerThan: '2d'
  });

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const list = await gmail.users.messages.list({ userId: 'me', q, maxResults: 10 });
    const messages = list.data.messages ?? [];

    const detailed = [];
    for (const m of messages) {
      if (!m.id) continue;
      const msg = await gmail.users.messages.get({ userId: 'me', id: m.id, format: 'full' });
      const ts = Number(msg.data.internalDate || '0');
      detailed.push({ ts, msg });
    }
    detailed.sort((a, b) => b.ts - a.ts);

    for (const { msg } of detailed) {
      const headers = msg.data.payload?.headers || [];
      const subject = headers.find(h => (h.name || '').toLowerCase() === 'subject')?.value || '';
      const bodies = collectBodies(msg.data.payload, []);
      if (msg.data.snippet) bodies.push(msg.data.snippet);
      if (subject) bodies.push(subject);
      const text = bodies.join('\n');
      const code = extractCode(subject, text);
      if (code) return code;
    }

    await new Promise(r => setTimeout(r, pollIntervalMs));
  }
  throw new Error('Verification code not found within timeout');
}

export async function testGmailConnection() {
  const cred = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

  const { client_secret, client_id, redirect_uris } = cred.installed;
  const oAuth2 = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2.setCredentials(token);

  const gmail = google.gmail({ version: 'v1', auth: oAuth2 });

  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 1
  });

  if (!res.data.messages || res.data.messages.length === 0) {
    console.log('No messages found.');
    return;
  }

  const msgId = res.data.messages[0].id;
  const msg = await gmail.users.messages.get({ userId: 'me', id: msgId });

  const headers = msg.data.payload.headers;
  const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value;

  console.log(`Latest message ID: ${msgId}`);
  console.log(`Subject: ${subject}`);
}
