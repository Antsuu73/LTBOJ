'use client'
import { use, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import { MOCK_POSTS } from '@/lib/mockData'
import Link from 'next/link'
import toast from 'react-hot-toast'

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `${diff} giây trước`
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return `${Math.floor(diff / 86400)} ngày trước`
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const post = MOCK_POSTS.find(p => p.id === id)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes ?? 0)

  if (!post) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ fontSize: '48px' }}>😕</div>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>Không tìm thấy bài viết</div>
        <Link href="/posts" className="btn btn-primary">← Quay lại</Link>
      </div>
    )
  }

  const handleLike = () => {
    if (liked) {
      setLiked(false)
      setLikeCount(c => c - 1)
    } else {
      setLiked(true)
      setLikeCount(c => c + 1)
      toast.success('❤️ Đã thích bài viết!')
    }
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '100px 24px 60px' }}>
      {/* Back */}
      <Link
        href="/posts"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-muted)', fontSize: '14px',
          marginBottom: '32px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        ← Tất cả bài viết
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {post.tags.map(tag => (
            <span key={tag} className="badge badge-tag">{tag}</span>
          ))}
        </div>

        <h1 style={{
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          lineHeight: 1.25,
          marginBottom: '20px',
        }}>
          {post.title}
        </h1>

        {/* Author Meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '16px 20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{
            width: '44px', height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 700, color: 'white',
            flexShrink: 0,
          }}>
            {post.author[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{post.author}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {timeAgo(post.created_at)} · 👁 {post.views.toLocaleString()} lượt xem
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                border: '1px solid',
                borderColor: liked ? 'rgba(239,68,68,0.4)' : 'var(--border)',
                borderRadius: '100px',
                background: liked ? 'rgba(239,68,68,0.1)' : 'transparent',
                color: liked ? '#ef4444' : 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {liked ? '❤️' : '🤍'} {likeCount}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="markdown-body" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Other posts */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
          📚 Bài viết khác
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MOCK_POSTS.filter(p => p.id !== id).slice(0, 3).map(p => (
            <Link
              key={p.id}
              href={`/posts/${p.id}`}
              style={{
                display: 'block',
                padding: '16px 20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-accent)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{p.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {p.author} · ❤️ {p.likes}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
