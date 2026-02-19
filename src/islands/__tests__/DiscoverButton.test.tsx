import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DiscoverButton from '../DiscoverButton';

vi.mock('@/lib/wikipedia', () => ({
  fetchRandomKeyword: vi.fn().mockResolvedValue({
    title: 'Emergence',
    extract: '創発とは複雑系において...',
    pageUrl: 'https://ja.wikipedia.org/wiki/創発',
  }),
}));

global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve(
    new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"definition":"test def","explanation":"test exp","useCases":[],"relatedTerms":[]}'));
          controller.close();
        },
      })
    )
  )
);

describe('DiscoverButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態でボタンが表示される', () => {
    render(<DiscoverButton />);
    expect(screen.getByRole('button', { name: '発見する' })).toBeInTheDocument();
  });

  it('ボタンクリックでローディング状態になる', async () => {
    render(<DiscoverButton />);
    const btn = screen.getByRole('button', { name: '発見する' });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  it('キーワードが取得されると表示される', async () => {
    render(<DiscoverButton />);
    fireEvent.click(screen.getByRole('button', { name: '発見する' }));
    await waitFor(() => {
      expect(screen.getByTestId('reveal-keyword')).toBeInTheDocument();
    });
  });
});
