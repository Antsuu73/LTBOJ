// lib/judge0.ts
export const LANGUAGE_IDS: Record<string, number> = {
  python: 71,   // Python 3.8.1
  cpp: 54,      // C++ (GCC 9.2.0)
}

export interface ExecuteResult {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  status: { id: number; description: string }
  time: string | null
  memory: number | null
}

export async function executeCode(
  code: string,
  language: string,
  stdin: string
): Promise<ExecuteResult> {
  const apiKey = process.env.JUDGE0_API_KEY
  const apiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'

  // Demo mode khi chưa có API key
  if (!apiKey || apiKey === 'placeholder-judge0-key') {
    return getMockResult(code, language, stdin)
  }

  const submitRes = await fetch(`${apiUrl}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    body: JSON.stringify({
      language_id: LANGUAGE_IDS[language] || 71,
      source_code: Buffer.from(code).toString('base64'),
      stdin: Buffer.from(stdin).toString('base64'),
      cpu_time_limit: 5,
      memory_limit: 256000,
    }),
  })

  const result = await submitRes.json()

  return {
    stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : null,
    stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
    compile_output: result.compile_output
      ? Buffer.from(result.compile_output, 'base64').toString()
      : null,
    status: result.status,
    time: result.time,
    memory: result.memory,
  }
}

// Mock results khi chưa có Judge0 key
function getMockResult(code: string, language: string, stdin: string): ExecuteResult {
  const lower = code.toLowerCase()

  // Simulate basic logic
  let stdout = ''

  if (language === 'python') {
    if (lower.includes('print')) {
      if (lower.includes('hello')) stdout = 'Hello, World!\n'
      else if (stdin) {
        const nums = stdin.trim().split(/\s+/).map(Number)
        if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
          stdout = (nums[0] + nums[1]).toString() + '\n'
        } else {
          stdout = stdin + '\n'
        }
      } else {
        stdout = '[Demo Mode] Code executed successfully\n'
      }
    }
  } else if (language === 'cpp') {
    if (lower.includes('cout')) {
      if (lower.includes('hello')) stdout = 'Hello, World!\n'
      else if (stdin) {
        const nums = stdin.trim().split(/\s+/).map(Number)
        if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
          stdout = (nums[0] + nums[1]).toString() + '\n'
        } else {
          stdout = stdin + '\n'
        }
      } else {
        stdout = '[Demo Mode] Code executed successfully\n'
      }
    }
  }

  return {
    stdout: stdout || '[Demo Mode] No output detected\n',
    stderr: null,
    compile_output: null,
    status: { id: 3, description: 'Accepted' },
    time: '0.042',
    memory: 3456,
  }
}
