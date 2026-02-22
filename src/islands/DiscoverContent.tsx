import { useState, useRef } from 'react';
import { MermaidDiagram } from "@/islands/MermaidDiagram";
import type { KeywordData } from "@/lib/generateContent";
import type { WikiKeyword } from "@/lib/wikipedia";
import type { Paper } from "@/lib/semanticScholar";
import type { Video } from "@/lib/youtube";

type Props = { sources: string };

export function DiscoverContent({ sources }: Props) {
  const [keyword, setKeyword] = useState<WikiKeyword | null>(null);
  const [content, setContent] = useState<KeywordData | null>(null);
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const started = useRef(false);

  async function fetchContent(kw: WikiKeyword) {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: kw.title, extract: kw.extract }),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let rawJson = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      rawJson += decoder.decode(value, { stream: true });
    }
    try {
      const parsed = JSON.parse(rawJson);
      setContent({ title: kw.title, pageUrl: kw.pageUrl, ...parsed });
    } catch {
      setContent({
        title: kw.title,
        pageUrl: kw.pageUrl,
        category: '',
        definition: rawJson.slice(0, 100),
        explanation: rawJson,
        diagram: null,
        useCases: [],
        relatedTerms: [],
      });
    }
  }

  async function fetchPapers(query: string) {
    const res = await fetch(`/api/papers?query=${encodeURIComponent(query)}`);
    const data: Paper[] = await res.json();
    setPapers(data);
  }

  async function fetchVideos(query: string) {
    const res = await fetch(`/api/videos?query=${encodeURIComponent(query)}`);
    const data: Video[] = await res.json();
    setVideos(data);
  }

  async function runDiscovery() {
    const res = await fetch(`/api/keyword/random?sources=${encodeURIComponent(sources)}`);
    const kw: WikiKeyword = await res.json();
    setKeyword(kw);
    fetchContent(kw);
    fetchPapers(kw.title);
    fetchVideos(kw.title);
  }

  if (!started.current && typeof window !== 'undefined') {
    started.current = true;
    runDiscovery();
  }

  if (!keyword) {
    return (
      <div className="reveal visible" data-testid="reveal-container">
        <div className="reveal-inner">
          <div className="reveal-keyword">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reveal visible" data-testid="reveal-container">
      <div className="reveal-inner">
        {content && <div className="reveal-category">{content.category}</div>}
        <div className="reveal-keyword" data-testid="reveal-keyword">
          {keyword.title}
        </div>
        <div className="reveal-accent" />

        {content ? (
          <>
            {/* Definition */}
            <div className="content-section definition-section visible">
              <div className="section-label">Definition</div>
              <div className="definition-text">{content.definition}</div>
            </div>

            {/* Explanation */}
            <div className="content-section explanation-section visible">
              <div className="section-label">Explanation</div>
              <div className="explanation-text">{content.explanation}</div>
            </div>

            {/* Diagram */}
            {content.diagram && (
              <div className="content-section diagram-section visible">
                <div className="section-label">Diagram</div>
                <div className="diagram-container">
                  <MermaidDiagram key={content.diagram} chart={content.diagram} />
                </div>
              </div>
            )}

            {/* Use Cases */}
            <div className="content-section usecases-section visible">
              <div className="section-label">Use Cases</div>
              <ul className="usecases-list">
                {content.useCases.map((uc, i) => (
                  <li key={i}>{uc}</li>
                ))}
              </ul>
            </div>

            {/* Related Terms */}
            <div className="content-section related-terms-section visible">
              <div className="section-label">Related Terms</div>
              <div className="terms-grid">
                {content.relatedTerms.map((term, i) => (
                  <span key={i} className="term-tag">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="content-section definition-section">
            <div className="definition-text">Generating content...</div>
          </div>
        )}

        {/* Related Papers */}
        {papers === null ? (
          <div className="content-section papers-section">
            <div className="section-label">Related Papers</div>
            <div>Loading papers...</div>
          </div>
        ) : papers.length > 0 ? (
          <div className="content-section papers-section visible">
            <div className="section-label">Related Papers</div>
            <ul className="papers-list">
              {papers.map((p, i) => (
                <li key={i}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.title}
                  </a>
                  <span>
                    {p.authors.slice(0, 2).join(', ')}
                    {p.authors.length > 2 ? ' et al.' : ''}
                    {p.year ? ` (${p.year})` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Related Videos */}
        {videos === null ? (
          <div className="content-section videos-section">
            <div className="section-label">Related Videos</div>
            <div>Loading videos...</div>
          </div>
        ) : videos.length > 0 ? (
          <div className="content-section videos-section visible">
            <div className="section-label">Related Videos</div>
            <ul className="videos-list">
              {videos.map((v, i) => (
                <li key={i}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer">
                    <img src={v.thumbnail} alt={v.title} />
                    <span className="video-title">{v.title}</span>
                  </a>
                  <span className="video-channel">{v.channelTitle}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* CTA — shown once AI content is ready */}
        {content && (
          <div className="reveal-cta visible">
            <div className="cta-message">行ってみよう。飛んでみよう</div>
            <div className="cta-sub">Let curiosity lead you forward</div>
            <a href={`/discover?sources=${sources}`} className="reset-btn">
              もう一回
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
