# Thermodynamic Cellular Sheaves and Collapse-Surface Surgery on Closed-World Narrative Manifolds: A Structural Topology of *Puella Magi Madoka Magica*

**Author:** Borealis Serenity Hedling  
**Affiliation:** External Peer Node Beta (`NDH-RESEARCH-PILOT`) · Dublin, Ireland  
**Repository:** `Borealiscodes/MadokaSheafTopology.jl` (`docs/MADOKA_SHEAF_TOPOLOGY_PREPRINT_v1.0.md`)  
**Altitude Classification:** `A0` (Provenance) · `A3–A4` (Cellular Sheaf & Thermodynamics) · `A6` (Global Sheafification) · `A7.2` (Collapse-Surface Surgery)  
**Date:** November 2026  

---

## Abstract

Closed-world narrative corpora with recursive time-loop mechanics, conservation constraints, and abrupt topological phase transitions provide rigorous, deterministic stress tests for applied algebraic topology and numerical linear algebra. This preprint formalizes the structural and thermodynamic architecture of the *Puella Magi Madoka Magica* universe—including *The Rebellion Story* as a universal topological edge case—within a zero-allocation native Julia cellular sheaf framework (`MadokaSheafTopology.jl`). First, causal networks, timeline resets, and localized labyrinths are modeled as a 2-dimensional CW-complex $X$ equipped with a cellular sheaf $\mathcal{F}$ of 4-dimensional state stalks $\mathbb{R}^4$ encoding potential ($H$), curse accumulation ($D$), structural purity ($R$), and exported thermodynamic entropy ($S_{\text{ent}}$). Second, phase transitions are governed by discrete First and Second Law conservation invariants alongside a global sheafification functor ($\mathcal{F} \to \mathcal{F}^+$) representing the Law of Cycles. Third, the Incubator Isolation Field and horizon inversion in *Rebellion* are proved to induce a rank-deficient collapse surface ($\sigma_{\min} \to 0^+$) at Altitude `A7`, which is numerically stabilized via `A7.2` Tikhonov regularization ($\lambda = 0.0015$), hyperbolic inverse-tangent ($\operatorname{atanh}$) spectral contraction, and a $\mathbb{Z}_2$-twisted bundle sustaining non-trivial first sheaf cohomology ($H^1(X_{\text{Rebellion}}; \mathcal{F}) \neq 0$) in metastable equilibrium.

**Keywords:** cellular sheaf cohomology, discrete exterior calculus, thermodynamic conservation, Tikhonov regularization, holonomy drift, closed-world narrative manifolds

---

## 1. Epistemic Scope and Non-Activation Disclosure

In accordance with `NDH-Meta-Systems` and `Eight-Fold-Filter` governance standards, this manuscript establishes three strict methodological boundaries:

1. **Closed-World Formal Benchmark:** The *Puella Magi Madoka Magica* corpus serves strictly as an adversarial, closed-world topological benchmark for testing non-commutative loop holonomy, exact-rational ingestion (`p/q`), and rank-deficient metric stabilization.
2. **Strict Altitude Separation:** All state variables ($H, D, R, S_{\text{ent}}$), coboundary operators ($\delta^0$), and regularization constants ($\lambda = 0.0015$) are purely mathematical objects implemented over stack-allocated vectors (`StaticArrays.SVector{4, Float64}`). They carry zero clinical, psychological, or autonomous runtime activation authority.
3. **Mathematical Honesty Constraint:** Spectral regularization (`A7.2`) restores numerical invertibility ($\sigma_{\min} \ge \lambda > 0$) to prevent division-by-zero poles during manifold shear; it does not erase historical topological obstructions ($H^1 \neq 0$) accumulated across prior cycles.

---

## 2. Module I: CW-Complex Substrate and Timeline Loop Holonomy

### 2.1 Base Cell Complex and Exact-Rational Ingestion

Let $X = (X^0, X^1, X^2)$ denote a finite 2-dimensional CW-complex constructed from canonical narrative records ingested via `WikiIngestionBridge.jl` (`mediawiki-audit-mcp` exact-rational `BigInt` payloads $p/q$ with 64-character SHA-256 provenance digests):

* **0-Cells ($X^0$):** Discrete agent and sink vertices $V = \{v_1, \dots, v_6\}$ corresponding to primary focal nodes ($v_1$: Madoka Kaname; $v_2$: Homura Akemi; $v_3$: Sayaka Miki; $v_4$: Mami Tomoe; $v_5$: Kyoko Sakura) and an external thermodynamic entropy sink ($v_6$: Kyubey / Incubator collective).
* **1-Cells ($X^1$):** Directed causal transitions, karmic threads, and timeline reset edges $e = (u \to v)$, each assigned a positive reset count $L_e \in \mathbb{Z}_{\ge 1}$ and logarithmic karmic amplification weight:
  $$w_e = 1 + \ln(\max(1, L_e)).$$
