import { cn, formatDate, formatDuration, slugify } from '../lib/utils'

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const cond = true
    expect(cn('foo', cond && 'bar')).toBe('foo bar')
    expect(cn('foo', false && 'bar')).toBe('foo')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('', 'foo')).toBe('foo')
  })
})

describe('formatDate', () => {
  it('formats Date objects', () => {
    const result = formatDate(new Date('2024-03-15'))
    expect(result).toContain('Mar')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats string dates', () => {
    const result = formatDate('2024-01-01')
    expect(result).toContain('Jan')
  })
})

describe('formatDuration', () => {
  it('formats minutes only', () => {
    expect(formatDuration(300)).toBe('5m')
    expect(formatDuration(60)).toBe('1m')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(3660)).toBe('1h 1m')
    expect(formatDuration(7200)).toBe('2h 0m')
  })
})

describe('slugify', () => {
  it('converts text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('React JS')).toBe('react-js')
  })

  it('removes special characters', () => {
    expect(slugify('Test @#$%')).toBe('test')
  })

  it('handles underscores and hyphens', () => {
    expect(slugify('foo_bar-baz')).toBe('foo-bar-baz')
  })

  it('trims leading/trailing hyphens', () => {
    expect(slugify('  test  ')).toBe('test')
  })
})
