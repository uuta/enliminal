import { useState } from 'react';

export function StageButton() {
  const [isLoading, setIsLoading] = useState(false);

  function handleDiscover(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setIsLoading(true);
    window.location.href = '/discover';
  }

  return (
    <div className="stage">
      <div className="stage-subtitle">Enliminal</div>
      <div className="stage-title">行ってみよう。飛んでみよう</div>
      <div className="stage-tagline">An encounter with the unknown</div>
      <a href="/discover" className="discover-btn" onClick={handleDiscover}>
        <div className="btn-glow" />
        <div className="btn-ring">
          <span className="btn-label" data-text="発見する">発見する</span>
        </div>
      </a>
      <div className="btn-hint">tap to unveil a new world</div>
      {isLoading && (
        <div className="stage-loading">
          <span className="stage-loading-text">探索中</span>
          <span className="stage-loading-cursor" />
        </div>
      )}
    </div>
  );
}