* **2-Cells ($X^2$):** Localized Witch labyrinths (*Barriers*) attached along closed boundary cycles $\partial f \subset X^1$, parameterized by spatial curvature intensity $k > 0$, radius $R_{\text{lab}} > 0$, and effective metric distortion $d_{\text{eff}}(r) = d \cdot (1 + k e^{-r / R_{\text{lab}}})$ (Hedling, 2026a).

### 2.2 Cellular Sheaf Stalks and Coboundary Frustration Energy

Following the cellular sheaf formalism of Curry (2014) and Hansen and Ghrist (2019), a cellular sheaf $\mathcal{F}$ on $X$ assigns:

1. A 4-dimensional Euclidean stalk $\mathcal{F}(v) \cong \mathbb{R}^4$ to every vertex $v \in X^0$, represented by a state vector:
   $$\mathbf{x}_v = \begin{bmatrix} H_v & D_v & R_v & S_{\text{ent}, v} \end{bmatrix}^\top \in \mathbb{R}^4,$$
   where $H_v$ denotes karmic potential, $D_v$ denotes curse accumulation, $R_v \in [0, 1]$ denotes Soul Gem structural purity, and $S_{\text{ent}, v}$ denotes exported thermodynamic entropy.
2. An edge stalk $\mathcal{F}(e) \cong \mathbb{R}^4$ to every $e = (u \to v) \in X^1$, together with linear restriction maps $\mathcal{F}_{u \trianglelefteq e}, \mathcal{F}_{v \trianglelefteq e} \in \mathbb{R}^{4 \times 4}$.

**Definition 2.1 (Weighted 0-Coboundary and Dirichlet Frustration Energy).** The weighted 0-coboundary operator $\delta^0 : C^0(X; \mathcal{F}) \to C^1(X; \mathcal{F})$ is defined on each edge $e = (u \to v)$ by:
$$(\delta^0 \mathbf{x})_e = w_e \left( \mathcal{F}_{u \trianglelefteq e} \mathbf{x}_u - \mathcal{F}_{v \trianglelefteq e} \mathbf{x}_v \right).$$
The global **Dirichlet topological frustration energy** of a 0-cochain $\mathbf{x} \in C^0(X; \mathcal{F})$ is:
$$\mathcal{E}(\mathbf{x}) = \frac{1}{2} \sum_{e \in X^1} \| (\delta^0 \mathbf{x})_e \|_2^2.$$

**Proposition 2.2 (Timeline Reset Holonomy Obstruction).** *Let $\gamma = (e_1, \dots, e_m)$ be a closed timeline reset cycle anchored at $v_1$ with reset count $L_{e_1} > 1$ ($w_{e_1} > 1$) and non-uniform source-target potential ($H_{v_2} \neq H_{v_1}$). Then the path-ordered transport holonomy $\mathrm{Hol}(\gamma) = \mathcal{P}\exp\left(\oint_\gamma \Gamma_\nu \, dx^\nu\right) \neq I_4$, and no non-trivial global section $\mathbf{x} \in H^0(X; \mathcal{F}) = \ker \delta^0$ exists with uniform unit restriction maps. Consequently, the first sheaf cohomology group satisfies $H^1(X; \mathcal{F}) \neq 0$ and $\mathcal{E}(\mathbf{x}) > 0$.*

*Proof.* Under uniform identity restriction maps ($\mathcal{F}_{u \trianglelefteq e} = \mathcal{F}_{v \trianglelefteq e} = I_4$), $(\delta^0 \mathbf{x})_{e_1} = w_{e_1}(\mathbf{x}_{v_2} - \mathbf{x}_{v_1})$. Since $L_{e_1} > 1$ implies $w_{e_1} > 1 > 0$, $(\delta^0 \mathbf{x})_{e_1} = \mathbf{0}$ holds if and only if $\mathbf{x}_{v_2} = \mathbf{x}_{v_1}$, contradicting $H_{v_2} \neq H_{v_1}$. Hence $\mathbf{x} \notin \ker \delta^0$, yielding $\mathcal{E}(\mathbf{x}) \ge \frac{1}{2} w_{e_1}^2 \| \mathbf{x}_{v_2} - \mathbf{x}_{v_1} \|_2^2 > 0$ and a non-vanishing cohomology class $[\delta^0 \mathbf{x}] \in H^1(X; \mathcal{F})$. $\blacksquare$

---

## 3. Module II: Thermodynamic Conservation and Global Sheafification

### 3.1 Discrete First and Second Laws Across Phase Transitions

