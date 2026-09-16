import { getModelById } from '@/data/llmModels';
import type { ActualUsageRow } from '@/utils/storage';

function parseCsv(raw: string, separator: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char === '"') {
      if (quoted && raw[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (char === separator && !quoted) {
      row.push(field); field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && raw[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some(value => value.trim())) rows.push(row);
  if (quoted) throw new Error('CSV: guillemet non fermé');
  return rows;
}

export function parseUsageImport(raw: string): { rows: ActualUsageRow[]; skipped: number } {
  const firstLine = raw.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] ?? '';
  const separator = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';
  const lines = parseCsv(raw.replace(/^\uFEFF/, ''), separator);
  if (!lines.length) throw new Error('CSV vide');
  const header = lines[0].map(value => value.trim().toLowerCase());
  const aliases = {
    modelId: ['model_id', 'model'],
    inputTokens: ['input_tokens', 'prompt_tokens'],
    outputTokens: ['output_tokens', 'completion_tokens'],
    actualCost: ['actual_cost', 'cost'],
  } as const;
  const column = (names: readonly string[]) => names.find(name => header.includes(name));
  if (Object.values(aliases).some(names => !column(names))) {
    throw new Error('Colonnes requises : model_id, input_tokens, output_tokens, actual_cost');
  }
  const read = (line: string[], name: string) => line[header.indexOf(name)]?.trim() ?? '';
  const rows: ActualUsageRow[] = [];
  let skipped = 0;
  for (const line of lines.slice(1)) {
    const modelId = read(line, column(aliases.modelId)!);
    const rawInput = read(line, column(aliases.inputTokens)!);
    const rawOutput = read(line, column(aliases.outputTokens)!);
    const rawCost = read(line, column(aliases.actualCost)!);
    const inputTokens = Number(rawInput);
    const outputTokens = Number(rawOutput);
    const actualCost = Number(rawCost);
    const requestCount = header.includes('request_count') ? Number(read(line, 'request_count')) : 1;
    if (!getModelById(modelId) || !rawInput || !rawOutput || !rawCost
      || !Number.isInteger(inputTokens) || inputTokens < 0
      || !Number.isInteger(outputTokens) || outputTokens < 0
      || !Number.isFinite(actualCost) || actualCost < 0
      || !Number.isInteger(requestCount) || requestCount < 1) {
      skipped++;
      continue;
    }
    rows.push({ modelId, inputTokens, outputTokens, actualCost, requestCount, date: read(line, 'date') });
  }
  return { rows, skipped };
}
