'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface TestCase {
  id: string
  input: string
  expected_output: string
  is_sample: boolean
}

export default function MakePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [inputFormat, setInputFormat] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [constraints, setConstraints] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [timeLimit, setTimeLimit] = useState(1000)
  const [memoryLimit, setMemoryLimit] = useState(256)
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', expected_output: '', is_sample: true },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [activePreviewTab, setActivePreviewTab] = useState<'edit' | 'preview'>('edit')

  const addTestCase = () => {
    setTestCases(prev => [...prev, {
      id: String(Date.now()),
      input: '',
      expected_output: '',
      is_sample: false,
    }])
  }

  const removeTestCase = (id: string) => {
    if (testCases.length === 1) {
      toast.error('Phải có ít nhất 1 test case!')
      return
    }
    setTestCases(prev => prev.filter(tc => tc.id !== id))
  }

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(prev => prev.map(tc =>
      tc.id === id ? { ...tc, [field]: value } : tc
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return toast.error('Vui lòng nhập tiêu đề!')
    if (!description.trim()) return toast.error('Vui lòng nhập đề bài!')
    if (testCases.some(tc => !tc.expected_output.trim())) {
      return toast.error('Mỗi test case phải có Expected Output!')
    }

    setSubmitting(true)

    // Demo: simulate save
    await new Promise(r => setTimeout(r, 1200))
    toast.success('✅ Bài toán đã được tạo! (Demo mode - chưa lưu thực)')
    setSubmitting(false)
  }

  return (
    <div className="make-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">✏️ Make a Problem</h1>
        <p className="page-subtitle">
          Tạo bài toán của riêng bạn với test cases tùy chỉnh
        </p>
      </div>

      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        ⚠️ <strong>Demo Mode:</strong> Bài toán sẽ được lưu vào Supabase sau khi bạn cấu hình database.
      </div>

      <form onSubmit={handleSubmit} className="make-form">
        {/* Basic Info */}
        <div className="make-section">
          <div className="make-section-title">
            📋 Thông tin cơ bản
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Tiêu đề bài toán *</label>
              <input
                className="form-input"
                placeholder="VD: Two Sum, Longest Palindrome..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Độ khó</label>
                <select
                  className="form-input form-select"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Time Limit (ms)</label>
                <input
                  className="form-input"
                  type="number"
                  value={timeLimit}
                  onChange={e => setTimeLimit(Number(e.target.value))}
                  min={100}
                  max={10000}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Memory Limit (MB)</label>
                <input
                  className="form-input"
                  type="number"
                  value={memoryLimit}
                  onChange={e => setMemoryLimit(Number(e.target.value))}
                  min={16}
                  max={1024}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="make-section">
          <div className="make-section-title">
            📝 Đề bài (Markdown + LaTeX)
          </div>

          <div style={{ display: 'flex', gap: '0', marginBottom: '12px' }}>
            {['edit', 'preview'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePreviewTab(tab as 'edit' | 'preview')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border)',
                  background: activePreviewTab === tab ? 'var(--accent-glow)' : 'var(--bg-surface)',
                  color: activePreviewTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: tab === 'edit' ? 'var(--radius) 0 0 var(--radius)' : '0 var(--radius) var(--radius) 0',
                  borderRight: tab === 'edit' ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'edit' ? '✏️ Edit' : '👁 Preview'}
              </button>
            ))}
          </div>

          {activePreviewTab === 'edit' ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Mô tả bài toán *</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder={`# Tiêu đề\n\nMô tả bài toán...\n\nSử dụng $a + b$ cho công thức inline\nHoặc $$\\sum_{i=1}^{n} i$$ cho block`}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ minHeight: '150px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Định dạng Input</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Dòng 1: Số nguyên $n$ $(1 \le n \le 10^5)$"
                  value={inputFormat}
                  onChange={e => setInputFormat(e.target.value)}
                  style={{ minHeight: '80px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Định dạng Output</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="In ra một số nguyên là kết quả."
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value)}
                  style={{ minHeight: '80px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ràng buộc</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder={`- $1 \\le n \\le 10^5$\n- Số nguyên dương`}
                  value={constraints}
                  onChange={e => setConstraints(e.target.value)}
                  style={{ minHeight: '80px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                />
              </div>
            </div>
          ) : (
            <div className="markdown-body" style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              minHeight: '200px',
            }}>
              {description ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>
                  Preview sẽ render Markdown + LaTeX (cần import động)
                </p>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Nhập nội dung để xem preview...</p>
              )}
              <div style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {description}
              </div>
            </div>
          )}
        </div>

        {/* Test Cases */}
        <div className="make-section">
          <div className="make-section-title">
            🧪 Test Cases
            <span style={{
              marginLeft: 'auto',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-muted)',
            }}>
              {testCases.length} test case
            </span>
          </div>

          {testCases.map((tc, index) => (
            <div key={tc.id} className="testcase-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div className="testcase-num">Test Case #{index + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      checked={tc.is_sample}
                      onChange={e => updateTestCase(tc.id, 'is_sample', e.target.checked)}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    Sample (hiển thị công khai)
                  </label>
                  <button
                    type="button"
                    onClick={() => removeTestCase(tc.id)}
                    style={{
                      background: 'none', border: 'none',
                      color: 'var(--error)', cursor: 'pointer',
                      fontSize: '18px', lineHeight: 1, padding: '2px',
                      transition: 'opacity 0.2s',
                    }}
                    title="Xóa test case"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Input</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Nhập input..."
                    value={tc.input}
                    onChange={e => updateTestCase(tc.id, 'input', e.target.value)}
                    style={{
                      minHeight: '80px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Output *</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Kết quả mong đợi..."
                    value={tc.expected_output}
                    onChange={e => updateTestCase(tc.id, 'expected_output', e.target.value)}
                    style={{
                      minHeight: '80px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      borderColor: !tc.expected_output.trim() ? 'rgba(239,68,68,0.3)' : 'var(--border)',
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTestCase}
            className="btn btn-ghost btn-sm"
            style={{ marginTop: '8px' }}
          >
            + Thêm test case
          </button>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <button type="button" className="btn btn-ghost" onClick={() => window.history.back()}>
            Hủy
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${submitting ? 'animate-pulse' : ''}`}
            disabled={submitting}
            style={{ minWidth: '160px' }}
          >
            {submitting ? (
              <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang lưu...</>
            ) : (
              '🚀 Tạo bài toán'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