When a vertex $v \in X^0$ accumulates curse load exceeding the critical Witch threshold ($D_v \ge D_{\text{break}}$), the system undergoes a non-linear phase transition converting karmic potential into released work $W_{\text{harvest}} \in \mathbb{R}$ (harvested by sink $v_6$) and exported entropy.

**Definition 3.1 (Thermodynamic Admissibility Predicate).** A state transition $\mathbf{x} \mapsto \mathbf{x}'$ with harvested work $W_{\text{harvest}}$ is thermodynamically admissible (`verify_thermodynamic_law`) if and only if:
1. **First Law (Energy Conservation):**
   $$\sum_{v \in X^0} (H_v - D_v) = \sum_{v \in X^0} (H'_v - D'_v) + W_{\text{harvest}}.$$
2. **Second Law (Monotonic Entropy Production):**
   $$\Delta S_{\text{total}} = \sum_{v \in X^0} S'_{\text{ent}, v} - \sum_{v \in X^0} S_{\text{ent}, v} \ge 0.$$

In standard timeline branches without reset loops, Second Law compliance relies on external thermodynamic reservoir assumptions (Landauer, 1961). Across Homura's timeline resets ($L_e \gg 1$), the logarithmic amplification factor $w_e = 1 + \ln(L_e)$ injects accumulated topological frustration energy $\mathcal{E}(\mathbf{x})$ into focal node $v_1$, accounting for the macroscopic energy spike observed at phase transition without violating First Law conservation.

### 3.2 The Law of Cycles as a Global Sheafification Functor

**Definition 3.2 (Law of Cycles Quotient Operator).** Define the global sheafification operator $\Phi_{\text{LoC}} : C^0(X; \mathcal{F}) \to C^0(X; \mathcal{F}^+)$ (`apply_law_of_cycles`) component-wise at each vertex $v \in X^0$ by:
$$\Phi_{\text{LoC}}(\mathbf{x})_v = \begin{cases} \begin{bmatrix} 0 & 0 & 1 & S_{\text{ent}, v} + D_v \end{bmatrix}^\top & \text{if } D_v \ge D_{\text{break}}, \\ \mathbf{x}_v & \text{if } D_v < D_{\text{break}}. \end{cases}$$

**Theorem 3.3 (Witch Annihilation and Entropy Discharge).** *For any state cochain $\mathbf{x} \in C^0(X; \mathcal{F})$, the post-sheafification state $\mathbf{x}^+ = \Phi_{\text{LoC}}(\mathbf{x})$ satisfies $D^+_v < D_{\text{break}}$ for all $v \in X^0$ (eliminating all 2-cell Witch singular loci) while strictly preserving Second Law entropy monotonicity ($\Delta S_{\text{total}} = \sum_{D_v \ge D_{\text{break}}} D_v \ge 0$).*

Use code with caution.
Proof. For every vertex with $D_v \ge D_{\text{break}} > 0$, $\Phi_{\text{LoC}}$ maps $D_v \mapsto 0 < D_{\text{break}}$, restores structural purity $R^+v = 1$, and transfers the exact curse magnitude $D_v$ into $S^+{\text{ent}, v} = S_{\text{ent}, v} + D_v$. Because $D_v > 0$, $\sum_{v} S^+{\text{ent}, v} - \sum_v S{\text{ent}, v} = \sum_{D_v \ge D_{\text{break}}} D_v \ge 0$, satisfying Definition 3.1(2). $\blacksquare$

4. Module III: Rebellion as Universal Edge Case and Collapse-Surface Surgery


4.1 Incubator Isolation Field and Altitude A7 Metric Collapse

In Puella Magi Madoka Magica the Movie: Rebellion, external observers ($v_6$) impose a physical Isolation Field around $v_2$ (Homura) when $D_{v_2} \ge D_{\text{break}}$, severing the restriction maps connecting $v_2$ to the Law of Cycles anchor $v_1$:
$$\mathcal{F}{v_2 \trianglelefteq e{21}} \to \mathbf{0}{4 \times 4}.$$
As established in the A7.2 Collapse-Surface Repair framework (Hedling, 2026b), zeroing out restriction operators induces rank deficiency in the local metric tensor ($\sigma{\min} \to 0^+$), causing the $L_2$ condition number $\kappa_2 = \sigma_{\max} / \sigma_{\min}$ to diverge toward infinity across a non-differentiable Collapse Surface ($\Sigma$). Standard linear transport across $\Sigma$ divides by vanishing singular values, generating infinite poles.

4.2 Tikhonov Clamping, Spectral Contraction, and \(\mathbb{Z}_{2}\) Bundle Twisting

