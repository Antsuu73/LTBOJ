// app/problems/page.tsx
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_PROBLEMS } from '@/lib/mockData'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const CATEGORIES = ['All', 'Basics', 'Math', 'Dynamic Programming', 'Algorithms']

export default function ProblemsPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return MOCK_PROBLEMS.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchDiff = difficulty === 'All' || p.difficulty === difficulty
      const matchCat = category === 'All' || p.category === category
      return matchSearch && matchDiff && matchCat
    })
  }, [search, difficulty, category])

  const stats = {
    total: MOCK_PROBLEMS.length,
    easy: MOCK_PROBLEMS.filter(p => p.difficulty === 'Easy').length,
    medium: MOCK_PROBLEMS.filter(p => p.difficulty === 'Medium').length,
    hard: MOCK_PROBLEMS.filter(p => p.difficulty === 'Hard').length,
  }

  return (
    <div className="problems-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">⚡ Problems</h1>
        <p className="page-subtitle">
          Chinh phục {stats.total} bài toán từ cơ bản đến nâng cao
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Total', value: stats.total, color: 'var(--text-primary)' },
            { label: 'Easy', value: stats.easy, color: 'var(--easy)' },
            { label: 'Medium', value: stats.medium, color: 'var(--medium)' },
            { label: 'Hard', value: stats.hard, color: 'var(--hard)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '100px',
              padding: '6px 16px',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              <span style={{ color }}>{value}</span>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="🔍 Tìm kiếm bài toán..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`filter-btn ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <select
          className="form-input form-select"
          style={{ width: 'auto', padding: '10px 40px 10px 14px' }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Không tìm thấy bài toán</div>
          <div className="empty-desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
        </div>
      ) : (
        <table className="problems-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th>Tên bài</th>
              <th>Chủ đề</th>
              <th>Độ khó</th>
              <th>Đã giải</th>
              <th style={{ width: '80px' }}>Ngôn ngữ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem, index) => (
              <tr key={problem.id}>
                <td style={{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}>
                  {index + 1}
                </td>
                <td>
                  <Link
                    href={`/problems/${problem.id}`}
                    className="problem-title-link"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td>
                  <span className="badge badge-tag" style={{ fontSize: '12px' }}>
                    {problem.category}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {problem.solved_count.toLocaleString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(6, 182, 212, 0.12)',
                      color: '#06b6d4',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                    }}>
                      PY
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: '#6366f1',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                      C++
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
