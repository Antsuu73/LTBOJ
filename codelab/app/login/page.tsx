'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isDemoMode =
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 800))
        toast.success('✅ Demo login thành công!')
        router.push('/')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('✅ Đăng nhập thành công!')
      router.push('/problems')
    } catch (err: any) {
      toast.error(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail('demo@codelab.dev')
    setPassword('demo1234')
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 14L10 8L16 14L10 20L4 14Z" fill="#6366f1" />
            <path d="M12 14L18 8L24 14L18 20L12 14Z" fill="#a78bfa" opacity="0.7" />
          </svg>
          CodeLab
        </div>

        <h1 className="auth-title">Chào mừng trở lại! 👋</h1>
        <p className="auth-subtitle">Đăng nhập để tiếp tục hành trình học code</p>

        {isDemoMode && (
          <div className="demo-banner" style={{ marginBottom: '20px' }}>
            ⚠️ <strong>Demo Mode</strong> — Chưa có Supabase.
            <button
              onClick={fillDemo}
              style={{
                marginLeft: '8px',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '4px',
                color: '#fbbf24',
                padding: '2px 8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Fill demo
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'animate-pulse' : ''}`}
            style={{ padding: '13px', fontSize: '15px', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Đang đăng nhập...</>
            ) : (
              '→ Đăng nhập'
            )}
          </button>
        </form>

        <div className="auth-link-row">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="auth-link">Đăng ký ngay</Link>
        </div>

        <div className="auth-link-row" style={{ marginTop: '8px' }}>
          <Link href="/" className="auth-link" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
