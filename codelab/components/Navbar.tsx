'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const isDemoMode =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

    if (!isDemoMode) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data?.user ?? null)
      })
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => listener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMenuOpen(false)
  }

  const navLinks = [
    { href: '/problems', label: 'Problems', icon: '⚡' },
    { href: '/make', label: 'Make', icon: '✏️' },
    { href: '/posts', label: 'Posts', icon: '📝' },
  ]

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'U'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M4 13L9 8L14 13L9 18L4 13Z" fill="#6366f1" />
            <path d="M12 13L17 8L22 13L17 18L12 13Z" fill="#a78bfa" opacity="0.7" />
          </svg>
          CodeLab
        </Link>

        {/* Links */}
        <div className="navbar-links">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`navbar-link ${pathname.startsWith(href) ? 'active' : ''}`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <div style={{ position: 'relative' }}>
              <div
                className="user-avatar"
                onClick={() => setMenuOpen(!menuOpen)}
                title={username}
              >
                {username[0].toUpperCase()}
              </div>
              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '8px',
                  minWidth: '180px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  animation: 'fadeInDown 0.15s ease',
                }}>
                  <div style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '6px',
                  }}>
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--error)',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'left',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background var(--transition)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--error-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  )
}
