// FILE PATH: lib/lead-parser.ts
// TECHNOVA STUDIO // LEAD FILE PARSER & AUTO-MAPPING ENGINE (CSV, EXCEL, PDF)

import * as XLSX from 'xlsx';
import { StudioLead, LeadStatus, LeadSource } from '@/lib/store';

export interface ParsedLeadResult {
  leads: Partial<StudioLead>[];
  totalParsed: number;
  detectedType: 'csv' | 'excel' | 'pdf' | 'unknown';
  warnings: string[];
}

// ─── HELPER: Clean & Parse Currency / Numeric Values ─────────────────────────
export function cleanLeadValue(val: any): number {
  if (typeof val === 'number') return Math.round(val);
  if (!val) return 0;
  const str = String(val).trim().toLowerCase();
  if (!str) return 0;

  const isK = str.endsWith('k');
  const isM = str.endsWith('m');

  const numericOnly = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(numericOnly);
  if (isNaN(parsed)) return 0;

  if (isK) return Math.round(parsed * 1000);
  if (isM) return Math.round(parsed * 1000000);
  return Math.round(parsed);
}

// ─── HELPER: Normalize Status ────────────────────────────────────────────────
export function normalizeLeadStatus(raw?: string): LeadStatus {
  if (!raw) return 'NEW';
  const s = String(raw).trim().toLowerCase();

  if (s.includes('won') || s.includes('closed') || s.includes('converted') || s.includes('signed')) {
    return 'DEAL_WON';
  }
  if (s.includes('lost') || s.includes('rejected') || s.includes('dropped') || s.includes('dead')) {
    return 'LOST';
  }
  if (s.includes('interest') || s.includes('qualif') || s.includes('evaluat') || s.includes('proposal')) {
    return 'INTERESTED';
  }
  if (s.includes('follow') || s.includes('nurtur') || s.includes('demo') || s.includes('meeting')) {
    return 'FOLLOW_UP';
  }
  if (s.includes('contact') || s.includes('reach') || s.includes('called') || s.includes('emailed')) {
    return 'CONTACTED';
  }
  return 'NEW';
}

// ─── HELPER: Normalize Source ────────────────────────────────────────────────
export function normalizeLeadSource(raw?: string, defaultSource: LeadSource = 'MANUAL'): LeadSource {
  if (!raw) return defaultSource;
  const s = String(raw).trim().toLowerCase();

  if (s.includes('meta') || s.includes('fb') || s.includes('facebook') || s.includes('instagram')) {
    return 'META_ADS';
  }
  if (s.includes('google') || s.includes('adwords') || s.includes('gads')) {
    return 'GOOGLE_ADS';
  }
  if (s.includes('linkedin') || s.includes('outreach')) {
    return 'OUTREACH';
  }
  if (s.includes('web') || s.includes('site') || s.includes('form') || s.includes('inquiry')) {
    return 'WEBSITE';
  }
  if (s.includes('referral') || s.includes('friend') || s.includes('client') || s.includes('partner') || s.includes('affiliate')) {
    return 'REFERRAL';
  }
  if (s.includes('hook') || s.includes('api') || s.includes('zapier')) {
    return 'WEBHOOK';
  }
  return 'MANUAL';
}

// ─── COLUMN HEADER MATCHER ───────────────────────────────────────────────────
function findFieldKey(keys: string[], patterns: RegExp[]): string | undefined {
  return keys.find((key) => {
    const cleanKey = key.trim().toLowerCase();
    return patterns.some((p) => p.test(cleanKey));
  });
}

