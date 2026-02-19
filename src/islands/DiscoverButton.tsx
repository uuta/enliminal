import { useState, useRef, useCallback } from "react";
import { fetchRandomKeyword } from "@/lib/wikipedia";

type AppState = "idle" | "loading" | "revealing";

interface KeywordData {
  title: string;
  pageUrl: string;
  category: string;
  definition: string;
  explanation: string;
  diagram: string | null;
  useCases: string[];
  relatedTerms: string[];
}

export default function DiscoverButton() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [keyword, setKeyword] = useState<KeywordData | null>(null);
  const [revealVisible, setRevealVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [streamedDef, setStreamedDef] = useState("");
  const [streamedExp, setStreamedExp] = useState("");
  const [visibleUseCases, setVisibleUseCases] = useState<string[]>([]);
  const [visibleTerms, setVisibleTerms] = useState<string[]>([]);
  const [isStreamingDef, setIsStreamingDef] = useState(false);
  const [isStreamingExp, setIsStreamingExp] = useState(false);
  const [diagramVisible, setDiagramVisible] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<() => Promise<void>>(async () => {});

  const showSection = useCallback((id: string) => {
    setVisibleSections((prev) => new Set([...prev, id]));
  }, []);

  const scrollTo = useCallback((el: HTMLElement | null) => {
    if (!el || !revealRef.current) return;
    const container = revealRef.current;
    const top = el.offsetTop - container.offsetTop - 40;
    container.scrollTo({ top, behavior: "smooth" });
  }, []);

  const discover = useCallback(async () => {
    if (appState !== "idle") return;
    setAppState("loading");

    try {
      const wiki = await fetchRandomKeyword();

      // Reset state
      setStreamedDef("");
      setStreamedExp("");
      setVisibleUseCases([]);
      setVisibleTerms([]);
      setCtaVisible(false);
      setVisibleSections(new Set());
      setDiagramVisible(false);
      setRevealVisible(false);

      // Transition: fade stage out, then fade reveal in
      await delay(600);
      setRevealVisible(true);
      setAppState("revealing");

      // Fetch AI description
      await delay(400);
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: wiki.title, extract: wiki.extract }),
      });

      if (!res.ok || !res.body) throw new Error("generate API failed");

      // Stream and parse JSON
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let rawJson = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        rawJson += decoder.decode(value, { stream: true });
      }

      let parsed: Omit<KeywordData, "title" | "pageUrl">;
      try {
        parsed = JSON.parse(rawJson);
      } catch {
        parsed = {
          category: "",
          definition: rawJson.slice(0, 100),
          explanation: rawJson,
          diagram: null,
          useCases: [],
          relatedTerms: [],
        };
      }

      const kw: KeywordData = {
        title: wiki.title,
        pageUrl: wiki.pageUrl,
        ...parsed,
      };
      setKeyword(kw);

      // Stream Definition
      showSection("definition");
      setIsStreamingDef(true);
      await typeText(kw.definition, setStreamedDef, 28);
      setIsStreamingDef(false);

      // Stream Explanation
      await delay(300);
      showSection("explanation");
      setIsStreamingExp(true);
      await typeText(kw.explanation, setStreamedExp, 18);
      setIsStreamingExp(false);

      // Diagram
      if (kw.diagram) {
        await delay(300);
        showSection("diagram");
        setDiagramVisible(true);
        await delay(600);
      }

      // Use Cases
      await delay(300);
      showSection("usecases");
      for (const uc of kw.useCases) {
        setVisibleUseCases((prev) => [...prev, uc]);
        await delay(200);
      }

      // Related Terms
      await delay(300);
      showSection("relatedterms");
      for (const term of kw.relatedTerms) {
        setVisibleTerms((prev) => [...prev, term]);
        await delay(100);
      }

      // CTA
      await delay(400);
      setCtaVisible(true);
    } catch (err) {
      console.error("discover error:", err);
      setAppState("idle");
    }
  }, [appState, showSection]);
  discoverRef.current = discover;

  const reset = useCallback(() => {
    setRevealVisible(false);
    setCtaVisible(false);
    setTimeout(() => {
      setKeyword(null);
      setStreamedDef("");
      setStreamedExp("");
      setVisibleUseCases([]);
      setVisibleTerms([]);
      setDiagramVisible(false);
      setVisibleSections(new Set());
      setAppState("idle");
      // Auto-discover next
      setTimeout(() => discoverRef.current(), 100);
    }, 600);
  }, []);

  const stageHidden = appState !== "idle";

  return (
    <>
      {/* IDLE STATE */}
      <div className={`stage${stageHidden ? " hidden" : ""}`}>
        <div className="stage-subtitle">Enliminal</div>
        <div className="stage-title">行ってみよう。飛んでみよう</div>
        <div className="stage-tagline">An encounter with the unknown</div>
        <button
          className="discover-btn"
          onClick={discover}
          disabled={appState !== "idle"}
        >
          <div className="btn-glow" />
          <div className="btn-ring">
            <span className="btn-label" data-text="発見する">
              発見する
            </span>
          </div>
        </button>
        <div className="btn-hint">tap to unveil a new world</div>
      </div>

      {/* REVEAL STATE */}
      <div
        className={`reveal${revealVisible ? " visible" : ""}`}
        ref={revealRef}
        data-testid="reveal-container"
      >
        <div className="reveal-inner">
          <div className="reveal-category">{keyword?.category ?? ""}</div>
          <div className="reveal-keyword" data-testid="reveal-keyword">
            {keyword?.title ?? ""}
          </div>
          <div className="reveal-accent" />

          {/* Definition */}
          <div
            className={`content-section definition-section${visibleSections.has("definition") ? " visible" : ""}`}
          >
            <div className="section-label">Definition</div>
            <div className="definition-text">
              {streamedDef}
              {isStreamingDef && <span className="cursor" />}
            </div>
          </div>

          {/* Explanation */}
          <div
            className={`content-section explanation-section${visibleSections.has("explanation") ? " visible" : ""}`}
          >
            <div className="section-label">Explanation</div>
            <div className="explanation-text">
              {streamedExp}
              {isStreamingExp && <span className="cursor" />}
            </div>
          </div>

          {/* Diagram */}
          {keyword?.diagram && (
            <div
              className={`content-section diagram-section${visibleSections.has("diagram") ? " visible" : ""}`}
            >
              <div className="section-label">Diagram</div>
              <div className="diagram-container">
                <pre className="diagram-code">{keyword.diagram}</pre>
              </div>
            </div>
          )}

          {/* Use Cases */}
          <div
            className={`content-section usecases-section${visibleSections.has("usecases") ? " visible" : ""}`}
          >
            <div className="section-label">Use Cases</div>
            <ul className="usecases-list">
              {visibleUseCases.map((uc, i) => (
                <li
                  key={i}
                  style={{
                    opacity: 1,
                    transform: "translateX(0)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                  }}
                >
                  {uc}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Terms */}
          <div
            className={`content-section related-terms-section${visibleSections.has("relatedterms") ? " visible" : ""}`}
          >
            <div className="section-label">Related Terms</div>
            <div className="terms-grid">
              {visibleTerms.map((term, i) => (
                <span key={i} className="term-tag">
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={`reveal-cta${ctaVisible ? " visible" : ""}`}>
            <div className="cta-message">行ってみよう。飛んでみよう</div>
            <div className="cta-sub">Let curiosity lead you forward</div>
            <button className="reset-btn" onClick={reset}>
              もう一回
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---- helpers ----

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function typeText(
  text: string,
  setter: React.Dispatch<React.SetStateAction<string>>,
  charDelay: number,
) {
  for (let i = 0; i <= text.length; i++) {
    setter(text.slice(0, i));
    const char = text[i - 1] ?? "";
    const isPunctuation = "。、！？—「」\n".includes(char);
    await delay(isPunctuation ? 160 : charDelay + Math.random() * 20);
  }
  await delay(400);
}
