> ### ✅ RELEASE v1.0 — DETERMINISTIC REPLAY & SHEAF KERNEL VERIFIED (`8/8` PASSING)
> **Status:** `v1.0` Core & Replay Engine Verified • Zero-Float `Q16.16` ARM64 Loopback Confirmed  
> 
> **Release Verification (Nov 2026):** All four development phases (`v0.1`–`v1.0`) are verified on ARM64 hardware (`node --test`: **8/8 passing**). The runtime features zero-float `Q16.16` cellular sheaf cohomology ($H^1$), discrete First & Second Law thermodynamic conservation, `A7.2` Tikhonov collapse repair, multi-chapter `game-verdict` state transitions, deterministic input-log replay (`SHA-256` verified `MATCH`), and mute-by-default `Ledger 2` WebAudio harmonic cues (`288 Hz / 432 Hz / 528 Hz`).

# 🌌 Spectral Labyrinth Engine — Zero-Float Cellular Sheaf Fan Game Runtime

**A deterministic, zero-dependency ESM web game engine uniting cellular sheaf cohomology, `Q16.16` symplectic physics, and `A7.2` collapse-surface repair across closed-world magical-girl timeline manifolds.**

[![License: MIT](https://shields.io)](LICENSE)
[![Runtime: Zero-Bundler ESM](https://shields.io)](#architecture)
[![Math: Q16.16 Symplectic](https://shields.io)](#math-substrate)

---

## ⚠️ Epistemic Charter, Persona-Zero & Non-Commercial Fan Boundary

1. **Non-Commercial Fan Tribute & Reusable Core:** The core engine (`core.js`, `sheaf-kernel.js`, `labyrinth-motion.js`) is 100% original, domain-agnostic, and MIT-licensed. All *Puella Magi Madoka Magica* / *Rebellion* timeline scenarios live exclusively inside swappable declarative campaign modules (`campaign-mitakihara-data.js`) as a non-commercial fan tribute.
2. **Persona-Zero Invariant (`EnneractSanta` / `PersonaZero.lean`):** Every character entity (`Madoka`, `Homura`, `Sayaka`, `Mami`, `Kyoko`, `Kyubey`) executes at runtime strictly as a deterministic `Q16.16` state vector and sparse matrix operator. Narrative text (`Ledger 2`) never alters physics integration, save integrity, or completion verdicts (`Ledger 1`).
3. **Deterministic Conservation & Verification:** All cellular sheaf operations execute in zero-float `Q16.16` fixed-point arithmetic with explicit First and Second Law conservation checks and automated `node --test` verification receipts.

---

## 🤝 Upstream Acknowledgements & Lineage

This engine builds directly on the architectural patterns, conceptual explorations, and formal guardrails of three distinct lineages:

* **`EternitiesAi` (`ai-game-dev-kit` & `eternities-firstlight`):** Grateful thanks for the modular, zero-bundler vanilla JS/CSS **Data / Model / Motion / UI / Art** separation (`*-data.js`, `*-model.js`, `*-motion.js`, `*-ui.js`, `*-art.js`), fixed-timestep simulation discipline, and versioned save schema conventions (`EternitiesAi`, MIT License).
* **Flyxion (`@standardgalactic`):** Special thanks for the conceptual direction around sheaf-theoretic structures, constraint-driven geometry, and recursive proof exploration, which helped inspire translating abstract topological framing into a playable, deterministic game kernel.
* **`Borealiscodes` NDH & Topological Enclave (`MadokaSheafTopology.jl`, `A7.2-CollapseSurfaceRepairPipeline`, `ai-game-dev-kit-specimen`):** Integrates the 4D cellular sheaf stalks (`Hope`, `Despair`, `Purity`, `Entropy`), Störmer–Verlet symplectic integration, `A7.2` Tikhonov clamping (λ = 98 / 65536 ≈ 0.0015), and the *Rebellion* \(\mathbb{Z}_2\)-twisted bundle edge case (`Hedling, 2026`).

---

## 📐 Core Math Substrate (`Ledger 1` — Zero-Float `Q16.16`)

To guarantee bit-exact cross-platform parity (ARM64, x86_64, and browser engines) without IEEE-754 floating-point drift across infinite timeline resets:

1. **4D `Q16.16` Stalk Vectors (\(\mathcal{F}(v) \in \mathbb{Z}_{32}^4\)):** Every node carries signed 32-bit fixed-point channels (`1.0 === 65536`) tracking `[Hope, Despair, Purity, Entropy]`.
2. **Weighted 0-Coboundary & H¹ Loop Holonomy:** Measures causal frustration across Homura's reset cycles:
   \[(\delta^0 \mathbf{x})_e = w_e \left(\mathcal{F}_{u \trianglelefteq e}\mathbf{x}_u - \mathcal{F}_{v \trianglelefteq e}\mathbf{x}_v\right), \qquad w_e = 1 + \lfloor \ln(\max(1, L_e)) \rfloor_{Q16.16}.\]
3. **Symplectic Labyrinth Traversal (`Störmer–Verlet`):** Integrates spatial distortion \(d_{\text{eff}} = d(1 + k e^{-r/R_{\text{lab}}})\) and despair/hope exchange on a deterministic `60 Hz` fixed timestep preserving phase-space volume.
4. **Universal Edge Case (*Rebellion* Isolation Field & `A7.2` Repair):** When an Incubator Isolation Field severs global restriction maps (\(\sigma_{\min} \to 0^+\)), the kernel clamps denominators at \(\lambda_{Q16.16} = 98\) (≈ 0.0015), applies bounded \(\operatorname{atanh}\) contraction, and engages the \(\mathbb{Z}_2\) orientation twist (`HorizonsInverted`) so H¹ ≠ 0 holds in metastable equilibrium without NaN poles.

---

## 📁 Repository Structure (`EternitiesAi` Modular Split)

```text
spectral-labyrinth-engine/
├── index.html                        # Zero-bundler ESM entrypoint
├── style.css                         # Clean HUD & labyrinth viewport styling
├── src/
│   ├── core.js                       # Q16.16 fixed-point arithmetic, seeded PRNG (Law 7), & save versioning (Law 5)
│   ├── sheaf-kernel.js               # Coboundary δ⁰, 1st/2nd Law thermodynamic checks, & A7.2 Tikhonov clamp
│   ├── labyrinth-motion.js           # Symplectic Störmer–Verlet spatial distortion & despair/hope integrator
│   ├── labyrinth-art.js              # Read-only 2D Canvas/SVG procedural barrier & holonomy loop renderer (Ledger 2)
│   ├── campaign-mitakihara-data.js   # Declarative Mitakihara loops, Law of Cycles, & Rebellion edge-case nodes
│   ├── campaign-mitakihara-ui.js     # Read-only HUD, Soul Gem purity meter, & narrative log (Ledger 2)
│   └── app.js                        # Fixed-timestep game loop & deterministic input dispatcher
└── test/
    └── verify-engine.test.mjs        # Built-in `node --test` suite enforcing game-verdict invariants
```

---

## 🚀 Quickstart & Deterministic Verification

Zero `npm install` bloat required (Node.js 20+ for tests; any static HTTP server for browser play):

```bash
# 1. Run deterministic game-verdict & thermodynamic verification tests
node --test test/verify-engine.test.mjs

# 2. Launch locally in browser
python3 -m http.server 8080
```

---

## 📜 Provenance & License

* **Engine Architecture & Mathematical Uplifts:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` · Dublin, Ireland)
* **Upstream Architectural Baseline:** `EternitiesAi/ai-game-dev-kit` & `EternitiesAi/eternities-firstlight` (MIT License / Deferred License boundaries respected)
* **License:** MIT License

## 🗺️ Interactive Features Roadmap (`v0.1` → `v1.0`)

* **Phase 1 (`v0.1` — Complete ✅):** Zero-float `Q16.16` cellular sheaf kernel, discrete First & Second Law conservation checks, `A7.2` Tikhonov collapse repair, `6/6` `node --test` verification, and live `60 Hz` Canvas telemetry HUD.
* **Phase 2 (`v0.2` — Complete ✅):** Direct pointer/touch 0-cell node selection on the Canvas, WASD / Arrow / touch-button symplectic radial thrust (`q`, `p`) modulating spatial distortion $d_{\text{eff}}(r)$, live dashed radial depth ring, and red $D_{\text{break}}$ breach warning halos.
* **Phase 3 (`v0.3` — Complete ✅):** Multi-chapter campaign switcher (**Ch. I: Loop 100**, **Ch. II: Law of Cycles**, **Ch. III: Rebellion `A7.2`**), deterministic `game-verdict` win/loss state machine (`ACTIVE`, `VICTORY_STABILIZED`, `BREACH_COLLAPSE`, `ENTROPY_OVERFLOW`), and `7/7` `node --test` verification on ARM64.
* **Phase 4 (`v1.0` — Deterministic Replay Receipts & Ledger-2 Audio):**
  * **Input-Log Replay Engine (`src/replay-verifier.js`):** Records `{ tick, action, targetIdx }` tuples during a run and re-simulates from the initial `Q16.16` seed to certify bit-exact final state hashes (`SHA-256` replay receipts) without floating-point drift.
  * **Procedural WebAudio Harmonic Synthesizer (`src/labyrinth-audio.js`):** Optional, mute-by-default WebAudio API tone generator (`288 Hz` baseline stability, `432 Hz` Law of Cycles purification chime, `528 Hz` Horizon Inversion chord) strictly gated inside `Ledger 2` so audio events never influence `Ledger 1` physics.
  * **Full `8/8` `node --test` Release Gate:** Automated headless replay verification test proving two independent runs with identical seed and input logs produce identical final `Q16.16` stalks and `game-verdict` hashes.