// ─── PARSE CSV & EXCEL FILES ─────────────────────────────────────────────────
export function parseSpreadsheetBuffer(buffer: Buffer, filename: string): ParsedLeadResult {
  const warnings: string[] = [];
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return { leads: [], totalParsed: 0, detectedType: 'excel', warnings: ['No sheets found in workbook'] };
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (rawRows.length === 0) {
    return { leads: [], totalParsed: 0, detectedType: filename.endsWith('.csv') ? 'csv' : 'excel', warnings: ['Worksheet is empty'] };
  }

  const sampleRow = rawRows[0];
  const headerKeys = Object.keys(sampleRow);

  // Field pattern matches
  const nameKey = findFieldKey(headerKeys, [/^(?:full[_\s-]?)?name$/i, /^contact[_\s-]?name$/i, /^lead[_\s-]?name$/i, /^prospect$/i, /^client$/i]);
  const emailKey = findFieldKey(headerKeys, [/^(?:work[_\s-]?)?email(?:[_\s-]?addr(?:ess)?)?$/i, /^mail$/i, /^e[_\s-]?mail$/i]);
  const phoneKey = findFieldKey(headerKeys, [/^(?:contact[_\s-]?)?(?:phone|mobile|tel|telephone|cell)(?:[_\s-]?number)?$/i]);
  const companyKey = findFieldKey(headerKeys, [/^(?:company|organization|org|business|account|agency)(?:[_\s-]?name)?$/i]);
  const valueKey = findFieldKey(headerKeys, [/^(?:deal[_\s-]?)?(?:value|amount|budget|size|price|revenue)$/i, /^estimated[_\s-]?value$/i]);
  const statusKey = findFieldKey(headerKeys, [/^(?:lead[_\s-]?)?(?:status|stage|lifecycle|pipeline[_\s-]?stage)$/i]);
  const sourceKey = findFieldKey(headerKeys, [/^(?:lead[_\s-]?)?(?:source|channel|campaign|origin)$/i]);
  const notesKey = findFieldKey(headerKeys, [/^(?:notes?|description|comment|comments|details|message|inquiry)$/i]);

  const leads: Partial<StudioLead>[] = [];

  rawRows.forEach((row, idx) => {
    // Extract primary fields
    const nameVal = nameKey ? String(row[nameKey] || '').trim() : '';
    const emailVal = emailKey ? String(row[emailKey] || '').trim() : '';
    const phoneVal = phoneKey ? String(row[phoneKey] || '').trim() : '';
    const companyVal = companyKey ? String(row[companyKey] || '').trim() : '';
    const valueVal = valueKey ? cleanLeadValue(row[valueKey]) : 0;
    const statusVal = statusKey ? normalizeLeadStatus(row[statusKey]) : 'NEW';
    const sourceVal = sourceKey ? normalizeLeadSource(row[sourceKey]) : 'MANUAL';
    const notesVal = notesKey ? String(row[notesKey] || '').trim() : '';

    // If neither name nor email exist, skip row
    if (!nameVal && !emailVal) {
      warnings.push(`Row ${idx + 2} skipped: Missing name and email`);
      return;
    }

    // Dynamic custom fields: any column that wasn't a standard matched field
    const standardKeys = [nameKey, emailKey, phoneKey, companyKey, valueKey, statusKey, sourceKey, notesKey].filter(Boolean);
    const customFields: Record<string, any> = {};
    for (const key of headerKeys) {
      if (!standardKeys.includes(key)) {
        const val = row[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          // Normalize key
          const cleanCustomKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
          customFields[cleanCustomKey] = val;
        }
      }
    }

    leads.push({
      name: nameVal || (emailVal ? emailVal.split('@')[0] : `Lead #${idx + 1}`),
      email: emailVal || '',
      phone: phoneVal,
      company: companyVal,
      value: valueVal,
      status: statusVal,
      source: sourceVal,
      sourceDetails: `Imported from ${filename} (Row ${idx + 2})`,
      notes: notesVal,
      customFields,
    });
  });

  return {
    leads,
    totalParsed: leads.length,
    detectedType: filename.endsWith('.csv') ? 'csv' : 'excel',
    warnings,
  };
}

