> ### ✅ RELEASE v1.0 — DETERMINISTIC REPLAY & SHEAF KERNEL VERIFIED (`8/8` PASSING)
> **Status:** `v1.0` Core & Replay Engine Verified • Zero-Float `Q16.16` ARM64 Loopback Confirmed  
> 
> **Release Verification (Nov 2026):** All four development phases (`v0.1`–`v1.0`) are verified on ARM64 hardware (`node --test`: **8/8 passing**). The runtime features zero-float `Q16.16` cellular sheaf cohomology ($H^1$), discrete First & Second Law thermodynamic conservation, `A7.2` Tikhonov collapse repair, multi-chapter `game-verdict` state transitions, deterministic input-log replay (`SHA-256` verified `MATCH`), and mute-by-default `Ledger 2` WebAudio harmonic cues (`288 Hz / 432 Hz / 528 Hz`).

# 🌌 Spectral Labyrinth Engine — Zero-Float Cellular Sheaf Fan Game Runtime

**A deterministic, zero-dependency ESM web game engine uniting cellular sheaf cohomology, `Q16.16` symplectic physics, and `A7.2` collapse-surface repair across closed-world magical-girl timeline manifolds.**

[![License: MIT](https://shields.io)](LICENSE)
[![Runtime: Zero-Bundler ESM](https://shields.io)](#-repository-structure-eternitiesai-modular-split)
[![Math: Q16.16 Symplectic](https://shields.io)](#-core-math-substrate-ledger-1--zero-float-q1616)
[![Tests: 8/8 Passing](https://shields.io)](#-quickstart--deterministic-verification)

---

## ⚠️ Epistemic Charter, Persona-Zero & Non-Commercial Fan Boundary

1. **Non-Commercial Fan Tribute & Reusable Core:** The core engine (`core.js`, `sheaf-kernel.js`, `labyrinth-motion.js`, `replay-verifier.js`) is 100% original, domain-agnostic, and MIT-licensed. All *Puella Magi Madoka Magica* / *The Rebellion Story* timeline scenarios live exclusively inside swappable declarative campaign modules (`campaign-mitakihara-data.js`) as a non-commercial fan tribute.
2. **Persona-Zero Invariant (`EnneractSanta` / `PersonaZero.lean`):** Every character entity (`Madoka`, `Homura`, `Sayaka`, `Mami`, `Kyoko`, `Kyubey`) executes at runtime strictly as a deterministic `Q16.16` state vector and sparse matrix operator. Narrative text and `432 Hz` audio cues (`Ledger 2`) never alter physics integration, save integrity, or completion verdicts (`Ledger 1`).
3. **Deterministic Conservation & Verification:** All cellular sheaf operations execute in zero-float `Q16.16` fixed-point arithmetic with explicit First and Second Law conservation checks, `SHA-256` input-log replay verification, and automated `node --test` receipts.

---

## 🤝 Upstream Acknowledgements & Lineage

This engine builds directly on the architectural patterns, conceptual explorations, and formal guardrails of three distinct lineages:

* **`EternitiesAi` (`ai-game-dev-kit` & `eternities-firstlight`):** Grateful thanks for the modular, zero-bundler vanilla JS/CSS **Data / Model / Motion / UI / Art** separation (`*-data.js`, `*-model.js`, `*-motion.js`, `*-ui.js`, `*-art.js`), fixed-timestep simulation discipline, and versioned save schema conventions (`EternitiesAi`, MIT License).
* **Flyxion (`@standardgalactic`):** Special thanks for the conceptual direction around sheaf-theoretic structures, constraint-driven geometry, and recursive proof exploration, which helped inspire translating abstract topological framing into a playable, deterministic game kernel.
* **`Borealiscodes` NDH & Topological Enclave (`MadokaSheafTopology.jl`, `A7.2-CollapseSurfaceRepairPipeline`, `ai-game-dev-kit-specimen`):** Integrates the 4D cellular sheaf stalks (`Hope`, `Despair`, `Purity`, `Entropy`), Störmer–Verlet symplectic integration, `A7.2` Tikhonov clamping ($\lambda = 98 / 65536 \approx 0.0015$), and the *Rebellion* $\mathbb{Z}_2$-twisted bundle edge case (`Hedling, 2026`).

---

## 📐 Core Math Substrate (`Ledger 1` — Zero-Float `Q16.16`)

To guarantee bit-exact cross-platform parity (ARM64 tablets, x86_64 desktops, and browser engines) without IEEE-754 floating-point drift across infinite timeline resets:

1. **🔮 4D `Q16.16` Stalk Vectors ($\mathcal{F}(v) \in \mathbb{Z}_{32}^4$):** Every 0-cell vertex carries signed 32-bit fixed-point channels (`1.0 === 65536`) tracking `[Hope (H), Despair (D), Soul Gem Purity (R), Exported Entropy (S)]`.
2. **⏳ Weighted 0-Coboundary & $H^1$ Timeline Loop Holonomy:** Measures causal frustration across Homura's time-shield reset cycles ($L_e$):
   $$(\delta^0 \mathbf{x})_e = w_e \left(\mathcal{F}_{u \trianglelefteq e}\mathbf{x}_u - \mathcal{F}_{v \trianglelefteq e}\mathbf{x}_v\right), \qquad w_e = 1 + \lfloor \ln(\max(1, L_e)) \rfloor_{Q16.16}.$$
   Non-zero Dirichlet frustration energy $\mathcal{E}(\mathbf{x}) = \frac{1}{2}\Vert{}\delta^0 \mathbf{x}\Vert{}_2^2 > 0$ quantifies accumulated karmic holonomy across closed timeline cycles ($H^1(X; \mathcal{F}) \neq 0$).
3. **⚖️ Discrete First & Second Laws of Thermodynamics:** Every phase transition enforces strict conservation:
   * **First Law:** $\sum_v (H_v - D_v) = \sum_v (H'_v - D'_v) + W_{\text{harvest}}$ (Incubator energy harvesting).
   * **Second Law:** $\Delta S_{\text{total}} = \sum_v S'_{\text{ent}, v} - \sum_v S_{\text{ent}, v} \ge 0$.
   * **Law of Cycles Sheafification ($\Phi_{\text{LoC}}$):** Intercepts any Soul Gem reaching $D_v \ge D_{\text{break}}$ (`10.0`), clears despair ($D'_v = 0$), restores purity ($R'_v = 1.0$), and discharges the exact curse load into exported entropy ($S'_{\text{ent}, v} = S_{\text{ent}, v} + D_v$) without Witch 2-cell collapse.
4. **🌀 Symplectic Labyrinth Traversal (`Störmer–Verlet`):** Integrates radial phase-space coordinates $(q, p)$ on a deterministic `60 Hz` fixed timestep ($\Delta t = 1/60\,\text{s}$) under spatial distortion $d_{\text{eff}}(r) = d\left(1 + k e^{-r/R_{\text{lab}}}\right)$ and Hope-dampened curvature $k_{\text{eff}} = k / \left(1 + \gamma (H / H_{\max})\right)$.
5. **🦋 Universal Edge Case (*Rebellion* Isolation Field & `A7.2` Repair):** When an Incubator Isolation Field severs global restriction maps to the Law of Cycles ($\sigma_{\min} \to 0^+$), the kernel clamps denominators at $\lambda_{Q16.16} = 98$ ($\approx 0.0015$) to block singular poles and applies a $\mathbb{Z}_2$ orientation twist (`HorizonsInverted`, $\mathcal{T}_{\mathbb{Z}_2} = \operatorname{diag}(1, -1, 1, 1)$), locking the universe into a metastable, Witch-free twisted bundle ($H^1 \neq 0$).

---

## 📁 Repository Structure (`EternitiesAi` Modular Split)

```text
Spectral-Labyrinth-Engine/
├── index.html                        # Zero-bundler ESM entrypoint (v1.0)
├── style.css                         # Clean dark-mode HUD & labyrinth viewport styling
├── package.json                      # Zero-dependency ESM manifest (`npm test` -> `node --test`)
├── LICENSE                           # MIT License
├── README.md                         # System specification, mathematical substrate & release roadmap
├── src/
│   ├── core.js                       # Q16.16 fixed-point arithmetic, Mulberry32 PRNG (Law 7), & save schema (Law 5)
│   ├── sheaf-kernel.js               # Coboundary δ⁰, 1st/2nd Law checks, Φ_LoC, A7.2 clamp, & game-verdict machine
│   ├── labyrinth-motion.js           # Symplectic Störmer–Verlet spatial distortion & despair/hope integrator
│   ├── labyrinth-art.js              # Read-only 2D Canvas procedural barrier, radial probe & breach halo renderer (Ledger 2)
│   ├── labyrinth-audio.js            # Optional mute-by-default WebAudio harmonic cues (288/432/528 Hz, Ledger 2)
│   ├── campaign-mitakihara-data.js   # Declarative Ch. I (Loop 100), Ch. II (Law of Cycles), & Ch. III (Rebellion) configs
│   ├── campaign-mitakihara-ui.js     # Read-only HUD, Soul Gem purity table, & diagnostic telemetry log (Ledger 2)
│   ├── replay-verifier.js            # Synchronous SHA-256 & deterministic input-log replay auditor
│   └── app.js                        # Fixed-timestep 60 Hz game loop, pointer/WASD dispatcher & replay bridge
├── test/
│   └── verify-engine.test.mjs        # Built-in `node --test` suite (8/8 deterministic tests)
├── tiles/
│   └── bill-nye-v10-victory-explainer.md  # Altitude A7 public-facing educational explainer tile
└── docs/
    └── MADOKA_SHEAF_TOPOLOGY_PREPRINT_v1.0.md  # Formal APA-referenced cellular sheaf & thermodynamics preprint
```

---

## 🚀 Quickstart & Deterministic Verification

Zero `npm install` bloat required (Node.js 20+ for headless verification; any static HTTP server for browser play):

```bash
# 1. Run all 8 deterministic Q16.16, thermodynamic, and replay tests
node --test test/verify-engine.test.mjs

# 2. Launch locally in browser (Python or zero-dependency Node static server)
python3 -m http.server 8080
```

Then open **`http://localhost:8080`** in your browser:
* **Tap any character node** (`MADOKA`, `HOMURA`, `SAYAKA`, `MAMI`, `KYOKO`) on the Canvas to lock target.
* Use **`Apply Hope Impulse`**, **`Dive In (-r)` / `Retreat (+r)`** (or `W`/`S` keys), **`Law of Cycles (Φ_LoC)`**, and **`Rebellion Surgery (A7.2)`** to stabilize the manifold before any node hits catastrophic singularity ($D \ge 5 \cdot D_{\text{break}}$).
* Click **`Verify Replay & Save`** at any point to re-simulate your session from tick `0` and verify a bit-exact `SHA-256` replay receipt (`MATCH ✅`).

---

## 🗺️ Release Milestones (`v0.1` → `v1.0` Complete)

* **Phase 1 (`v0.1` — Complete ✅):** Zero-float `Q16.16` cellular sheaf kernel, discrete First & Second Law conservation checks, `A7.2` Tikhonov collapse repair, `6/6` `node --test` verification, and live `60 Hz` Canvas telemetry HUD.
* **Phase 2 (`v0.2` — Complete ✅):** Direct pointer/touch 0-cell node selection on the Canvas, WASD / Arrow / touch-button symplectic radial thrust (`q`, `p`) modulating spatial distortion $d_{\text{eff}}(r)$, live dashed radial depth ring, and red $D_{\text{break}}$ breach warning halos.
Use code with caution.
• Phase 3 (v0.3 — Complete ✅): Multi-chapter campaign switcher (Ch. I: Loop 100, Ch. II: Law of Cycles, Ch. III: Rebellion A7.2), deterministic game-verdict win/loss state machine (ACTIVE, VICTORY_STABILIZED, BREACH_COLLAPSE, ENTROPY_OVERFLOW), and 7/7 node --test verification on ARM64.
• Phase 4 (v1.0 — Complete ✅):
	• Input-Log Replay Engine (src/replay-verifier.js): Records { tick, action, targetIdx } tuples during a run and re-simulates from the initial Q16.16 seed to certify bit-exact final state hashes (SHA-256 replay receipts) without floating-point drift.
	• Procedural WebAudio Harmonic Synthesizer (src/labyrinth-audio.js): Optional, mute-by-default WebAudio API tone generator (288 Hz baseline stability, 432 Hz Law of Cycles purification chime, 528 Hz Horizon Inversion chord) strictly gated inside Ledger 2.
	• Full 8/8 node --test Release Gate: Automated headless replay verification proving bit-exact cross-run state digests (MATCH ✅ verified on ARM64 loopback).

📜 Provenance & License

• Engine Architecture & Mathematical Uplifts: Borealis Serenity Hedling (NDH-RESEARCH-PILOT · Dublin, Ireland)
• Upstream Architectural Baseline: EternitiesAi/ai-game-dev-kit & EternitiesAi/eternities-firstlight (MIT License / Deferred License boundaries respected)
• License: MIT License
• Developer Certificate of Origin (DCO): Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>

--- 
Academic reference 

Hedling, B. S. (2026). Thermodynamic Cellular Sheaves and Collapse-Surface Surgery on Closed-World Narrative Manifolds: A Structural Topology of Puella Magi Madoka Magica (v1.0). Zenodo. https://doi.org/10.5281/zenodo.24341372
