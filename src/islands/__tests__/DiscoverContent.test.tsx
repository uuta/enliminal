import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DiscoverContent } from '@/islands/DiscoverContent';

vi.mock('@/lib/client', () => ({
  fetchRandomKeyword: vi.fn().mockResolvedValue({
    title: 'Emergence',
    extract: '創発とは複雑系において...',
    pageUrl: 'https://ja.wikipedia.org/wiki/創発',
  }),
  generateContent: vi.fn().mockResolvedValue({
    category: 'Science',
    definition: 'test def',
    explanation: 'test exp',
    diagram: null,
    useCases: [],
    relatedTerms: [],
  }),
  fetchPapers: vi.fn().mockResolvedValue([]),
  fetchVideos: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/wikipedia', () => ({
  fetchKeywordByTitle: vi.fn().mockResolvedValue({
    title: 'Emergence',
    extract: '創発とは複雑系において...',
    pageUrl: 'https://ja.wikipedia.org/wiki/創発',
  }),
}));

describe('DiscoverContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('マウント時にrevealコンテナが表示される', () => {
    render(<DiscoverContent sources="wikipedia" />);
    expect(screen.getByTestId('reveal-container')).toBeInTheDocument();
  });

  it('キーワードが表示される', async () => {
    render(<DiscoverContent sources="wikipedia" />);
    await waitFor(() => {
      expect(screen.getByTestId('reveal-keyword')).toBeInTheDocument();
    });
  });

  it('もう一回リンクが/discoverを指している', async () => {
    render(<DiscoverContent sources="wikipedia" />);
    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'もう一回' });
      expect(link).toHaveAttribute('href', '/discover?sources=wikipedia');
    });
  });
});