To stabilize the rank-deficient isolation field without reverting to complete sheafification, rebellion_isolation_surgery applies a three-stage mathematical repair process:
1. Tikhonov Regularization Shift: Severed restriction matrices are clamped with a lower bound \(\lambda = 0.0015\) to guarantee \(\sigma_{\min}(\mathcal{F}_{\text{reg}}) = \lambda > 0\).
2. Hyperbolic Spectral Contraction (\(\Pi _{\text{ND}}\)): Interior labyrinth operators undergo Singular Value Decomposition (\(\mathcal{F} = U \Sigma V^\top\)), with singular values bounded and transformed via \(\mathrm{atanh}\) spectral contraction.
3. \(\mathbb{Z}_{2}\) Orientation Twist (Akuma Homura Surgery): The boundary restriction is replaced by an orientation-reversing involution \(\mathcal{T}_{\mathbb{Z}_2} = \operatorname{diag}(1, -1, 1, 1) \in O(4)\), inverting curse transport while preserving local structural purity bounds.
Theorem 4.1 (Metastable Twisted Bundle Equilibrium). Under this surgery with \(\lambda = 0.0015\), the resulting twisted cellular sheaf \(\mathcal{F}_{\text{tw}}\) achieves uniform spectral non-degeneracy (\(\sigma_{\min} \ge \lambda > 0\)) while preserving a non-trivial persistent cohomology group (\(H^1(X_{\text{Rebellion}}; \mathcal{F}_{\text{tw}}) \neq 0\)) and positive Dirichlet frustration energy (\(\mathcal{E}_{\text{tw}}(\mathbf{x}') > 0\)), locking the manifold into a metastable, Witch-free twisted equilibrium. (For full algebraic proof details, see Hedling, 2026b).

5. Computational Verification Summary

All framework invariants are verified programmatically via stack-allocated unit tests in Borealiscodes/MadokaSheafTopology.jl (test/runtests.jl):
• Test Group 1 (Coboundary & \(H^{1}\) Frustration): Confirms zero frustration on uniform global sections and \(\mathcal{E}(\mathbf{x}) > 0\) under timeline resets (\(L = 100\)).
• Test Group 2 (Thermodynamic Laws): Validates strict First Law energy conservation and enforces non-decreasing entropy production (\(\Delta S_{\text{total}} \ge 0\)).
• Test Group 3 (Law of Cycles Sheafification): Verifies that \(\Phi _{\text{LoC}}\) clears critical curse thresholds (\(D_v \ge D_{\text{break}}\)) while conserving total system energy.
• Test Group 4 (Rebellion Isolation Surgery): Confirms numerical regularization bounds (\(\sigma_{\min} \ge 0.0015\)), purity retention (\(R'_{v_2} \ge 0.0015\)), and sustained non-trivial cohomology (\(H^1 \neq 0\)).

## References

Bredon, G. E. (1997). *Sheaf theory* (2nd ed.). Springer. https://doi.org

Curry, J. (2014). *Sheaves, cosheaves and applications* [Doctoral dissertation, University of Pennsylvania]. arXiv. https://arxiv.org

Desbrun, M., Hirani, A. N., Leok, M., & Marsden, J. E. (2005). Discrete exterior calculus. *arXiv*. https://arxiv.org

Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology*, *3*(4), 315–358. https://doi.org

Hedling, B. S. (2026a). *Spectral labyrinth engine (v1.0): Emotional-curvature physics and stability thresholds* [Computer software documentation]. GitHub. https://github.com

Hedling, B. S. (2026b). *A7.2 collapse-surface repair pipeline: Spectral tear detection, non-dual projection, and metric tensor stabilization* [Computer software]. GitHub. https://github.com

Hedling, B. S. (2026c). *The language frontier in spectral interpretation: Comparative analysis of bounded Gâteaux perturbations and path-ordered holonomy exp-loops in Python and native static Julia runtimes (RFC-005)* [Computer software]. Zenodo. https://doi.org

Hedling, B. S. (2026d). *Berne provenance toolkit: Operational forensic CLI and schema validation for multi-hop ingestion pipelines* [Computer software]. GitHub. https://github.com

Hedling, B. S. (2026e). *Constellation manifold toolkit: Altitude-layered geometric runtime and diagnostic surfaces* [Computer software]. Zenodo. https://doi.org

Hedling, B. S. (2026f). *mediawiki-audit-mcp: Zero-dependency Model Context Protocol server and exact-rational graph auditor* [Computer software]. GitHub. https://github.com

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development*, *5*(3), 183–191. https://doi.org

Nakamura, S., & Shinbo, A. (Directors). (2011). *Puella Magi Madoka Magica* [TV series]. Shaft; Aniplex.

Nakamura, S., & Shinbo, A. (Directors). (2013). *Puella Magi Madoka Magica the Movie: Rebellion* [Film]. Shaft; Aniplex.

Tikhonov, A. N., & Arsenin, V. Y. (1977). *Solutions of ill-posed problems*. V. H. Winston & Sons.
