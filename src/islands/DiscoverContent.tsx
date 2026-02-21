import MermaidDiagram from "./MermaidDiagram";
import type { KeywordData } from "@/lib/generateContent";

type Props = KeywordData;

export function DiscoverContent({
  title,
  pageUrl,
  category,
  definition,
  explanation,
  diagram,
  useCases,
  relatedTerms,
}: Props) {
  return (
    <div
      className="reveal visible"
      data-testid="reveal-container"
    >
      <div className="reveal-inner">
        <div className="reveal-category">{category}</div>
        <div className="reveal-keyword" data-testid="reveal-keyword">
          {title}
        </div>
        <div className="reveal-accent" />

        {/* Definition */}
        <div className="content-section definition-section visible">
          <div className="section-label">Definition</div>
          <div className="definition-text">{definition}</div>
        </div>

        {/* Explanation */}
        <div className="content-section explanation-section visible">
          <div className="section-label">Explanation</div>
          <div className="explanation-text">{explanation}</div>
        </div>

        {/* Diagram */}
        {diagram && (
          <div className="content-section diagram-section visible">
            <div className="section-label">Diagram</div>
            <div className="diagram-container">
              <MermaidDiagram key={diagram} chart={diagram} />
            </div>
          </div>
        )}

        {/* Use Cases */}
        <div className="content-section usecases-section visible">
          <div className="section-label">Use Cases</div>
          <ul className="usecases-list">
            {useCases.map((uc, i) => (
              <li key={i}>{uc}</li>
            ))}
          </ul>
        </div>

        {/* Related Terms */}
        <div className="content-section related-terms-section visible">
          <div className="section-label">Related Terms</div>
          <div className="terms-grid">
            {relatedTerms.map((term, i) => (
              <span key={i} className="term-tag">
                {term}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal-cta visible">
          <div className="cta-message">行ってみよう。飛んでみよう</div>
          <div className="cta-sub">Let curiosity lead you forward</div>
          <a href="/discover" className="reset-btn">
            もう一回
          </a>
        </div>
      </div>
    </div>
  );
}
