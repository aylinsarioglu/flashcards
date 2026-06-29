import type { Card } from '../types/card';

export type CsvCardRow = {
  front: string;
  back: string;
  example?: string;
  exampleTranslation?: string;
  deck: string;
};

export type CsvImportResult = {
  imported: number;
  skippedDuplicates: number;
  skippedInvalid: number;
  totalRows: number;
};

const REQUIRED_COLUMNS = ['front', 'back', 'deck'] as const;

const COLUMN_ALIASES: Record<string, keyof CsvCardRow> = {
  front: 'front',
  back: 'back',
  example: 'example',
  exampletranslation: 'exampleTranslation',
  deck: 'deck',
};

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, '').trim().toLowerCase();
}

function cardKey(front: string, back: string, deck: string) {
  return `${front.trim().toLowerCase()}|${back.trim().toLowerCase()}|${deck.trim().toLowerCase()}`;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
}

function rowToCard(row: CsvCardRow, index: number): Card {
  const deck = row.deck.trim();

  return {
    id: `csv-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
    front: row.front.trim(),
    back: row.back.trim(),
    deck,
    category: deck,
    learned: false,
    ...(row.example?.trim() ? { example: row.example.trim() } : {}),
    ...(row.exampleTranslation?.trim()
      ? { exampleTranslation: row.exampleTranslation.trim() }
      : {}),
  };
}

export function parseCsvCards(csvText: string): CsvCardRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must include a header row and at least one data row.');
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const columnIndex: Partial<Record<keyof CsvCardRow, number>> = {};

  headers.forEach((header, index) => {
    const mapped = COLUMN_ALIASES[header];

    if (mapped) {
      columnIndex[mapped] = index;
    }
  });

  for (const required of REQUIRED_COLUMNS) {
    if (columnIndex[required] === undefined) {
      throw new Error(`Missing required column: ${required.charAt(0).toUpperCase()}${required.slice(1)}`);
    }
  }

  const rows: CsvCardRow[] = [];

  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line);

    rows.push({
      front: values[columnIndex.front!] ?? '',
      back: values[columnIndex.back!] ?? '',
      example:
        columnIndex.example !== undefined
          ? values[columnIndex.example] ?? ''
          : undefined,
      exampleTranslation:
        columnIndex.exampleTranslation !== undefined
          ? values[columnIndex.exampleTranslation] ?? ''
          : undefined,
      deck: values[columnIndex.deck!] ?? '',
    });
  }

  return rows;
}

export function mergeCsvIntoCards(
  existingCards: Card[],
  rows: CsvCardRow[],
): { cards: Card[]; result: CsvImportResult } {
  const seenKeys = new Set(
    existingCards.map((card) => cardKey(card.front, card.back, card.deck)),
  );
  const merged = [...existingCards];
  let imported = 0;
  let skippedDuplicates = 0;
  let skippedInvalid = 0;

  rows.forEach((row, index) => {
    const front = row.front.trim();
    const back = row.back.trim();
    const deck = row.deck.trim();

    if (!front || !back || !deck) {
      skippedInvalid += 1;
      return;
    }

    const key = cardKey(front, back, deck);

    if (seenKeys.has(key)) {
      skippedDuplicates += 1;
      return;
    }

    seenKeys.add(key);
    merged.push(rowToCard(row, index));
    imported += 1;
  });

  return {
    cards: merged,
    result: {
      imported,
      skippedDuplicates,
      skippedInvalid,
      totalRows: rows.length,
    },
  };
}

export function importCardsFromCsvContent(
  existingCards: Card[],
  csvText: string,
): { cards: Card[]; result: CsvImportResult } {
  const rows = parseCsvCards(csvText);
  return mergeCsvIntoCards(existingCards, rows);
}
