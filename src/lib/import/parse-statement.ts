import type { ParsedTransaction } from "@/lib/types";

function toIsoDate(raw: string): string | null {
  const trimmed = raw.trim();

  // dd/mm/yyyy ou dd-mm-yyyy
  const br = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (br) {
    const [, d, m, y] = br;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // yyyy-mm-dd
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // yyyymmdd (comum em OFX)
  const compact = trimmed.match(/^(\d{4})(\d{2})(\d{2})/);
  if (compact) {
    const [, y, m, d] = compact;
    return `${y}-${m}-${d}`;
  }

  return null;
}

function parseAmount(raw: string): number | null {
  let value = raw.trim().replace(/[R$\s]/g, "");
  if (!value) return null;

  const isParenNegative = /^\(.*\)$/.test(value);
  value = value.replace(/[()]/g, "");

  // formato brasileiro: 1.234,56 -> remove milhar, vírgula vira ponto
  if (/,\d{1,2}$/.test(value)) {
    value = value.replace(/\./g, "").replace(",", ".");
  }

  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return isParenNegative ? -Math.abs(num) : num;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((c) => c.trim());
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  warnings: string[];
}

export function parseCsvStatement(content: string): ParseResult {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { transactions: [], warnings: ["Arquivo CSV vazio ou inválido."] };
  }

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const header = splitCsvLine(lines[0], delimiter).map((h) =>
    h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  );

  const dateIdx = header.findIndex((h) => /data|date/.test(h));
  const descIdx = header.findIndex((h) =>
    /descri|historic|memo|payee/.test(h)
  );
  const notesIdx = header.findIndex((h) => /categ|obs/.test(h));
  const typeIdx = header.findIndex((h) => /tipo|type/.test(h));
  const amountIdx = header.findIndex((h) => /valor|amount|montante/.test(h));
  const debitIdx = header.findIndex((h) => /debito|saida|débito/.test(h));
  const creditIdx = header.findIndex((h) => /credito|entrada|crédito/.test(h));

  const warnings: string[] = [];
  const transactions: ParsedTransaction[] = [];

  if (dateIdx === -1) {
    warnings.push("Não foi possível identificar a coluna de data.");
  }
  if (amountIdx === -1 && debitIdx === -1 && creditIdx === -1) {
    warnings.push("Não foi possível identificar a coluna de valor.");
  }

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i], delimiter);
    if (cells.every((c) => !c)) continue;

    const rawDate = dateIdx >= 0 ? cells[dateIdx] : "";
    const isoDate = toIsoDate(rawDate);

    let amount: number | null = null;
    let type: "receita" | "despesa" = "despesa";

    if (amountIdx >= 0) {
      amount = parseAmount(cells[amountIdx] ?? "");
      if (amount !== null) {
        type = amount < 0 ? "despesa" : "receita";
        amount = Math.abs(amount);
      }
    } else if (debitIdx >= 0 || creditIdx >= 0) {
      const debit = debitIdx >= 0 ? parseAmount(cells[debitIdx] ?? "") : null;
      const credit =
        creditIdx >= 0 ? parseAmount(cells[creditIdx] ?? "") : null;
      if (credit) {
        amount = Math.abs(credit);
        type = "receita";
      } else if (debit) {
        amount = Math.abs(debit);
        type = "despesa";
      }
    }

    if (typeIdx >= 0) {
      const rawType = (cells[typeIdx] ?? "").toLowerCase();
      if (/receita|credito|entrada|income/.test(rawType)) type = "receita";
      if (/despesa|debito|saida|expense/.test(rawType)) type = "despesa";
    }

    const description =
      (descIdx >= 0 ? cells[descIdx] : "") || "Lançamento importado";

    if (!isoDate || amount === null || amount === 0) {
      continue;
    }

    transactions.push({
      description: description.slice(0, 200),
      amount,
      date: isoDate,
      type,
      notes: notesIdx >= 0 ? cells[notesIdx] : undefined,
    });
  }

  if (transactions.length === 0) {
    warnings.push(
      "Nenhum lançamento válido foi encontrado. Verifique o formato do arquivo."
    );
  }

  return { transactions, warnings };
}

export function parseOfxStatement(content: string): ParseResult {
  const warnings: string[] = [];
  const transactions: ParsedTransaction[] = [];

  const blocks = content.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) ?? [];

  if (blocks.length === 0) {
    return {
      transactions: [],
      warnings: ["Nenhum lançamento (STMTTRN) encontrado no arquivo OFX."],
    };
  }

  function extract(block: string, tag: string): string | null {
    const match = block.match(new RegExp(`<${tag}>([^<\\n]*)`, "i"));
    return match ? match[1].trim() : null;
  }

  for (const block of blocks) {
    const rawDate = extract(block, "DTPOSTED");
    const rawAmount = extract(block, "TRNAMT");
    const name = extract(block, "NAME") ?? extract(block, "PAYEE");
    const memo = extract(block, "MEMO");

    const isoDate = rawDate ? toIsoDate(rawDate) : null;
    const amount = rawAmount ? parseAmount(rawAmount) : null;

    if (!isoDate || amount === null || amount === 0) continue;

    transactions.push({
      description: (name || memo || "Lançamento importado").slice(0, 200),
      amount: Math.abs(amount),
      date: isoDate,
      type: amount < 0 ? "despesa" : "receita",
      notes: name && memo && name !== memo ? memo : undefined,
    });
  }

  if (transactions.length === 0) {
    warnings.push(
      "Nenhum lançamento válido foi encontrado no arquivo OFX."
    );
  }

  return { transactions, warnings };
}

export function parseStatementFile(
  filename: string,
  content: string
): ParseResult {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".ofx") || content.includes("<OFX>")) {
    return parseOfxStatement(content);
  }
  return parseCsvStatement(content);
}
