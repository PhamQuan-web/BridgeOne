# 🌉 BridgeOne — Cùng Nhịp
### Two-Way Visual SOP Handoff, Workplace Justice & Provenance Protection Platform
**RMIT Accessibility Design Competition (ADC) Hackathon 2026**  
**Team PTQ (People, Trust, Quality)** | **Focus Area: Deaf & Hard of Hearing (Deaf/HoH)**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 Executive Summary & Problem Fit

In Vietnamese industrial manufacturing, Deaf and Hard of Hearing (HoH) workers possess exceptional manual dexterity and focus. However, systemic structural gaps trap them in precarious low-wage collaborator roles:

* **Stage 4 (Workplace Onboarding & Safety):** Communication fatigue from ad-hoc paper notes and chaotic Zalo text messages creates a **3–6 month adaptation lag**. Ambient machinery noise (>85 dB) renders verbal instructions useless, while factory blind corners and silent electric forklifts pose severe physical hazards.
* **The "Accountability Void":** When assembly errors or defect recalls occur, verbal instructions leave zero objective evidence. Managers defaults to blaming Deaf workers, fostering fear and mutual distrust.
* **Stage 5 & 6 (The Value-Compensation Trap & Career Ceilings):** Because employers fear operational risk and liability, Deaf employees are trapped in informal hourly allowances (**25,000 – 30,000 VND/hour**) with zero career progression or permanent benefits.

**BridgeOne** solves this structural failure with a zero-hardware-Capex web platform that bridges shopfloor communication, guarantees workplace justice, and generates verified empirical evidence for wage parity (**12,000,000 – 15,000,000 VND/month permanent contracts**) and promotion to Line Lead.

---

## 🚀 Key Innovation Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BRIDGEONE PLATFORM ARCHITECTURE                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
[PILLAR 1: VISUAL SOP]   [PILLAR 2: WORKPLACE JUSTICE]   [PILLAR 3: GROUNDED AI]
• 4-Step Visual Micro-SOP • SHA-256 Provenance Ledger   • Grounded Enterprise RAG
• 1-Touch Clarify Pause  • Zero-Penalty Guarantee       • Zero-Hallucination Guard
• Audio/Text Dictation   • Immutable Handshake Trail    • Factory SOP & Labor Code
• Universal Color States • Audit Verification Export    • 24/7 Empathetic Coaching
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    │
                                    ▼
                [PILLAR 4: ERGONOMICS & PROMOTION PIPELINE]
                • 360° Amber Visual Strobe Beacons
                • U-Shaped Assembly Line Direct Sightlines
                • Verified Competency Passport (Stage 5 to 6)
```

### 1. Two-Way Universal Visual SOP Handoff
* Replaces verbal plant briefings with structured, color-coded 4-step task cards.
* Hearing managers (e.g., Lead An) speak or dictate naturally; the system auto-structures the brief into visual milestones.
* Deaf workers (e.g., Worker Minh) can tap **1-Touch Clarification** to pause the task *before* assembly starts, preventing costly rework.

### 2. Immutable Provenance Audit Trail & Zero-Penalty Guarantee
* Every instruction handoff, amendment, and acknowledgment is cryptographically signed with a SHA-256 hash.
* **Workplace Justice Policy:** If an error stems from an ambiguous or altered instruction, the Deaf worker receives a **100% Zero-Penalty Guarantee**. The system eliminates wrongful blame and replaces mutual anxiety with verifiable psychological safety.

### 3. Enterprise AI Mentor (Grounded RAG)
* Non-judgmental 24/7 AI mentor operating on strict retrieval-augmented generation (RAG).
* **Guaranteed Zero Hallucination:** Answers strictly citing official plant SOPs, equipment safety manuals, and Vietnam Labor Code 2019 (Article 159).
* Enables Deaf operators to ask technical questions independently without communication anxiety.

### 4. Industrial Ergonomics & 360° Visual Beacons
* Re-engineers workstation architecture with **U-shaped cell layouts** that maintain uninterrupted 360° visual sightlines between operators and supervisors.
* Integrates synchronized on-screen visual strobe alerts (Amber flashing beacons) and ambient decibel monitoring to warn of oncoming warehouse traffic and emergency announcements.

### 5. Verified Competency Passport (Stages 5 to 6)
* Automatically aggregates objective operational metrics (SOP completion accuracy, defect-free cycles, safety compliance).
* Provides indisputable empirical proof to HR for upgrading workers from informal 25k–30k VND/h stipends into standard full-time labor contracts (12M–15M VND/month) and future Line Lead promotions.

---

## 🏛️ Alignment with the 7 Principles of Universal Design

| Principle | BridgeOne Implementation |
| :--- | :--- |
| **1. Equitable Use** | Identical digital handoff interface for both Deaf and hearing workers; eliminates stigma of segregated communication tools. |
| **2. Flexibility in Use** | Dual input modalities: Speech-to-Text, 1-tap visual preset chips, high-speed typing, and instant EN/VI language toggle. |
| **3. Simple & Intuitive** | 4-step card progression with color-coded status badges (Draft, Clarifying, Approved, Active, Completed); eliminates cognitive overload. |
| **4. Perceptible Information** | High-contrast WCAG AAA theme, ambient sound visualizer, 360° pulsating on-screen strobe alerts; zero auditory reliance. |
| **5. Tolerance for Error** | Pre-assembly clarification pause; immutable provenance trail automatically exempts workers from supervisor instruction errors. |
| **6. Low Physical Effort** | 1-touch rapid confirmation macros on shopfloor touchscreens; eliminates vocal strain and shouting over 85 dB plant machinery. |
| **7. Size & Space for Approach** | Responsive adaptive layout supporting handheld shopfloor tablets, industrial touch monitors, and overhead U-line displays. |

---

## 💻 Tech Stack & Architecture

* **Frontend Framework:** React 19, TypeScript 5.8
* **Build Tool:** Vite 6.4 (optimized production chunking & tree-shaking)
* **Styling & Design System:** Tailwind CSS 3.4, Lucide React icons, WCAG AAA compliant palettes
* **State Management:** React Context API with persistent local storage & real-time event dispatch
* **Audio & Sensory APIs:** Web Audio API (real-time ambient noise decibel meter), Web Vibration API roadmap
* **Security & Auditing:** SHA-256 digest hashing for immutable handoff logs
* **Deployment Compatibility:** 100% Docker-ready, static asset CDN deliverable, zero proprietary hardware lock-in

---

## ⚡ Quick Start & Verification

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/PhamQuan-web/BridgeOne.git
cd BridgeOne

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser to: **`http://localhost:3000`**

