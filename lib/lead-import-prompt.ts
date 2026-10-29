import { DEFAULT_LEAD_COLUMNS, LeadColumn } from '@/lib/store';

const SYSTEM_COLUMNS = new Set([
  'name',
  'email',
  'phone',
  'company',
  'value',
  'status',
  'source',
  'assignedMemberName',
  'customerId',
  'notes',
]);

export function buildLeadImportPrompt(columns: LeadColumn[] = DEFAULT_LEAD_COLUMNS): string {
  const customColumns = columns
    .filter((column) => !SYSTEM_COLUMNS.has(column.id))
    .sort((a, b) => a.order - b.order);
  const fields = [
    'Name: [full name]',
    'Email: [valid email address]',
    'Phone: [phone number]',
    'Company: [company or organization]',
    'Deal Value: [number and currency]',
    'Status: NEW',
    'Source: MANUAL',
    'Notes: [brief context]',
    ...customColumns.map((column) => `${column.label}: [${column.type}${column.options?.length ? `; allowed: ${column.options.join(', ')}` : ''}]`),
  ];

  return [
    'Create a text-based PDF lead list using the exact schema below. Do not invent missing information.',
    'Use one lead block per person, repeat every field label for every lead, and put one field on each line.',
    'Start each block with a Record number. Leave an unknown value blank after the colon. Do not merge people into one block.',
    'Use a selectable-text PDF (not a scanned image). Keep the field labels exactly as written so the importer can map them.',
    'For Status use only: NEW, CONTACTED, FOLLOW_UP, INTERESTED, DEAL_WON, LOST.',
    '',
    'SCHEMA (repeat this block for every lead):',
    'Record 1:',
    ...fields,
    '',
    'Include all custom fields below in every record, even when their value is blank.',
  ].join('\n');
}
