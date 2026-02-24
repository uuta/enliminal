import { useState, useRef } from "react";
import { MermaidDiagram } from "@/islands/MermaidDiagram";
import { ContentSkeleton, PapersSkeleton, VideosSkeleton } from "@/islands/DiscoverSkeleton";
import type { KeywordData } from "@/lib/generateContent";
import { fetchRandomKeyword, generateContent, fetchPapers, fetchVideos } from "@/lib/client";
import type { Keyword } from "@/lib/types";
import type { Paper } from "@/lib/semanticScholar";
import type { Video } from "@/lib/youtube";

type Props = { sources: string };

export function DiscoverContent({ sources }: Props) {
  const [keyword, setKeyword] = useState<Keyword | null>(null);
  const [content, setContent] = useState<KeywordData | null>(null);
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const started = useRef(false);

  async function loadContent(kw: Keyword) {
    setContent(await generateContent(kw));
  }

  async function loadPapers(query: string) {
    setPapers(await fetchPapers(query));
  }

  async function loadVideos(query: string) {
    setVideos(await fetchVideos(query));
  }

  function searchTerm(term: string) {
    setKeyword(null);
    setContent(null);
    setPapers(null);
    setVideos(null);
    setSelectedVideoUrl(null);
    const kw: Keyword = {
      title: term,
      extract: "",
      pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`,
    };
    setKeyword(kw);
    loadContent(kw).catch(console.error);
    loadPapers(kw.title).catch(console.error);
    loadVideos(kw.title).catch(console.error);
  }

  async function runDiscovery() {
    const kw = await fetchRandomKeyword(sources);
    setKeyword(kw);
    loadContent(kw).catch(console.error);
    loadPapers(kw.title).catch(console.error);
    loadVideos(kw.title).catch(console.error);
  }

  if (!started.current && typeof window !== "undefined") {
    started.current = true;
    runDiscovery().catch(console.error);
  }

  return (
    <div className="reveal visible" data-testid="reveal-container">
      <div className="reveal-inner">
        {keyword ? (
          <>
            {content && <div className="reveal-category">{content.category}</div>}
            <div className="reveal-keyword" data-testid="reveal-keyword">
              {keyword.title}
            </div>
            {content?.japaneseTitle && (
              <div className="reveal-keyword-ja">({content.japaneseTitle})</div>
            )}
            <div className="reveal-accent" />
          </>
        ) : (
          <>
            <span
              className="skel skel-line"
              style={{ width: "6rem", height: "0.75rem", marginBottom: "0.5rem" }}
            />
            <div
              className="skel skel-block"
              style={{ height: "clamp(3rem, 8vw, 6rem)", marginBottom: "1.5rem" }}
            />
            <div
              className="skel skel-block"
              style={{ height: "2px", marginBottom: "2rem", opacity: 0.4 }}
            />
          </>
        )}

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
                  <span key={i} className="term-tag" onClick={() => searchTerm(term)}>
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <ContentSkeleton />
        )}

        {/* Related Papers */}
        {papers === null ? (
          <PapersSkeleton />
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
                    {p.authors.slice(0, 2).join(", ")}
                    {p.authors.length > 2 ? " et al." : ""}
                    {p.year ? ` (${p.year})` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Related Videos */}
        {videos === null ? (
          <VideosSkeleton />
        ) : videos.length > 0 ? (
          <div className="content-section videos-section visible">
            <div className="section-label">Related Videos</div>
            <ul className="videos-list">
              {videos.map((v, i) => (
                <li key={i}>
                  <a
                    href={v.url}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVideoUrl(selectedVideoUrl === v.url ? null : v.url);
                    }}
                  >
                    <img src={v.thumbnail} alt={v.title} />
                  </a>
                </li>
              ))}
            </ul>
            {selectedVideoUrl && (
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${new URL(selectedVideoUrl).searchParams.get("v")}?autoplay=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            )}
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
