import fs from 'node:fs'
import path from 'node:path'
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter'

const OUTPUT_FILE = 'reports/results.csv'

interface ResultRow {
  id: string
  project: string
  title: string
  status: string
  expectedStatus: string
  outcome: string
  durationMs: number
  retry: number
  repeatEachIndex: number
  file: string
  error: string
}

function extractId(title: string): string {
  const match = /^\[([\w-]+)\]/.exec(title)
  return match ? match[1] : ''
}

function escapeCsvField(value: string | number): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function toCsvLine(row: ResultRow): string {
  return [
    row.id,
    row.project,
    row.title,
    row.status,
    row.expectedStatus,
    row.outcome,
    row.durationMs,
    row.retry,
    row.repeatEachIndex,
    row.file,
    row.error
  ]
    .map(escapeCsvField)
    .join(',')
}

function escapeMarkdownCell(value: string | number): string {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function toMarkdownRow(cells: Array<string | number>): string {
  return `| ${cells.map(escapeMarkdownCell).join(' | ')} |`
}

function buildStepSummary(rows: ResultRow[]): string {
  const passed = rows.filter((r) => r.outcome === 'expected' && r.status === 'passed').length
  const knownFailures = rows.filter((r) => r.outcome === 'expected' && r.status === 'failed').length
  const unexpectedRows = rows.filter((r) => r.outcome === 'unexpected')
  const flaky = rows.filter((r) => r.outcome === 'flaky').length
  const skipped = rows.filter((r) => r.status === 'skipped').length

  const lines: string[] = [
    '## Resultado dos testes',
    '',
    toMarkdownRow(['Total', 'Passou', 'Falha conhecida', 'Falha inesperada', 'Flaky', 'Pulado']),
    toMarkdownRow(['---', '---', '---', '---', '---', '---']),
    toMarkdownRow([rows.length, passed, knownFailures, unexpectedRows.length, flaky, skipped])
  ]

  if (unexpectedRows.length > 0) {
    lines.push('', '### Falhas inesperadas', '', toMarkdownRow(['ID', 'Projeto', 'Erro']), toMarkdownRow(['---', '---', '---']))
    for (const row of unexpectedRows) {
      lines.push(toMarkdownRow([row.id || row.title, row.project, row.error.slice(0, 200)]))
    }
  }

  lines.push(
    '',
    '<details>',
    '<summary>Ver todos os cenários</summary>',
    '',
    toMarkdownRow(['ID', 'Projeto', 'Status', 'Outcome', 'Duração (ms)']),
    toMarkdownRow(['---', '---', '---', '---', '---'])
  )
  for (const row of rows) {
    lines.push(toMarkdownRow([row.id || row.title, row.project, row.status, row.outcome, row.durationMs]))
  }
  lines.push('', '</details>', '')

  return lines.join('\n')
}

export default class CsvReporter implements Reporter {
  private readonly rows: ResultRow[] = []

  onTestEnd(test: TestCase, result: TestResult): void {
    const firstError = result.errors[0]?.message?.split('\n')[0] ?? ''

    this.rows.push({
      id: extractId(test.title),
      project: test.parent.project()?.name ?? '',
      title: test.title,
      status: result.status,
      expectedStatus: test.expectedStatus,
      outcome: test.outcome(),
      durationMs: result.duration,
      retry: result.retry,
      repeatEachIndex: test.repeatEachIndex,
      file: path.relative(process.cwd(), test.location.file),
      error: firstError
    })
  }

  onEnd(): void {
    const header = 'id,project,title,status,expected_status,outcome,duration_ms,retry,repeat_each_index,file,error'
    const lines = [header, ...this.rows.map(toCsvLine)]

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n') + '\n')

    const summaryFile = process.env.GITHUB_STEP_SUMMARY
    if (summaryFile) {
      fs.appendFileSync(summaryFile, buildStepSummary(this.rows) + '\n')
    }
  }
}