### Production Build
```bash
npm run build
```
Build output is generated into the `dist/` directory, verified error-free (`tsc --noEmit && vite build`).

---

## 🧪 Interactive Guided Demo Flows

Once running at `http://localhost:3000`, explore the complete multi-stakeholder journey via the **Demo Toolbar** at the bottom of the screen:

1. **Worker Station (Worker Minh — Deaf Operator):**
   * Navigate to **Tasks Hub** or **Minh View**.
   * Open **Task INS-1042** (Precision Housing Assembly).
   * Review the 4-step visual SOP. Tap **"Request Clarification"** to see live state synchronization.
   * Observe the ambient decibel sound meter (monitoring 85 dB machinery levels).

2. **Supervisor Hub (Lead An — Production Supervisor):**
   * Switch persona to **Lead An**.
   * View the incoming clarification request from Minh.
   * Click **"Approve & Sign SOP"** to generate an immutable SHA-256 provenance stamp.

3. **Workplace Justice & Accountability Audit:**
   * Navigate to **Accountability & Audit**.
   * Inspect the chronological tamper-evident audit ledger with exact timestamps and digital signatures.
   * Review the **Zero-Penalty Guarantee** validation badge.

4. **Grounded AI Learning Mentor:**
   * Navigate to **Learning & AI Mentor**.
   * Ask technical questions regarding torque settings, ESD protection, or Article 159 of Vietnam Labor Code.
   * Notice verified zero-hallucination citations referencing official factory operating manuals.

5. **Blind Corner & Industrial Safety Strobe:**
   * Trigger the **"Simulate Blind Corner Hazard"** button from the demo bar.
   * Experience the 360° Amber pulsating visual strobe and tactile warning designed for silent factory transport vehicles.

---

## 👥 Competition Team PTQ

* **Team Name:** PTQ (People, Trust, Quality)
* **Event:** RMIT Accessibility Design Competition (ADC) Hackathon 2026
* **Pitch Deck:** `PTQ_BridgeOne.pptx` (PowerPoint format, 8 slides with Appendices)
* **Pitch Video:** `PTQ_BridgeOne.mp4` (Duration: 04:49, 1080p 16:9, English narration)
* **GitHub Repository:** [https://github.com/PhamQuan-web/BridgeOne](https://github.com/PhamQuan-web/BridgeOne)

---

## 📜 Intellectual Property & Fair Play
This project is an original solution developed specifically for the RMIT Accessibility Design Competition 2026 under the Deaf/HoH focus track. All designs, code, mockups, and pitch materials strictly adhere to RMIT ADC Hackathon IP regulations and ethical Universal Design standards.
