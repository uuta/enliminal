import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DiscoverContent } from '../DiscoverContent';

const defaultProps = {
  title: 'Emergence',
  pageUrl: 'https://ja.wikipedia.org/wiki/創発',
  category: 'Science',
  definition: 'test def',
  explanation: 'test exp',
  diagram: null,
  useCases: [],
  relatedTerms: [],
};

describe('DiscoverContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('マウント時にrevealコンテナが表示される', () => {
    render(<DiscoverContent {...defaultProps} />);
    expect(screen.getByTestId('reveal-container')).toBeInTheDocument();
  });

  it('キーワードが表示される', async () => {
    render(<DiscoverContent {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByTestId('reveal-keyword')).toBeInTheDocument();
    });
  });

  it('もう一回リンクが/discoverを指している', async () => {
    render(<DiscoverContent {...defaultProps} />);
    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'もう一回' });
      expect(link).toHaveAttribute('href', '/discover');
    });
  });
});
