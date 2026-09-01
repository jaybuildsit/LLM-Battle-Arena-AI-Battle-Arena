

# ⚔️ AI BATTLE ARENA

### *Autonomous Multi-LLM Benchmarking & Evaluation Platform*

[![React 19](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-StateGraph-FF6B6B?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>Enter a challenge. Watch two AI models compete in parallel. Let an independent arbiter decide the winner.</b>
</p>

[Explore Demo](#-quick-start) • [Architecture](#-system-architecture) • [Features](#-key-features) • [API Contract](#-api-contract)

---

</div>

## 📌 Executive Summary

**AI Battle Arena** is a developer tool and benchmarking platform that puts state-of-the-art Large Language Models into direct, head-to-head competition.

Instead of relying on generic synthetic benchmarks, AI Battle Arena:
1. **Dispatches your prompt** simultaneously to two rival LLMs (**Mistral** & **Cohere**).
2. **Streams & renders both solutions** side-by-side with full markdown and syntax-highlighted code.
3. **Engages an independent Arbiter (**Gemini 3.6 Flash**)** via **LangGraph** to grade both answers across technical accuracy, depth, structure, and instruction fidelity.
4. **Calculates numerical scores (0–10)**, breaks down detailed reasoning, and crowns the **Arena Champion**.

---

## 🏛 System Architecture

```
                                  ┌────────────────────────┐
                                  │      USER PROMPT       │
                                  └───────────┬────────────┘
                                              │
                               ┌──────────────┴──────────────┐
                               ▼                             ▼
                       ┌───────────────┐             ┌───────────────┐
                       │   MODEL 01    │             │   MODEL 02    │
                       │    Mistral    │             │    Cohere     │
                       └───────┬───────┘             └───────┬───────┘
                               │                             │
                               └──────────────┬──────────────┘
                                              ▼
                                      ┌───────────────┐
                                      │   AI JUDGE    │
                                      │  Gemini 3.6   │
                                      └───────┬───────┘
                                              ▼
                                   🏆 WINNER + SCORE (0-10)
```

---

## 🤖 Combatants & Arbiter Fleet

| Role | Model | Engine / Version | Primary Strength |
|---|---|---|---|
| **Combatant 01** | **Mistral** | `mistral-medium-latest` | Algorithmic logic, conciseness, O(1) code optimization |
| **Combatant 02** | **Cohere** | `command-a-vision-07-2025` | Deep contextual reasoning, instruction following |
| **Independent Judge** | **Gemini** | `gemini-3.6-flash` | Impartial multi-factor rubric verification & scoring |

---

## ✨ Key Features

- 🌌 **Dark Futuristic Cyber-Lab UI** — Glassmorphism panels (`backdrop-blur-xl`), cyberpunk mesh grid, and glowing telemetry beacons.
- ⚡ **Real-Time Arena Split View** — Dual solution cards with live synthesis waveforms and status steppers.
- 📝 **Markdown & Code Synthesis Engine** — Built-in parser with 1-click code copying, formatted headers, and callout quotes.
- ⚖️ **Impartial 4-Factor Rubric** — Technical Accuracy (40%), Depth & Completeness (30%), Structural Elegance (20%), and Prompt Adherence (10%).
- 🔍 **Expandable Judge Reasoning** — Accordion breakdowns for *"Why Model A scored 9.5"* vs *"Why Model B scored 4.0"*.
- 🏆 **Dynamic Champion Hero** — Score differential highlights with instant `[ View Winning Solution ]` smooth-scrolling.
- 📜 **Searchable Battle Archive** — Persistent `localStorage` history with instant replay capabilities.
- 🛡️ **Offline Simulation Engine** — Integrated fallback engine allowing instant demonstrations even without live API keys.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0+`
- **npm** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-battle-arena.git
   cd ai-battle-arena/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:5173](http://localhost:5173)** in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📂 Repository Structure

```
Frontend/
├── index.html                   # HTML entrypoint & typography tokens
├── package.json                 # Dependencies & scripts
├── postcss.config.js            # PostCSS Tailwind plugin configuration
├── vite.config.js               # Vite config & API proxy
├── src/
│   ├── main.jsx                 # Application entrypoint
│   ├── index.css                # Futuristic design system & animations
│   ├── app/
│   │   └── App.tsx              # Main controller & battle state orchestrator
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation bar with status beacon
│   │   ├── PromptInput.tsx      # Hero prompt card & benchmark presets
│   │   ├── ModelCard.tsx        # Combatant & judge cards
│   │   ├── BattleArena.tsx      # Active arena coordinating split panels
│   │   ├── SolutionPanel.tsx    # Split solution viewer & markdown renderer
│   │   ├── MarkdownView.tsx     # Custom code block & markdown engine
│   │   ├── JudgePanel.tsx       # Arbiter evaluation section
│   │   ├── ScoreCard.tsx        # Numerical score gauges
│   │   ├── ReasoningPanel.tsx   # Expandable judge reasoning accordions
│   │   ├── WinnerCard.tsx       # Champion announcement card
│   │   ├── BattleSummary.tsx    # Bottom recap & export telemetry
│   │   ├── BattleHistoryModal.tsx # Searchable history drawer
│   │   ├── ModelsModal.tsx      # Fleet specs & rubric documentation
│   │   ├── SettingsModal.tsx    # API endpoint & simulation settings
│   │   └── ErrorState.tsx       # Diagnostic card with retry & fallback
│   ├── services/
│   │   ├── api.ts               # Clean API service layer (POST / GET fallback)
│   │   └── mockData.ts          # Model metadata & realistic simulation engine
│   └── types/
│       └── battle.ts            # TypeScript interfaces & state schemas
```

---

## 🔌 API Contract

The frontend connects to the backend LangGraph pipeline via `src/services/api.ts`:

### Request
```http
POST /api HTTP/1.1
Content-Type: application/json

{
  "message": "Compare Event-Driven Microservices vs Modular Monolith."
}
```

### Response Schema
```json
{
  "problem": "Compare Event-Driven Microservices vs Modular Monolith.",
  "solution_1": "### Mistral Solution\n\n...",
  "solution_2": "### Cohere Solution\n\n...",
  "judge": {
    "solution_1_score": 9.4,
    "solution_2_score": 5.2,
    "solution_1_reasoning": "Mistral provided concrete latency metrics and ACID ledger guarantees...",
    "solution_2_reasoning": "Cohere gave a high-level summary without addressing the 50k req/sec constraint..."
  }
}
```

---



