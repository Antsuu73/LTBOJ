'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_POSTS } from '@/lib/mockData'

const ALL_TAGS = ['All', 'Dynamic Programming', 'Algorithms', 'Data Structures', 'C++', 'Big O', 'Tutorial']

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const filtered = useMemo(() => {
    return MOCK_POSTS.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
      const matchTag = activeTag === 'All' || p.tags.includes(activeTag)
      return matchSearch && matchTag
    })
  }, [search, activeTag])

  return (
    <div className="posts-page">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">📝 Posts</h1>
            <p className="page-subtitle">
              Bài viết về thuật toán, cấu trúc dữ liệu và lập trình thi đấu
            </p>
          </div>
          <Link href="/posts/new" className="btn btn-primary">
            ✏️ Viết bài mới
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          className="filter-input"
          style={{ width: '100%' }}
          placeholder="🔍 Tìm kiếm bài viết..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            className={`filter-btn ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">Không có bài viết</div>
          <div className="empty-desc">Hãy là người đầu tiên chia sẻ kiến thức!</div>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map(post => (
            <Link key={post.id} href={`/posts/${post.id}`} className="post-card">
              <div className="post-card-meta">
                <div className="post-author-avatar">
                  {post.author[0]}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {post.author}
                </span>
                <span>·</span>
                <span>{timeAgo(post.created_at)}</span>
                <span>·</span>
                <span>👁 {post.views.toLocaleString()}</span>
              </div>

              <h2 className="post-card-title">{post.title}</h2>

              <p className="post-card-excerpt">
                {post.content.slice(0, 200).replace(/[#*`]/g, '')}...
              </p>

              <div className="post-card-footer">
                <div className="post-tags">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="badge badge-tag" style={{ fontSize: '11px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="post-stats">
                  <span className="post-stat">❤️ {post.likes}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
