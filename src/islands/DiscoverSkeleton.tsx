export function KeywordSkeleton() {
  return (
    <div className="reveal visible" data-testid="reveal-container">
      <div className="reveal-inner">
        <span className="skel skel-line" style={{ width: '6rem', height: '0.75rem', marginBottom: '0.5rem' }} />
        <div className="skel skel-block" style={{ height: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1.5rem' }} />
        <div className="skel skel-block" style={{ height: '2px', marginBottom: '2rem', opacity: 0.4 }} />
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <>
      <div className="content-section definition-section visible">
        <div className="section-label">Definition</div>
        <div className="skeleton-rows">
          <span className="skel skel-line" style={{ height: '1.2rem' }} />
          <span className="skel skel-line" style={{ width: '85%', height: '1.2rem' }} />
        </div>
      </div>
      <div className="content-section explanation-section visible">
        <div className="section-label">Explanation</div>
        <div className="skeleton-rows">
          {[100, 92, 97, 78, 88].map((w, i) => (
            <span key={i} className="skel skel-line" style={{ width: `${w}%`, height: '0.9rem' }} />
          ))}
        </div>
      </div>
      <div className="content-section usecases-section visible">
        <div className="section-label">Use Cases</div>
        <div className="skeleton-rows">
          {[72, 65, 80, 60, 75].map((w, i) => (
            <span key={i} className="skel skel-line" style={{ width: `${w}%`, height: '0.85rem' }} />
          ))}
        </div>
      </div>
      <div className="content-section related-terms-section visible">
        <div className="section-label">Related Terms</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[80, 100, 70, 90, 60, 85].map((w, i) => (
            <span key={i} className="skel" style={{ width: `${w}px`, height: '1.6rem', borderRadius: '4px' }} />
          ))}
        </div>
      </div>
    </>
  );
}

export function PapersSkeleton() {
  return (
    <div className="content-section papers-section visible">
      <div className="section-label">Related Papers</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[100, 88, 95, 80].map((w, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="skel skel-line" style={{ width: `${w}%`, height: '0.9rem' }} />
            <span className="skel skel-line" style={{ width: '45%', height: '0.65rem' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function VideosSkeleton() {
  return (
    <div className="content-section videos-section visible">
      <div className="section-label">Related Videos</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span className="skel" style={{ width: '120px', height: '68px', flexShrink: 0, borderRadius: '4px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="skel skel-line" style={{ height: '0.85rem' }} />
              <span className="skel skel-line" style={{ width: '60%', height: '0.85rem' }} />
              <span className="skel skel-line" style={{ width: '40%', height: '0.65rem' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
