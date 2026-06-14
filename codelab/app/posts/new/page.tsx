'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

const AVAILABLE_TAGS = [
  'Algorithms', 'Dynamic Programming', 'Data Structures',
  'C++', 'Python', 'Graph Theory', 'Big O', 'Tutorial',
  'Tips & Tricks', 'Math', 'System Design', 'Competitive Programming',
]

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 5)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Nhập tiêu đề bài viết!')
    if (!content.trim() || content.length < 50) return toast.error('Nội dung quá ngắn (ít nhất 50 ký tự)!')

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('✅ Bài viết đã được đăng! (Demo mode)')
    router.push('/posts')
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '100px 24px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/posts" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          ← Quay lại
        </Link>
        <h1 className="page-title" style={{ margin: 0 }}>✏️ Viết bài mới</h1>
      </div>

      <div className="demo-banner" style={{ marginBottom: '24px' }}>
        ⚠️ <strong>Demo Mode:</strong> Bài viết chưa lưu thực sự. Cần cấu hình Supabase để lưu.
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input
              className="form-input"
              placeholder="Tiêu đề bài viết hấp dẫn..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ fontSize: '18px', fontWeight: 600, padding: '14px 18px' }}
              required
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (chọn tối đa 5)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '6px 14px',
                    border: '1px solid',
                    borderColor: selectedTags.includes(tag) ? 'var(--accent-primary)' : 'var(--border)',
                    borderRadius: '100px',
                    background: selectedTags.includes(tag) ? 'var(--accent-glow)' : 'var(--bg-surface)',
                    color: selectedTags.includes(tag) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Nội dung * (Markdown + LaTeX)</label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="btn btn-ghost btn-sm"
              >
                {preview ? '✏️ Edit' : '👁 Preview'}
              </button>
            </div>

            {!preview ? (
              <textarea
                className="form-input form-textarea"
                placeholder={`# Tiêu đề

## Giới thiệu
Viết nội dung ở đây...

## Code Example
\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

## Công thức
Inline: $O(n \\log n)$
Block: $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$`}
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{
                  minHeight: '400px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                }}
                required
              />
            ) : (
              <div className="markdown-body" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                minHeight: '400px',
              }}>
                {content ? (
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: '15px', lineHeight: '1.8' }}>
                    {content}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Nội dung sẽ hiển thị ở đây...</p>
                )}
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              {content.length} ký tự · Hỗ trợ Markdown và LaTeX ($...$)
            </div>
          </div>

          {/* Tips */}
          <div style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
          }}>
            <strong style={{ color: 'var(--accent-primary)' }}>💡 Mẹo viết bài hay:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Dùng <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a5b4fc' }}>```python``` </code> hoặc <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a5b4fc' }}>```cpp``` </code> cho code blocks</li>
              <li>Công thức: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a5b4fc' }}>$O(n)$</code> (inline) hoặc <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a5b4fc' }}>$$...$$</code> (block)</li>
              <li>Dùng bảng Markdown để so sánh độ phức tạp</li>
              <li>Thêm ví dụ cụ thể để người đọc dễ hiểu hơn</li>
            </ul>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingBottom: '20px' }}>
            <Link href="/posts" className="btn btn-ghost">
              Hủy
            </Link>
            <button
              type="submit"
              className={`btn btn-primary ${submitting ? 'animate-pulse' : ''}`}
              disabled={submitting}
              style={{ minWidth: '140px' }}
            >
              {submitting ? (
                <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang đăng...</>
              ) : (
                '🚀 Đăng bài'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
