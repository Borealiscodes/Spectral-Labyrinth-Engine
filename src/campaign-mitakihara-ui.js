/**
 * src/campaign-mitakihara-ui.js — Read-Only Telemetry HUD & Event Log (Ledger 2)
 * Renders Q16.16 sheaf diagnostics, thermodynamic conservation status, and
 * non-activating narrative logs without coupling UI events to physics state.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";

/**
 * Update DOM telemetry panels from an immutable engine state snapshot.
 */
export function updateTelemetryHud(elements, snapshot) {
  if (elements.tickLabel) {
    elements.tickLabel.textContent = `Tick: ${snapshot.tick}`;
  }
  if (elements.energyLabel) {
    const eVal = fromQ16(snapshot.dirichletEnergyQ16 || 0).toFixed(4);
    elements.energyLabel.textContent = `H¹ Frustration Energy: ${eVal}`;
  }
  if (elements.curvatureLabel) {
    const kVal = fromQ16(snapshot.effectiveCurvatureQ16 || 0).toFixed(4);
    elements.curvatureLabel.textContent = `Effective Curvature (k_eff): ${kVal}`;
  }
  if (elements.regimeLabel) {
    elements.regimeLabel.textContent = snapshot.horizonsInverted
      ? "Regime: A7.2 Twisted Bundle (Horizons Inverted)"
      : "Regime: A6 Standard Law of Cycles";
  }

  if (elements.stalkTableBody) {
    elements.stalkTableBody.innerHTML = "";
    snapshot.nodes.forEach((node, idx) => {
      const s = snapshot.stalks[idx];
      if (!s) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${node.label}</td>
        <td>${fromQ16(s[0]).toFixed(2)}</td>
        <td>${fromQ16(s[1]).toFixed(2)}</td>
        <td>${fromQ16(s[2]).toFixed(2)}</td>
        <td>${fromQ16(s[3]).toFixed(2)}</td>
      `;
      elements.stalkTableBody.appendChild(tr);
    });
  }
}

/**
 * Append a timestamped diagnostic entry to the read-only narrative log.
 */
export function appendDiagnosticLog(logElement, tick, message) {
  if (!logElement) return;
  const item = document.createElement("li");
  item.textContent = `[T+${String(tick).padStart(4, "0")}] ${message}`;
  logElement.prepend(item);
  while (logElement.children.length > 25) {
    logElement.removeChild(logElement.lastChild);
  }
}
