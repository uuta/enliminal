import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#c9a84c",
    primaryTextColor: "#e8e8e8",
    primaryBorderColor: "rgba(201,168,76,0.3)",
    lineColor: "rgba(201,168,76,0.5)",
    background: "rgba(20,20,26,0)",
    mainBkg: "rgba(20,20,26,0.6)",
    nodeBorder: "rgba(201,168,76,0.4)",
    clusterBkg: "rgba(20,20,26,0.4)",
    titleColor: "#c9a84c",
    edgeLabelBackground: "rgba(20,20,26,0.8)",
  },
});

export function MermaidDiagram({ chart }: { chart: string }) {
  return (
    <div
      ref={(el) => {
        if (!el) return;
        mermaid
          .render(`mermaid-${Date.now()}`, chart)
          .then(({ svg }) => {
            el.innerHTML = svg;
          })
          .catch(console.error);
      }}
      className="mermaid-output"
    />
  );
}
