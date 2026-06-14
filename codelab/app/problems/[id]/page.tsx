'use client'
import { useState, use, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { MOCK_PROBLEMS } from '@/lib/mockData'
import { TEMPLATES } from '@/components/CodeEditor'
import toast from 'react-hot-toast'

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false })

type TestResult = {
  id: string
  input: string
  expected: string
  actual: string | null
  status: 'pending' | 'running' | 'pass' | 'fail' | 'error'
  time?: string
  stderr?: string | null
  expanded: boolean
}

export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const problem = MOCK_PROBLEMS.find(p => p.id === id)

  const [language, setLanguage] = useState<'python' | 'cpp'>('python')
  const [code, setCode] = useState(TEMPLATES.python.default)
  const [activeTab, setActiveTab] = useState<'statement' | 'editorial'>('statement')
  const [results, setResults] = useState<TestResult[]>([])
  const [running, setRunning] = useState(false)
  const [runMode, setRunMode] = useState<'sample' | 'all'>('sample')
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    setIsDemoMode(
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    )
  }, [])

  useEffect(() => {
    setCode(TEMPLATES[language].default)
  }, [language])

  if (!problem) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ fontSize: '48px' }}>😕</div>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>Không tìm thấy bài toán</div>
        <a href="/problems" className="btn btn-primary">← Quay lại danh sách</a>
      </div>
    )
  }

  const testCasesToRun = runMode === 'sample'
    ? problem.test_cases.filter(tc => tc.is_sample)
    : problem.test_cases

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập code trước khi chạy!')
      return
    }

    setRunning(true)

    const initialResults: TestResult[] = testCasesToRun.map(tc => ({
      id: tc.id,
      input: tc.input,
      expected: tc.expected_output,
      actual: null,
      status: 'pending',
      expanded: false,
    }))
    setResults(initialResults)

    let passed = 0
    const updatedResults = [...initialResults]

    for (let i = 0; i < testCasesToRun.length; i++) {
      const tc = testCasesToRun[i]

      // Mark as running
      updatedResults[i] = { ...updatedResults[i], status: 'running' }
      setResults([...updatedResults])

      try {
        const res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, stdin: tc.input }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Execution failed')

        const actual = (data.stdout || '').trim()
        const expected = tc.expected_output.trim()
        const isPassed = actual === expected

        if (isPassed) passed++

        updatedResults[i] = {
          ...updatedResults[i],
          actual,
          status: isPassed ? 'pass' : 'fail',
          time: data.time,
          stderr: data.stderr || data.compile_output,
          expanded: !isPassed,
        }
        setResults([...updatedResults])

      } catch (err: any) {
        updatedResults[i] = {
          ...updatedResults[i],
          actual: null,
          status: 'error',
          stderr: err.message,
          expanded: true,
        }
        setResults([...updatedResults])
      }
    }

    setRunning(false)

    const total = testCasesToRun.length
    if (passed === total) {
      toast.success(`🎉 Tất cả ${total} test case PASS!`)
    } else {
      toast.error(`${passed}/${total} test case PASS`)
    }
  }

  const toggleExpand = (index: number) => {
    setResults(prev => prev.map((r, i) =>
      i === index ? { ...r, expanded: !r.expanded } : r
    ))
  }

  const passCount = results.filter(r => r.status === 'pass').length
  const failCount = results.filter(r => r.status === 'fail').length
  const totalRan = results.filter(r => r.status !== 'pending').length

  const difficultyColors: Record<string, string> = {
    Easy: 'var(--easy)',
    Medium: 'var(--medium)',
    Hard: 'var(--hard)',
  }

  return (
    <div className="problem-layout">
      {/* ===== LEFT: Editor Panel ===== */}
      <div className="editor-panel">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <span className="editor-toolbar-title">Code Editor</span>

          <select
            className="lang-select"
            value={language}
            onChange={e => setLanguage(e.target.value as 'python' | 'cpp')}
          >
            <option value="python">🐍 Python 3</option>
            <option value="cpp">⚙️ C++ 17</option>
          </select>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={runMode === 'all'}
                onChange={e => setRunMode(e.target.checked ? 'all' : 'sample')}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              All tests
            </label>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCode(TEMPLATES[language].default)}
              title="Reset về code mẫu"
            >
              ↺ Reset
            </button>

            <button
              className={`btn btn-success btn-sm ${running ? 'animate-pulse' : ''}`}
              onClick={runCode}
              disabled={running}
              style={{ minWidth: '100px' }}
            >
              {running ? (
                <><span className="spinner" style={{ width: 14, height: 14 }} /> Đang chạy...</>
              ) : (
                '▶ Chạy Code'
              )}
            </button>
          </div>
        </div>

        {/* Demo Banner */}
        {isDemoMode && (
          <div className="demo-banner" style={{ margin: '8px 12px 0', borderRadius: 'var(--radius)' }}>
            ⚠️ <strong>Demo Mode:</strong> Kết quả giả lập. Thêm Judge0 API key để chạy code thực tế.
          </div>
        )}

        {/* Monaco Editor */}
        <div className="monaco-wrapper">
          <CodeEditor
            language={language}
            value={code}
            onChange={setCode}
          />
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <div className="results-toolbar">
            <span className="results-title">
              📊 Test Cases
              {runMode === 'all' && (
                <span style={{ color: 'var(--warning)', marginLeft: '6px', fontWeight: 500 }}>
                  (tất cả)
                </span>
              )}
            </span>
            {results.length > 0 && (
              <div className="results-summary">
                <span style={{ color: 'var(--success)' }}>✓ {passCount} PASS</span>
                <span style={{ color: 'var(--error)' }}>✗ {failCount} FAIL</span>
                <span style={{ color: 'var(--text-muted)' }}>{totalRan}/{results.length}</span>
              </div>
            )}
          </div>

          <div className="results-content">
            {results.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '32px 16px',
                color: 'var(--text-muted)', fontSize: '13px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>▶</div>
                Nhấn <strong style={{ color: 'var(--text-secondary)' }}>"Chạy Code"</strong> để xem kết quả test cases
              </div>
            )}

            {results.map((result, index) => (
              <div
                key={result.id}
                className={`test-result ${result.status === 'pass' ? 'pass' : result.status === 'fail' || result.status === 'error' ? 'fail' : 'running'}`}
              >
                <div
                  className="test-result-header"
                  onClick={() => result.status !== 'running' && toggleExpand(index)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>
                      {result.status === 'pass' ? '✅' :
                       result.status === 'fail' ? '❌' :
                       result.status === 'error' ? '⚠️' :
                       result.status === 'running' ? '⟳' : '○'}
                    </span>
                    <span>
                      Test Case #{index + 1}
                      {!testCasesToRun[index]?.is_sample && (
                        <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}>
                          (hidden)
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                    {result.time && (
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        ⏱ {result.time}s
                      </span>
                    )}
                    {result.status !== 'running' && result.status !== 'pending' && (
                      <span style={{ opacity: 0.6 }}>{result.expanded ? '▲' : '▼'}</span>
                    )}
                    {result.status === 'running' && (
                      <span className="spinner" />
                    )}
                  </div>
                </div>

                {result.expanded && result.status !== 'running' && result.status !== 'pending' && (
                  <div className="test-result-body">
                    {result.stderr && (
                      <div style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px',
                        marginBottom: '12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: '#fca5a5',
                        whiteSpace: 'pre-wrap',
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--error)' }}>
                          ⚠ Error / Compile Output:
                        </div>
                        {result.stderr}
                      </div>
                    )}
                    <div className="test-detail-grid">
                      <div>
                        <div className="test-detail-label">📥 Input</div>
                        <div className="test-detail-value">
                          {result.input || <em style={{ opacity: 0.5 }}>no input</em>}
                        </div>
                      </div>
                      <div>
                        <div className="test-detail-label">✅ Expected Output</div>
                        <div className="test-detail-value" style={{
                          borderColor: 'rgba(16,185,129,0.25)',
                        }}>
                          {result.expected}
                        </div>
                      </div>
                      <div>
                        <div className="test-detail-label">
                          {result.status === 'pass' ? '✅' : '❌'} Your Output
                        </div>
                        <div className="test-detail-value" style={{
                          borderColor: result.status === 'pass'
                            ? 'rgba(16,185,129,0.25)'
                            : 'rgba(239,68,68,0.25)',
                        }}>
                          {result.actual ?? <em style={{ opacity: 0.5 }}>no output</em>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT: Statement Panel ===== */}
      <div className="statement-panel">
        {/* Tabs */}
        <div className="statement-tabs">
          <button
            className={`statement-tab ${activeTab === 'statement' ? 'active' : ''}`}
            onClick={() => setActiveTab('statement')}
          >
            📄 Đề bài
          </button>
          <button
            className={`statement-tab ${activeTab === 'editorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('editorial')}
          >
            💡 Gợi ý
          </button>
        </div>

        <div className="statement-content">
          {activeTab === 'statement' ? (
            <>
              {/* Problem Header */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                  <span className="badge badge-tag">{problem.category}</span>
                </div>

                <h1 style={{
                  fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px',
                  lineHeight: 1.3, marginBottom: '12px',
                }}>
                  {problem.title}
                </h1>

                <div className="meta-chips">
                  <span className="meta-chip">⏱ {problem.time_limit}ms</span>
                  <span className="meta-chip">💾 {problem.memory_limit}MB</span>
                  <span className="meta-chip">✅ {problem.solved_count.toLocaleString()} solved</span>
                  <span className="meta-chip">👤 {problem.author}</span>
                </div>
              </div>

              {/* Description */}
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {problem.description}
                </ReactMarkdown>
              </div>

              {/* Input Format */}
              <div className="info-box" style={{ marginTop: '24px' }}>
                <div className="info-box-title">📥 Input</div>
                <div className="markdown-body" style={{ fontSize: '14px' }}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {problem.input_format}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Output Format */}
              <div className="info-box">
                <div className="info-box-title">📤 Output</div>
                <div className="markdown-body" style={{ fontSize: '14px' }}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {problem.output_format}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Constraints */}
              <div className="info-box">
                <div className="info-box-title">⚠️ Ràng buộc</div>
                <div className="markdown-body" style={{ fontSize: '14px' }}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {problem.constraints}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Sample Test Cases */}
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px',
                }}>
                  📋 Sample Test Cases
                </div>

                {problem.test_cases.filter(tc => tc.is_sample).map((tc, i) => (
                  <div key={tc.id} style={{ marginBottom: '16px' }}>
                    <div style={{
                      fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)',
                      marginBottom: '8px',
                    }}>
                      Example {i + 1}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <div style={{
                          fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                          marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>Input</div>
                        <pre style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          margin: 0,
                          overflowX: 'auto',
                        }}>
                          {tc.input || '(empty)'}
                        </pre>
                      </div>
                      <div>
                        <div style={{
                          fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                          marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>Output</div>
                        <pre style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid rgba(16,185,129,0.2)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          color: '#6ee7b7',
                          margin: 0,
                          overflowX: 'auto',
                        }}>
                          {tc.expected_output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Templates */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div style={{
                  fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px',
                }}>
                  ⚡ Template nhanh
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.keys(TEMPLATES[language]).map(key => (
                    <button
                      key={key}
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const t = TEMPLATES[language][key]
                        if (confirm(`Load template "${key}"? Code hiện tại sẽ bị xóa.`)) {
                          (window as any).__setCode?.(t)
                        }
                      }}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Editorial Tab */
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
                💡 Gợi ý giải
              </h2>
              <div style={{
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Hãy thử tự giải trước khi xem gợi ý. Editorial sẽ được thêm sau khi bạn đã submit ít nhất 1 lần.
                </div>
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
                <p><strong style={{ color: 'var(--text-primary)' }}>Độ phức tạp mục tiêu:</strong></p>
                <p style={{ fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
                  Time: O(n log n) | Space: O(n)
                </p>
                <p style={{ marginTop: '16px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Gợi ý:</strong>
                </p>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Đọc kỹ yêu cầu và ràng buộc</li>
                  <li>Bắt đầu với brute force, sau đó tối ưu</li>
                  <li>Kiểm tra edge cases: n=1, n=0, giá trị lớn nhất</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