// ─── PARSE PDF TEXT & STRUCTURED RECORDS ──────────────────────────────────────
export function parsePdfTextContent(fullText: string, filename: string): ParsedLeadResult {
  const warnings: string[] = [];
  const leads: Partial<StudioLead>[] = [];

  if (!fullText || !fullText.trim()) {
    return { leads: [], totalParsed: 0, detectedType: 'pdf', warnings: ['No extractable text found in PDF'] };
  }

  const rawLines = fullText.split(/\r?\n/).map((l) => l.trim());

  // 1. Check if the PDF has a tabular / delimited layout (e.g. pipe '|' or tab '\t' or comma separated)
  const pipeLines = rawLines.filter((l) => l.includes('|'));
  const tabLines = rawLines.filter((l) => l.includes('\t'));

  if (pipeLines.length >= 2) {
    // Pipe-delimited table structure
    const headers = pipeLines[0].split('|').map((h) => h.trim().toLowerCase());
    const nameIdx = headers.findIndex((h) => /name|contact/i.test(h));
    const emailIdx = headers.findIndex((h) => /email|mail/i.test(h));
    const phoneIdx = headers.findIndex((h) => /phone|tel|mobile/i.test(h));
    const compIdx = headers.findIndex((h) => /company|org/i.test(h));
    const valIdx = headers.findIndex((h) => /val|amount|budget/i.test(h));
    const statIdx = headers.findIndex((h) => /status|stage/i.test(h));

    for (let i = 1; i < pipeLines.length; i++) {
      const parts = pipeLines[i].split('|').map((p) => p.trim());
      if (parts.length < 2) continue;
      const email = emailIdx !== -1 && parts[emailIdx] ? parts[emailIdx] : '';
      const name = nameIdx !== -1 && parts[nameIdx] ? parts[nameIdx] : '';
      if (!name && !email) continue;

      leads.push({
        name: name || email.split('@')[0],
        email: email,
        phone: phoneIdx !== -1 ? parts[phoneIdx] : '',
        company: compIdx !== -1 ? parts[compIdx] : '',
        value: valIdx !== -1 ? cleanLeadValue(parts[valIdx]) : 0,
        status: statIdx !== -1 ? normalizeLeadStatus(parts[statIdx]) : 'NEW',
        source: 'MANUAL',
        sourceDetails: `Imported from PDF table in ${filename}`,
        customFields: {},
      });
    }

    if (leads.length > 0) {
      return { leads, totalParsed: leads.length, detectedType: 'pdf', warnings };
    }
  }

  // 2. Check for labeled key-value dossier blocks
  // Record delimiters: ---, ===, or blocks separated by multiple newlines
  const textBlocks = fullText.split(/(?:---+|===+|\*{3,}|\bRecord\s+\d+:?|\bLead\s+\d+:?)/i);

  for (const block of textBlocks) {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let name = '';
    let email = '';
    let phone = '';
    let company = '';
    let value = 0;
    let status: LeadStatus = 'NEW';
    let notes = '';
    const customFields: Record<string, any> = {};

    for (const line of lines) {
      const nameMatch = line.match(/^(?:name|full\s*name|contact(?:\s*name)?|lead(?:\s*name)?)\s*[:=-]\s*(.+)/i);
      if (nameMatch) {
        name = nameMatch[1].trim();
        continue;
      }

      const emailMatch = line.match(/^(?:email|e-mail|email\s*address)\s*[:=-]\s*(.+)/i);
      if (emailMatch) {
        email = emailMatch[1].trim();
        continue;
      }

      const phoneMatch = line.match(/^(?:phone|telephone|mobile|tel|cell)\s*[:=-]\s*(.+)/i);
      if (phoneMatch) {
        phone = phoneMatch[1].trim();
        continue;
      }

      const companyMatch = line.match(/^(?:company|organization|org|business|agency)\s*[:=-]\s*(.+)/i);
      if (companyMatch) {
        company = companyMatch[1].trim();
        continue;
      }

      const valueMatch = line.match(/^(?:value|budget|deal|amount|deal\s*value|price)\s*[:=-]\s*(.+)/i);
      if (valueMatch) {
        value = cleanLeadValue(valueMatch[1]);
        continue;
      }

      const statusMatch = line.match(/^(?:status|stage|lifecycle)\s*[:=-]\s*(.+)/i);
      if (statusMatch) {
        status = normalizeLeadStatus(statusMatch[1]);
        continue;
      }

      const notesMatch = line.match(/^(?:notes?|description|details|comment)\s*[:=-]\s*(.+)/i);
      if (notesMatch) {
        notes = notesMatch[1].trim();
        continue;
      }

      // Check for custom key: value
      const kvMatch = line.match(/^([a-zA-Z0-9_\s]{2,20})\s*[:=]\s*(.+)/);
      if (kvMatch && !nameMatch && !emailMatch) {
        const customKey = kvMatch[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        customFields[customKey] = kvMatch[2].trim();
      }
    }

    // Fallback: search for inline email in block if not caught by label
    if (!email) {
      const inlineEmail = block.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
      if (inlineEmail) email = inlineEmail[0];
    }

    // Fallback: search for phone in block if not caught
    if (!phone) {
      const inlinePhone = block.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (inlinePhone) phone = inlinePhone[0];
    }

    if (name || email) {
      leads.push({
        name: name || (email ? email.split('@')[0] : 'Unnamed Lead'),
        email,
        phone,
        company,
        value,
        status,
        source: 'MANUAL',
        sourceDetails: `Imported from PDF dossier in ${filename}`,
        notes,
        customFields,
      });
    }
  }

  // 3. If no leads were identified via key-value blocks, fallback to searching raw emails
  if (leads.length === 0) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    const matches = Array.from(fullText.matchAll(emailRegex));

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const email = match[0];
      const matchIndex = match.index || 0;

      // Extract window around the email match
      const windowStart = Math.max(0, matchIndex - 120);
      const windowEnd = Math.min(fullText.length, matchIndex + 160);
      const windowText = fullText.slice(windowStart, windowEnd);
      const windowLines = windowText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

      const emailLineIdx = windowLines.findIndex((l) => l.includes(email));
      const nameCandidate = emailLineIdx > 0 ? windowLines[emailLineIdx - 1] : email.split('@')[0];

      leads.push({
        name: nameCandidate && nameCandidate.length < 40 ? nameCandidate : email.split('@')[0],
        email,
        source: 'MANUAL',
        sourceDetails: `Imported from PDF freeform text in ${filename}`,
        status: 'NEW',
        value: 0,
        customFields: {},
      });
    }
  }

  return {
    leads,
    totalParsed: leads.length,
    detectedType: 'pdf',
    warnings,
  };
}

