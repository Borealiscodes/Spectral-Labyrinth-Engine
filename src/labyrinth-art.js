/**
 * src/labyrinth-art.js — Read-Only Procedural Canvas Renderer (Ledger 2)
 * Visualizes concentric labyrinth curvature distortion, H¹ loop holonomy edges,
 * active 0-cell target selection, radial depth probe (qQ16), and Horizon Inversion
 * polarity from immutable Q16.16 telemetry snapshots.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";

/**
 * Render the current labyrinth curvature rings and cellular sheaf graph onto a 2D canvas.
 * Strictly read-only: never mutates engine state.
 */
export function renderLabyrinthCanvas(ctx, snapshot) {
  const { width, height } = ctx.canvas;
  const cx = width / 2;
  const cy = height / 2;

  // Palette shifts cleanly under Horizon Inversion (Rebellion Z₂ twist)
  const inverted = Boolean(snapshot.horizonsInverted);
  const bgColor = inverted ? "#14091a" : "#0b1020";
  const ringColor = inverted ? "rgba(216, 112, 184, 0.28)" : "rgba(102, 178, 255, 0.25)";
  const edgeColor = inverted ? "rgba(240, 128, 168, 0.55)" : "rgba(130, 210, 255, 0.45)";

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 1. Draw warped spatial curvature rings based on effectiveCurvatureQ16
  const kEff = Math.max(0.1, fromQ16(snapshot.effectiveCurvatureQ16 || 0));
  const ringCount = 7;
  const maxR = Math.min(cx, cy) * 0.85;

  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 1.25;
  for (let i = 1; i <= ringCount; i++) {
    const norm = i / ringCount;
    const warp = 1.0 + 0.18 * kEff * Math.exp(-norm * 2.0);
    const radius = norm * maxR * Math.min(1.25, warp);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Render live radial depth indicator ring (qQ16 phase-space position)
  const radialPos = Math.abs(fromQ16(snapshot.qQ16 || 0));
  const clampedNormR = Math.max(0.05, Math.min(1.0, radialPos / 25.0));
  const probeRadius = clampedNormR * maxR;

  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = inverted ? "rgba(244, 114, 182, 0.65)" : "rgba(56, 189, 248, 0.65)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, probeRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Compute deterministic circular layout for 0-cell nodes
  const nodes = snapshot.nodes || [];
  const stalks = snapshot.stalks || [];
  const edges = snapshot.edges || [];
  const orbitR = maxR * 0.62;
  const activeIdx = snapshot.activeNodeIdx ?? 2;

  const coords = nodes.map((_, idx) => {
    const angle = (idx / Math.max(1, nodes.length)) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * orbitR,
      y: cy + Math.sin(angle) * orbitR,
    };
  });

  // 4. Render 1-cell sheaf edges
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = 1.6;
  for (const edge of edges) {
    const a = coords[edge.src];
    const b = coords[edge.dst];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // 5. Render 0-cell vertices sized by Hope and colored by Soul Gem Purity
  for (let i = 0; i < nodes.length; i++) {
    const pt = coords[i];
    const stalk = stalks[i];
    if (!pt || !stalk) continue;

    const hope = Math.max(0, fromQ16(stalk[0]));
    const despair = Math.max(0, fromQ16(stalk[1]));
    const purity = Math.max(0, Math.min(1, fromQ16(stalk[2])));

    const nodeRadius = Math.max(6, Math.min(18, 6 + hope * 0.45));
    const hue = inverted ? 315 : Math.round(purity * 200);
    const lightness = Math.max(32, Math.min(72, 65 - despair * 2.5));

    ctx.fillStyle = `hsl(${hue}, 78%, ${lightness}%)`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Highlight currently targeted 0-cell node
    if (i === activeIdx) {
      ctx.strokeStyle = inverted ? "#f472b6" : "#38bdf8";
      ctx.lineWidth = 2.25;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, nodeRadius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Critical breach warning halo when Despair >= 10.0 (D_break)
    if (despair >= 10.0 && nodes[i].role !== "entropy_sink") {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, nodeRadius + 9, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "#e8eef8";
    ctx.font = i === activeIdx ? "bold 11px monospace" : "11px monospace";
    ctx.fillText(nodes[i].id.toUpperCase(), pt.x + nodeRadius + 7, pt.y + 4);
  }
}
