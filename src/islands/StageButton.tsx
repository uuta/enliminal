import { useState } from "react";

type Source = "wikipedia" | "hackernews";

export function StageButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Set<Source>>(new Set(["wikipedia", "hackernews"]));

  function toggleSource(source: Source) {
    setSources((prev) => {
      if (prev.has(source) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  }

  function handleDiscover(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setIsLoading(true);
    window.location.href = `/discover?sources=${[...sources].join(",")}`;
  }

  return (
    <div className="stage">
      <div className="stage-subtitle">Enliminal</div>
      <div className="stage-title">行ってみよう。飛んでみよう</div>
      <div className="stage-tagline">An encounter with the unknown</div>
      <div className="source-selector">
        {(["wikipedia", "hackernews"] as Source[]).map((src) => (
          <label key={src} className="source-option">
            <input type="checkbox" checked={sources.has(src)} onChange={() => toggleSource(src)} />
            <span className="source-option-label">{src}</span>
          </label>
        ))}
      </div>
      <a href="/discover" className="discover-btn" onClick={handleDiscover}>
        <div className="btn-glow" />
        <div className="btn-ring">
          <span className="btn-label" data-text="発見する">
            発見する
          </span>
        </div>
      </a>
      <div className="btn-hint">tap to unveil a new world</div>
      {isLoading && (
        <div className="stage-loading">
          <span className="stage-loading-text">Loading</span>
          <span className="stage-loading-cursor" />
        </div>
      )}
    </div>
  );
}
