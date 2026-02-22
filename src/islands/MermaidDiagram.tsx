import mermaid from "mermaid";
import { colors } from "@/styles/tokens";

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: colors.accentGold,
    primaryTextColor: colors.textPrimary,
    primaryBorderColor: `rgba(${hexToRgb(colors.accentGold)}, 0.3)`,
    lineColor: `rgba(${hexToRgb(colors.accentGold)}, 0.5)`,
    background: "rgba(20,20,26,0)",
    mainBkg: `rgba(${hexToRgb(colors.bgSurface)}, 0.6)`,
    nodeBorder: `rgba(${hexToRgb(colors.accentGold)}, 0.4)`,
    clusterBkg: `rgba(${hexToRgb(colors.bgSurface)}, 0.4)`,
    titleColor: colors.accentGold,
    edgeLabelBackground: `rgba(${hexToRgb(colors.bgSurface)}, 0.8)`,
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
