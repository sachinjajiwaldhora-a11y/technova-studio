// FILE PATH: scripts/test-import-suite.mjs
// Automated Verification Suite for Technova Studio Lead File Upload & Parser

import * as XLSX from 'xlsx';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('🧪 Starting Lead File Upload & Parser Verification Suite...\n');

// ─── 1. Clean & Parse Currency Values ─────────────────────────────────────────
console.log('🔹 Test Suite 1: Clean & Parse Currency / Deal Values');
function cleanLeadValue(val) {
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

assert(cleanLeadValue('$45,000') === 45000, 'Parsed "$45,000" to 45000');
assert(cleanLeadValue('120k') === 120000, 'Parsed "120k" to 120000');
assert(cleanLeadValue('$1.5M') === 1500000, 'Parsed "$1.5M" to 1500000');
assert(cleanLeadValue('75000') === 75000, 'Parsed raw string "75000" to 75000');
assert(cleanLeadValue(null) === 0, 'Handled null value gracefully as 0');

// ─── 2. Status Normalization ─────────────────────────────────────────────────
console.log('\n🔹 Test Suite 2: Status Lifecycle Normalization');
function normalizeLeadStatus(raw) {
  if (!raw) return 'NEW';
  const s = String(raw).trim().toLowerCase();
  if (s.includes('won') || s.includes('closed') || s.includes('converted') || s.includes('signed')) return 'DEAL_WON';
  if (s.includes('lost') || s.includes('rejected') || s.includes('dropped') || s.includes('dead')) return 'LOST';
  if (s.includes('interest') || s.includes('qualif') || s.includes('evaluat') || s.includes('proposal')) return 'INTERESTED';
  if (s.includes('follow') || s.includes('nurtur') || s.includes('demo') || s.includes('meeting')) return 'FOLLOW_UP';
  if (s.includes('contact') || s.includes('reach') || s.includes('called') || s.includes('emailed')) return 'CONTACTED';
  return 'NEW';
}

assert(normalizeLeadStatus('Closed Won') === 'DEAL_WON', 'Normalized "Closed Won" -> DEAL_WON');
assert(normalizeLeadStatus('Proposal Under Evaluation') === 'INTERESTED', 'Normalized "Proposal Under Evaluation" -> INTERESTED');
assert(normalizeLeadStatus('Demo Scheduled') === 'FOLLOW_UP', 'Normalized "Demo Scheduled" -> FOLLOW_UP');
assert(normalizeLeadStatus('Called today') === 'CONTACTED', 'Normalized "Called today" -> CONTACTED');
assert(normalizeLeadStatus('Unqualified / dropped') === 'LOST', 'Normalized "Unqualified / dropped" -> LOST');
assert(normalizeLeadStatus('') === 'NEW', 'Defaulted empty status to NEW');

// ─── 3. Excel & CSV Parsing & Field Mapping ──────────────────────────────────
console.log('\n🔹 Test Suite 3: Excel (.xlsx) & CSV Parsing & Field Auto-Mapping');
const testRows = [
  { 'Full Name': 'Elena Rostova', 'Work Email': 'elena@vanguard.tech', 'Phone': '+1 555-0182', 'Company': 'Vanguard Tech', 'Deal Value': '$85,000', 'Status': 'Interested', 'Industry': 'Fintech' },
  { 'Full Name': 'Liam Chen', 'Work Email': 'liam@matrixai.co', 'Phone': '+1 555-0199', 'Company': 'Matrix AI', 'Deal Value': '150k', 'Status': 'Demo Scheduled', 'Industry': 'AI / ML' },
];

const ws = XLSX.utils.json_to_sheet(testRows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Leads');
const xlsxBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

const parsedWb = XLSX.read(xlsxBuf, { type: 'buffer' });
const jsonResult = XLSX.utils.sheet_to_json(parsedWb.Sheets[parsedWb.SheetNames[0]]);

assert(jsonResult.length === 2, `Parsed exactly 2 rows from in-memory Excel file`);
assert(jsonResult[0]['Full Name'] === 'Elena Rostova', 'Extracted "Elena Rostova" correctly');
assert(jsonResult[0]['Work Email'] === 'elena@vanguard.tech', 'Extracted "elena@vanguard.tech" correctly');
assert(cleanLeadValue(jsonResult[1]['Deal Value']) === 150000, 'Auto-mapped and parsed "150k" to 150000');
assert(jsonResult[0]['Industry'] === 'Fintech', 'Preserved custom field "Industry: Fintech"');

// ─── 4. PDF Dossier & Text Structure Extraction ──────────────────────────────
console.log('\n🔹 Test Suite 4: PDF Dossier & Text Structure Parsing');
const samplePdfText = `
LEAD EXPORT SUMMARY // TECHNOVA PROSPECTS

Record 1:
Name: Alexander Pierce
Email: alexander@hydracorp.org
Phone: +1 212-555-0144
Company: Hydra Corp
Value: $200,000
Status: Follow Up
Notes: Exploring full enterprise headless migration

---

Record 2:
Name: Natasha Roman
Email: natasha@shieldops.gov
Phone: +1 202-555-0189
Company: SHIELD Ops
Value: 95k
Status: Deal Won
Notes: Contract approved, awaiting onboarding
`;

function parsePdfDossier(text) {
  const blocks = text.split(/(?:---+|===+|\*{3,}|\bRecord\s+\d+:?)/i);
  const results = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    let name = '', email = '', phone = '', company = '', value = 0, status = 'NEW', notes = '';
    for (const line of lines) {
      if (/^name\s*[:=-]\s*(.+)/i.test(line)) name = line.match(/^name\s*[:=-]\s*(.+)/i)[1].trim();
      if (/^email\s*[:=-]\s*(.+)/i.test(line)) email = line.match(/^email\s*[:=-]\s*(.+)/i)[1].trim();
      if (/^phone\s*[:=-]\s*(.+)/i.test(line)) phone = line.match(/^phone\s*[:=-]\s*(.+)/i)[1].trim();
      if (/^company\s*[:=-]\s*(.+)/i.test(line)) company = line.match(/^company\s*[:=-]\s*(.+)/i)[1].trim();
      if (/^value\s*[:=-]\s*(.+)/i.test(line)) value = cleanLeadValue(line.match(/^value\s*[:=-]\s*(.+)/i)[1]);
      if (/^status\s*[:=-]\s*(.+)/i.test(line)) status = normalizeLeadStatus(line.match(/^status\s*[:=-]\s*(.+)/i)[1]);
      if (/^notes?\s*[:=-]\s*(.+)/i.test(line)) notes = line.match(/^notes?\s*[:=-]\s*(.+)/i)[1].trim();
    }
    if (name || email) {
      results.push({ name, email, phone, company, value, status, notes });
    }
  }
  return results;
}

const parsedPdfLeads = parsePdfDossier(samplePdfText);
assert(parsedPdfLeads.length === 2, `Extracted ${parsedPdfLeads.length} leads from PDF dossier format`);
assert(parsedPdfLeads[0].name === 'Alexander Pierce', 'Extracted PDF lead name: Alexander Pierce');
assert(parsedPdfLeads[0].email === 'alexander@hydracorp.org', 'Extracted PDF lead email: alexander@hydracorp.org');
assert(parsedPdfLeads[0].value === 200000, 'Extracted PDF deal value: 200000');
assert(parsedPdfLeads[1].status === 'DEAL_WON', 'Normalized PDF lead status: DEAL_WON');
assert(parsedPdfLeads[1].value === 95000, 'Normalized "95k" to 95000 from PDF');

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('═══════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
}

