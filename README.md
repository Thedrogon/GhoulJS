# GhoulJS

A high-performance, open-source JavaScript and TypeScript scratchpad. Built as a lean alternative to RunJS.

## Overview

GhoulJS provides a stripped-down, lightning-fast execution environment for developers. It eliminates UI bloat and focuses strictly on what matters: an integrated Monaco editor, secure AST-based code guards, and real-time execution of JS/TS.

v0 is forked from [WizardJS](https://github.com/FranciscoJBrito/WizardJS), stripped off its Internationalizations and fixed its bloated elements.

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

#Get into the working dir
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


## Architecture

So below is the architecture that I have followed for prototyping the current version of this app. The app does not intend to use your pc local version of node.js rather it uses the prebundled version provided by electron.

GhoulJS operates on a strict three-tier architecture defined by Electron's security model.

```bash

====================================================================
                        OS LEVEL (Node.js)
====================================================================
[ main.ts ]
  - The "Backend" of the app.
  - Controls the native OS Window, Top-Level Menus, and Auto-Updater.
  - Intercepts native shortcuts (Cmd+S, Cmd+R) and sends signals down.

                                 |
                                 v
====================================================================
                    THE BRIDGE (Context Isolation)
====================================================================
[ preload.ts ]
  - The security checkpoint.
  - Passes "menu-run-code" or "menu-save-file" IPC messages from 
    Node.js down to the Chromium renderer. 

                                 |
                                 v
====================================================================
                  SANDBOX LEVEL (Chromium / UI)
====================================================================
[ GhoulJSApp.ts ] (The Orchestrator)
  |
  +-- [ EditorManager.ts ]
  |     - Mounts Monaco Editor.
  |     - Handles IntelliSense and syntax highlighting.
  |
  +-- [ TabsManager.ts ]
  |     - Maintains state for multiple independent code buffers.
  |
  +-- [ ExecutionEngine.ts ] <--- THE CORE
  |     - 1. Receives raw string from Editor.
  |     - 2. Code Guards check for balanced brackets & dangerous APIs.
  |     - 3. Injects AST (Abstract Syntax Tree) guards to prevent infinite loops.
  |     - 4. Transpiles TypeScript -> ES2020 on the fly.
  |     - 5. Executes code inside a dynamic `new Function()` wrapper.
  |
  +-- [ Output.ts ]
        - Intercepts console.logs and results from the ExecutionEngine.
        - Parses objects safely and renders them to the UI sequentially.

```