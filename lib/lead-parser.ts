// FILE PATH: lib/lead-parser.ts
// TECHNOVA STUDIO // LEAD FILE PARSER & AUTO-MAPPING ENGINE (CSV, EXCEL, PDF)

import * as XLSX from 'xlsx';
import { DEFAULT_LEAD_COLUMNS, LeadColumn, StudioLead, LeadStatus, LeadSource } from '@/lib/store';

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
export function parsePdfTextContent(
  fullText: string,
  filename: string,
  columns: LeadColumn[] = DEFAULT_LEAD_COLUMNS
): ParsedLeadResult {
  const warnings: string[] = [];
  const leads: Partial<StudioLead>[] = [];

  if (!fullText || !fullText.trim()) {
    return { leads: [], totalParsed: 0, detectedType: 'pdf', warnings: ['No extractable text found in PDF'] };
  }

  const normalizedText = fullText
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(
      /([^\n])\s+(?=(?:Record\s+\d+|Lead\s+\d+|Full\s*Name|Contact(?:\s*Name)?|Name|E-?mail(?:\s*Address)?|Phone|Mobile|Telephone|Company|Organization|Business|Value|Budget|Status|Stage|Source|Notes?)\s*[:=-])/gi,
      '$1\n'
    );
  const rawLines = normalizedText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Check if the PDF has a tabular / delimited layout (e.g. pipe '|' or tab '\t' or comma separated)
  const pipeLines = rawLines.filter((l) => l.includes('|'));
  const tabLines = rawLines.filter((l) => l.includes('\t'));
  const tableLines = pipeLines.length >= 2 ? pipeLines : tabLines;

  if (tableLines.length >= 2) {
    const delimiter = pipeLines.length >= 2 ? '|' : '\t';
    const headers = tableLines[0].split(delimiter).map((h) => h.trim().toLowerCase());
    const nameIdx = headers.findIndex((h) => /name|contact/i.test(h));
    const emailIdx = headers.findIndex((h) => /email|mail/i.test(h));
    const phoneIdx = headers.findIndex((h) => /phone|tel|mobile/i.test(h));
    const compIdx = headers.findIndex((h) => /company|org/i.test(h));
    const valIdx = headers.findIndex((h) => /val|amount|budget/i.test(h));
    const statIdx = headers.findIndex((h) => /status|stage/i.test(h));

    for (let i = 1; i < tableLines.length; i++) {
      const parts = tableLines[i].split(delimiter).map((p) => p.trim());
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
  const textBlocks = normalizedText.split(
    /(?:---+|===+|\*{3,}|(?:^|\n)[ \t]*(?:Record|Lead)\s+\d+:?[ \t]*(?:\n|$)|\n(?=\s*(?:Full\s*Name|Contact(?:\s*Name)?|Name)\s*[:=-]))/i
  );
  const customColumns = columns.filter(
    (column) => !['name', 'email', 'phone', 'company', 'value', 'status', 'source', 'notes'].includes(column.id)
  );

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
    let source: LeadSource = 'MANUAL';
    const fieldValues: Record<string, string> = {};
    const customFields: Record<string, any> = {};

    for (const line of lines) {
      const customColumn = customColumns.find(
        (column) => column.label.trim() && new RegExp(`^${column.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:=-]\\s*(.+)$`, 'i').test(line)
      );
      if (customColumn) {
        const match = line.match(new RegExp(`^${customColumn.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[:=-]\\s*(.+)$`, 'i'));
        if (match) customFields[customColumn.id] = match[1].trim();
        continue;
      }

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

      const sourceMatch = line.match(/^(?:lead\s*)?source\s*[:=-]\s*(.+)/i);
      if (sourceMatch) {
        source = normalizeLeadSource(sourceMatch[1]);
        continue;
      }

      const fieldMatch = line.match(/^([a-zA-Z0-9_\s-]{2,40})\s*[:=]\s*(.+)/);
      if (fieldMatch) {
        const key = fieldMatch[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        fieldValues[key] = fieldMatch[2].trim();
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
        source,
        sourceDetails: `Imported from PDF dossier in ${filename}`,
        notes,
        customFields: { ...fieldValues, ...customFields },
      });
    }
  }

  // 3. If no leads were identified via key-value blocks, fallback to searching raw emails
  {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    const matches = Array.from(normalizedText.matchAll(emailRegex));

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const email = match[0];
      if (leads.some((lead) => lead.email?.toLowerCase() === email.toLowerCase())) continue;
      const matchIndex = match.index || 0;

      const previousEmailEnd = i > 0 ? (matches[i - 1].index || 0) + matches[i - 1][0].length : 0;
      const nextEmailStart = i + 1 < matches.length ? (matches[i + 1].index || normalizedText.length) : normalizedText.length;
      const recordStart = Math.max(previousEmailEnd, normalizedText.lastIndexOf('\n\n', matchIndex) + 2);
      const windowText = normalizedText.slice(recordStart, nextEmailStart || normalizedText.length);
      const windowLines = windowText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

      const fields = new Map<string, string>();
      for (const line of windowLines) {
        const field = line.match(/^([a-zA-Z][a-zA-Z0-9 _-]{1,39})\s*[:=-]\s*(.+)$/);
        if (field) fields.set(field[1].trim().toLowerCase(), field[2].trim());
      }
      const nameCandidate = fields.get('name') || fields.get('full name') || fields.get('contact name');
      const phoneCandidate = fields.get('phone') || fields.get('mobile') || fields.get('telephone');
      const companyCandidate = fields.get('company') || fields.get('organization') || fields.get('business');

      leads.push({
        name: nameCandidate && nameCandidate.length < 100 ? nameCandidate : email.split('@')[0],
        email,
        phone: phoneCandidate,
        company: companyCandidate,
        source: 'MANUAL',
        sourceDetails: `Imported from PDF freeform text in ${filename}`,
        status: 'NEW',
        value: cleanLeadValue(fields.get('value') || fields.get('budget') || ''),
        notes: fields.get('notes') || fields.get('description') || '',
        customFields: Object.fromEntries(
          customColumns
            .map((column) => [column.id, fields.get(column.label.toLowerCase())])
            .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
        ),
      });
    }
  }

  const uniqueLeads = leads.filter((lead, index, list) => {
    const email = lead.email?.trim().toLowerCase();
    return !email || list.findIndex((candidate) => candidate.email?.trim().toLowerCase() === email) === index;
  });

  return {
    leads: uniqueLeads,
    totalParsed: uniqueLeads.length,
    detectedType: 'pdf',
    warnings,
  };
}

// ─── MASTER ENTRY POINT ───────────────────────────────────────────────────────
export async function parseUploadedLeadFile(
  buffer: Buffer,
  filename: string,
  mimeType?: string,
  columns: LeadColumn[] = DEFAULT_LEAD_COLUMNS
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
    let parser: import('pdf-parse').PDFParse | undefined;
    try {
      const { PDFParse } = await import('pdf-parse');
      parser = new PDFParse({ data: buffer });
      const parsedDoc = await parser.getText();
      const extractedText = parsedDoc && typeof parsedDoc.text === 'string' ? parsedDoc.text : '';
      return parsePdfTextContent(extractedText, filename, columns);
    } catch (pdfErr: any) {
      return {
        leads: [],
        totalParsed: 0,
        detectedType: 'pdf',
        warnings: [`PDF text extraction failed: ${pdfErr?.message || String(pdfErr)}`],
      };
    } finally {
      await parser?.destroy();
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
