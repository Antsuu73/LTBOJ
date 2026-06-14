'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isDemoMode =
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return toast.error('Mật khẩu xác nhận không khớp!')
    }
    if (password.length < 8) {
      return toast.error('Mật khẩu phải có ít nhất 8 ký tự!')
    }
    if (username.length < 3) {
      return toast.error('Username phải có ít nhất 3 ký tự!')
    }

    setLoading(true)
    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 900))
        toast.success('✅ Demo đăng ký thành công!')
        router.push('/login')
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      if (error) throw error
      toast.success('✅ Đăng ký thành công! Kiểm tra email để xác nhận.')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Yếu', color: '#ef4444', width: '30%' }
    if (password.length < 10) return { label: 'Trung bình', color: '#f59e0b', width: '60%' }
    return { label: 'Mạnh', color: '#10b981', width: '100%' }
  }

  const strength = passwordStrength()

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

        <h1 className="auth-title">Tạo tài khoản 🚀</h1>
        <p className="auth-subtitle">Tham gia cộng đồng lập trình miễn phí</p>

        {isDemoMode && (
          <div className="demo-banner" style={{ marginBottom: '20px' }}>
            ⚠️ <strong>Demo Mode</strong> — Chưa có Supabase. Tài khoản sẽ không được lưu thực sự.
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="coderxyz"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              required
              minLength={3}
              maxLength={20}
            />
            {username && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Profile: @{username}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              className="form-input"
              type="password"
              placeholder="Ít nhất 8 ký tự"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {strength && (
              <div style={{ marginTop: '6px' }}>
                <div style={{
                  height: '3px',
                  background: 'var(--bg-surface)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: strength.width,
                    background: strength.color,
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                  }} />
                </div>
                <div style={{ fontSize: '11px', color: strength.color, marginTop: '3px' }}>
                  Độ mạnh: {strength.label}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              className="form-input"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{
                borderColor: confirmPassword && confirmPassword !== password
                  ? 'var(--error)'
                  : confirmPassword && confirmPassword === password
                  ? 'var(--success)'
                  : 'var(--border)',
              }}
            />
            {confirmPassword && confirmPassword !== password && (
              <div style={{ fontSize: '12px', color: 'var(--error)', marginTop: '4px' }}>
                ✗ Mật khẩu không khớp
              </div>
            )}
            {confirmPassword && confirmPassword === password && (
              <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>
                ✓ Mật khẩu khớp
              </div>
            )}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <span style={{ color: 'var(--accent-primary)' }}>Điều khoản dịch vụ</span>{' '}
            và{' '}
            <span style={{ color: 'var(--accent-primary)' }}>Chính sách bảo mật</span>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'animate-pulse' : ''}`}
            style={{ padding: '13px', fontSize: '15px', fontWeight: 700 }}
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
          >
            {loading ? (
              <><span className="spinner" /> Đang tạo tài khoản...</>
            ) : (
              '🚀 Đăng ký miễn phí'
            )}
          </button>
        </form>

        <div className="auth-link-row">
          Đã có tài khoản?{' '}
          <Link href="/login" className="auth-link">Đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}
