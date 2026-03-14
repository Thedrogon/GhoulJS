# GhoulJS

A high-performance, open-source JavaScript and TypeScript scratchpad. Built as a lean alternative to RunJS.

## Overview

GhoulJS provides a stripped-down, lightning-fast execution environment for developers. It eliminates UI bloat and focuses strictly on what matters: an integrated Monaco editor, secure AST-based code guards, and real-time execution of JS/TS.

v0 is forked from [WizardJS](https://github.com/FranciscoJBrito/WizardJS), stripped off its Internalizations and fixed its bloated elements.

v1 (upcoming) will have portions rewritten in Rust inorder to lean out the app further.

## Features

- **Zero-Config TypeScript:** Native, on-the-fly TS transpilation.
- **Monaco Engine:** The core VS Code editor experience with IntelliSense.
- **Secure Sandbox:** Infinite loop detection, strict execution timeouts, and sanitized IPC logging.
- **Multi-Tab Execution:** Isolated context environments per tab.
- **Lean UI:** Keyboard-shortcut driven workflow with absolute minimal DOM overhead.
- **Custom Themes:** Ships with 'Ghoul Dark' and 'Paladin Light'.

## Development Setup

### Prerequisites
- Node.js (v20+)
- npm

### Installation

```bash

# Clone the repo
git clone https://github.com/thedrogon/GhoulJS.git

cd GhoulJS

# Get the running dependencies
npm install

# Start development server
npm run dev

# Package application binaries
npm run make
```

## File Structure

```bash

src/
├── main.ts                    # Electron main process & OS bridging
├── preload.ts                 # Secure IPC context isolation
├── index.css                  # UI layout and theming
└── renderer/
    ├── index.ts               # Entry point
    ├── app/
    │   └── GhoulJSApp.ts      # Main application orchestrator
    ├── core/
    │   ├── EditorManager.ts   # Monaco lifecycle and memory management
    │   ├── ExecutionEngine.ts # Sandbox execution and AST parsing
    │   ├── TabsManager.ts     # Tab state management
    │   └── Themes.ts          # Custom Monaco themes
    ├── ui/
    │   ├── Output.ts          # Safe IPC object stringification
    │   ├── SettingsPanel.ts   # Configuration modal
    │   ├── SplitResizer.ts    # High-performance flexbox resizing
    │   ├── TabsView.ts        # Tab DOM management
    │   └── Toolbar.ts         # Execution controls
    ├── services/
    │   └── SettingsStore.ts   # LocalStorage persistence
    ├── utils/
    │   ├── codeGuards.ts      # Syntax validation and security blocks
    │   └── tsHelpers.ts       # TypeScript compiler wrappers
    └── config/
        ├── constants.ts       # Application defaults
        └── types.ts           # Shared interfaces

```