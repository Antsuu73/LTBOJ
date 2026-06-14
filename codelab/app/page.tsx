// app/page.tsx
'use client'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: '⚡',
      title: 'Bài toán thuật toán',
      desc: 'Hàng trăm bài từ cơ bản đến nâng cao. Phân loại theo chủ đề và độ khó để bạn học theo lộ trình.',
    },
    {
      icon: '💻',
      title: 'Code Editor mạnh mẽ',
      desc: 'Monaco Editor (VS Code) hỗ trợ Python và C++ với syntax highlighting, auto-complete và nhiều tính năng pro.',
    },
    {
      icon: '🧪',
      title: 'Chạy test case thực',
      desc: 'Submit code và xem kết quả ngay. PASS/FAIL cho từng test case, so sánh output của bạn với kết quả đúng.',
    },
    {
      icon: '✏️',
      title: 'Tự tạo bài toán',
      desc: 'Trang Make cho phép bạn tạo bài toán riêng với test case tùy chỉnh. Chia sẻ với cộng đồng!',
    },
    {
      icon: '📝',
      title: 'Blog công nghệ',
      desc: 'Đọc và đăng bài viết về thuật toán, cấu trúc dữ liệu, kinh nghiệm lập trình thi đấu.',
    },
    {
      icon: '🏆',
      title: 'Theo dõi tiến độ',
      desc: 'Xem số bài đã giải, ngôn ngữ sử dụng và lịch sử submission của bạn.',
    },
  ]

  const stats = [
    { value: '100+', label: 'Bài toán' },
    { value: '2', label: 'Ngôn ngữ' },
    { value: '6', label: 'Chủ đề' },
    { value: '∞', label: 'Tiềm năng' },
  ]

  const categories = [
    { name: 'Basics', count: 15, color: '#10b981' },
    { name: 'Math', count: 20, color: '#6366f1' },
    { name: 'Arrays', count: 25, color: '#06b6d4' },
    { name: 'Dynamic Programming', count: 30, color: '#f59e0b' },
    { name: 'Graphs', count: 18, color: '#8b5cf6' },
    { name: 'Algorithms', count: 22, color: '#ef4444' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          ✨ Học lập trình theo phong cách Codeforces
        </div>
        <h1 className="hero-title">
          Code<span className="gradient-text">Lab</span>
        </h1>
        <p className="hero-subtitle">
          Nền tảng học thuật toán và lập trình thi đấu. Giải bài toán với Python và C++,
          tạo bài của riêng bạn, và chia sẻ kiến thức với cộng đồng.
        </p>
        <div className="hero-actions">
          <Link href="/problems" className="btn btn-primary btn-lg">
            ⚡ Bắt đầu giải bài
          </Link>
          <Link href="/posts" className="btn btn-ghost btn-lg">
            📝 Đọc bài viết
          </Link>
        </div>

        <div className="hero-stats">
          {stats.map(({ value, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{
        padding: '0 24px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          Khám phá theo chủ đề
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {categories.map(({ name, count, color }) => (
            <Link
              key={name}
              href={`/problems?category=${encodeURIComponent(name)}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                display: 'block',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = color
                el.style.boxShadow = `0 0 20px ${color}20`
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                fontSize: '28px',
                fontWeight: 800,
                color,
                marginBottom: '6px',
              }}>
                {count}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}>
                {name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)' }}>
        <div className="features-grid">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center',
        padding: '80px 24px',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          marginBottom: '16px',
        }}>
          Sẵn sàng bắt đầu?
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '18px',
          marginBottom: '32px',
          maxWidth: '480px',
          margin: '0 auto 32px',
        }}>
          Tạo tài khoản miễn phí và bắt đầu hành trình chinh phục thuật toán ngay hôm nay.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-primary btn-lg">
            🚀 Đăng ký miễn phí
          </Link>
          <Link href="/problems" className="btn btn-secondary btn-lg">
            Xem bài toán
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '18px',
          background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
        }}>
          CodeLab
        </div>
        <p>Nền tảng học lập trình — Python & C++</p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          Inspired by Codeforces & CSES
        </p>
      </footer>
    </>
  )
}
