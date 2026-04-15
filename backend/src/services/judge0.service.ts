/**
 * Judge0 Service
 * ==============
 * Thin wrapper around the Judge0 CE REST API for sandboxed code execution.
 * Falls back to the AI service when Judge0 is not configured.
 *
 * Docs: https://judge0-ce.p.rapidapi.com/
 * Language IDs: https://ce.judge0.com/languages
 */

import { config } from '../config';
import logger from '../utils/logger';

// ─── Language ID map (Judge0 CE) ─────────────────────────────────────────────

export const LANGUAGE_IDS: Record<string, number> = {
  python:     71,  // Python 3.8
  javascript: 63,  // Node.js 12
  typescript: 74,  // TypeScript 3.7
  java:       62,  // Java 13
  cpp:        54,  // C++ (GCC 9.2)
  c:          50,  // C (GCC 9.2)
  go:         60,  // Go 1.13
  rust:       73,  // Rust 1.40
  sql:        82,  // SQL (SQLite 3.27)
  bash:       46,  // Bash 5.0
  ruby:       72,  // Ruby 2.7
  php:        68,  // PHP 7.4
  csharp:     51,  // C# Mono 6.6
  swift:      83,  // Swift 5.2
  kotlin:     78,  // Kotlin 1.3
};

export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
  success: boolean;
}

// ─── Submit + poll Judge0 ─────────────────────────────────────────────────────

async function submitToJudge0(
  sourceCode: string,
  languageId: number,
  stdin?: string
): Promise<ExecutionResult> {
  const apiKey   = config.judge0.apiKey;
  const apiUrl   = config.judge0.apiUrl;

  if (!apiKey) throw new Error('JUDGE0_API_KEY not configured');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  };

  // Submit
  const submitRes = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin ?? '',
      cpu_time_limit: 5,
      wall_time_limit: 10,
      memory_limit: 128000,
      max_output_size: 10240,
      enable_network: false,
    }),
  });

  if (!submitRes.ok) {
    throw new Error(`Judge0 submission failed: ${submitRes.status} ${submitRes.statusText}`);
  }

  const result = await submitRes.json() as any;

  return {
    stdout:         result.stdout ?? null,
    stderr:         result.stderr ?? null,
    compile_output: result.compile_output ?? null,
    status:         result.status ?? { id: 0, description: 'Unknown' },
    time:           result.time ?? null,
    memory:         result.memory ?? null,
    success:        result.status?.id === 3, // 3 = Accepted
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function executeCode(
  code: string,
  language: string,
  stdin?: string
): Promise<ExecutionResult> {
  const langKey = language.toLowerCase().replace(/[^a-z]/g, '');
  const languageId = LANGUAGE_IDS[langKey];

  if (!languageId) {
    return {
      stdout: null,
      stderr: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}`,
      compile_output: null,
      status: { id: 6, description: 'Compilation Error' },
      time: null,
      memory: null,
      success: false,
    };
  }

  try {
    return await submitToJudge0(code, languageId, stdin);
  } catch (err: any) {
    logger.warn('Judge0 execution failed, returning error result', { message: err.message });
    return {
      stdout: null,
      stderr: err.message ?? 'Code execution service unavailable',
      compile_output: null,
      status: { id: 0, description: 'Service Unavailable' },
      time: null,
      memory: null,
      success: false,
    };
  }
}

export const judge0Service = { executeCode, executeMultiple, LANGUAGE_IDS };

// ─── Execute against multiple test cases ─────────────────────────────────────

export interface TestCase {
  input: string;
  expected: string;
}

export interface TestCaseResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string | null;
  stderr: string | null;
  status: string;
  time?: string;
}

export async function executeMultiple(
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<TestCaseResult[]> {
  const results: TestCaseResult[] = [];

  for (const testCase of testCases) {
    const result = await executeCode(code, language, testCase.input);
    const actual = result.stdout?.trim() || '';
    const expected = testCase.expected.trim();
    const passed = actual === expected;

    results.push({
      passed,
      input: testCase.input,
      expected: testCase.expected,
      actual,
      stderr: result.stderr,
      status: result.status.description,
      time: result.time || undefined,
    });
  }

  return results;
}

// ─── Class wrapper (for legacy import compatibility) ───────────────────────────

export class Judge0Service {
  async execute(code: string, language: string, stdin?: string) {
    return executeCode(code, language, stdin);
  }

  async executeMultiple(code: string, language: string, testCases: TestCase[]) {
    return executeMultiple(code, language, testCases);
  }
}