// ─── MASTER ENTRY POINT ───────────────────────────────────────────────────────
export async function parseUploadedLeadFile(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<ParsedLeadResult> {
  const lowerName = filename.toLowerCase();

  // Excel or CSV file
  if (
    lowerName.endsWith('.xlsx') ||
    lowerName.endsWith('.xls') ||
    lowerName.endsWith('.csv') ||
    mimeType?.includes('spreadsheet') ||
    mimeType?.includes('excel') ||
    mimeType?.includes('csv')
  ) {
    return parseSpreadsheetBuffer(buffer, filename);
  }

  // PDF file
  if (lowerName.endsWith('.pdf') || mimeType?.includes('pdf')) {
    try {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      const parsedDoc = await parser.getText();
      const extractedText = parsedDoc && typeof parsedDoc.text === 'string' ? parsedDoc.text : '';
      return parsePdfTextContent(extractedText, filename);
    } catch (pdfErr: any) {
      return {
        leads: [],
        totalParsed: 0,
        detectedType: 'pdf',
        warnings: [`PDF text extraction failed: ${pdfErr?.message || String(pdfErr)}`],
      };
    }
  }

  // Fallback try as spreadsheet
  try {
    return parseSpreadsheetBuffer(buffer, filename);
  } catch (err: any) {
    return {
      leads: [],
      totalParsed: 0,
      detectedType: 'unknown',
      warnings: [`Unsupported file format for ${filename}. Please upload .csv, .xlsx, .xls, or .pdf`],
    };
  }
}
