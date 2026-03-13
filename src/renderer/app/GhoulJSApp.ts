import { SettingsStore } from "../services/SettingsStore";
import { configureMonaco } from "../core/MonacoConfig";
import { registerThemes } from "../core/Themes";
import { EditorManager } from "../core/EditorManager";
import { TabsManager } from "../core/TabsManager";
import { mountSettingsUI } from "../ui/SettingsPanel";
import { mountToolbar } from "../ui/Toolbar";
import { mountSplitResizer } from "../ui/SplitResizer";
import {
  addPaneDom,
  addTabDom,
  mountTabsHandlers,
  removeTabDom,
  switchTo,
} from "../ui/TabsView";
import { appendOutput, clearOutput, appendSecurity } from "../ui/Output";
import { AUTO_RUN_DELAY } from "../config/constants";
import { ExecutionEngine } from "../core/ExecutionEngine";
import "../config/electron.d.ts";

export class GhoulJSApp {
  private store = new SettingsStore();
  private editors = new EditorManager(() => this.store.get());
  private tabs = new TabsManager();
  private engine = new ExecutionEngine();
  private autoRunTimeout = new Map<string, any>();

  constructor() {
    configureMonaco();
    registerThemes();
    
    this.editors.setOnContentChange((tabId) => this.scheduleAutoRun(tabId));
    
    const first = this.tabs.initFirstTab(this.getWelcomeCode());
    addTabDom(first, "Untitled-1");
    addPaneDom(first);
    setTimeout(() => {
      this.editors.create(first, this.tabs.get(first)!.content);
      this.switchTo(first);
      this.applyEditorSettings();
    }, 10);

    mountToolbar(
      () => this.executeCode(),
      () => clearOutput(this.tabs.active()),
      () => this.stopExecution()
    );
    
    mountSplitResizer();
    mountSettingsUI(this.store, () => this.applyEditorSettings());
    mountTabsHandlers(
      this.tabs,
      this.editors,
      (id) => this.switchTo(id),
      (id) => this.closeTab(id)
    );
    this.setupKeyboardShortcuts();
    this.setupMenuListeners();
  }

  private setupMenuListeners() {
    const api = window.electronAPI;
    if (!api) return; 
    
    api.onMenuNewFile(() => this.newFile());
    api.onMenuOpenFile(() => this.openFile());
    api.onMenuSaveFile(() => this.saveFile());
    api.onMenuRunCode(() => this.executeCode());
    api.onMenuClearOutput(() => clearOutput(this.tabs.active()));
    api.onMenuAbout(() => this.showAbout());
  }

  private showAbout() {
    const version = "1.0.0";
    alert(`GhoulJS v${version}\n\nThe Lean JavaScript & TypeScript Playground\n\nBuilt for speed.`);
  }

  private applyEditorSettings() {
    const s = this.store.get();
    const lineHeight = 24; 
    
    this.editors.forEach((e) => {
      e.updateOptions({
        theme: s.theme,
        fontSize: s.fontSize,
        fontFamily: s.fontFamily,
        lineHeight: lineHeight,
        wordWrap: s.wordWrap ? "on" : "off",
        minimap: { enabled: s.minimap },
        lineNumbers: s.lineNumbers ? "on" : "off",
        tabSize: s.tabSize,
      });
    });

    document.querySelectorAll(".output-container").forEach((el) => {
      const h = el as HTMLElement;
      h.style.setProperty("--editor-font-family", `"${s.fontFamily}", monospace`);
      h.style.setProperty("--editor-font-size", `${s.fontSize}px`);
      h.style.setProperty("--editor-line-height", `${lineHeight}px`);
    });
  }

  private scheduleAutoRun(tabId: string) {
    const t = this.autoRunTimeout.get(tabId);
    if (t) clearTimeout(t);
    const handle = setTimeout(() => {
      const ed = this.editors.get(tabId);
      if (!ed) return;
      const code = ed.getValue();
      if (this.store.get().autoRunEnabled && this.engine.isReady(code))
        this.executeCode();
    }, AUTO_RUN_DELAY);
    this.autoRunTimeout.set(tabId, handle);
  }

  private switchTo(id: string) {
    this.tabs.setActive(id);
    switchTo(id);
    setTimeout(() => {
      this.editors.get(id)?.layout?.();
      this.applyEditorSettings();
    }, 50);
  }

  private newFile() {
    const id = this.tabs.create();
    addTabDom(id, `Untitled-${id.split("-")[1]}`);
    addPaneDom(id);
    setTimeout(() => {
      this.editors.create(id, "");
      this.switchTo(id);
    }, 50);
  }

  private closeTab(id: string) {
    if (this.tabs.size() <= 1) return;
    const td = this.tabs.get(id);
    if (
      td?.isDirty &&
      !confirm(`Do you want to save changes to ${td.title}?`)
    ) {
      // user chose not to save, proceed to close
    }
    this.editors.dispose(id);
    this.tabs.remove(id);
    removeTabDom(id);
    if (this.tabs.active() === id) {
      const rest = this.tabs.allIds();
      if (rest.length) this.switchTo(rest[0]);
    }
  }

  private executeCode() {
    const ed = this.editors.get(this.tabs.active());
    if (!ed) return;
    const code = ed.getValue();
    clearOutput(this.tabs.active());
    this.engine.run(code, (type, args) => {
      if (type === "security")
        appendSecurity(this.tabs.active(), String(args[0]));
      else appendOutput(this.tabs.active(), type, args);
    });
  }

  private stopExecution() {
    this.engine.abort();
    appendSecurity(this.tabs.active(), "Execution stopped by user");
  }

  private async openFile() {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "JavaScript/TypeScript Files",
            accept: {
              "text/javascript": [".js", ".mjs"],
              "text/typescript": [".ts", ".tsx"],
            },
          },
          {
            description: "All Files",
            accept: { "*/*": [] },
          },
        ],
        multiple: false,
      });
      const file = await fileHandle.getFile();
      const content = await file.text();
      const name = file.name;

      const id = this.tabs.create();
      this.tabs.set(id, { title: name, content, isDirty: false, file: name });
      addTabDom(id, name);
      addPaneDom(id);
      setTimeout(() => {
        this.editors.create(id, content);
        this.switchTo(id);
        const tabEl = document.querySelector(`[data-tab-id="${id}"].tab .tab-title`);
        if (tabEl) tabEl.textContent = name;
      }, 50);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error opening file:", err);
      }
    }
  }

  private async saveFile() {
    const activeId = this.tabs.active();
    const ed = this.editors.get(activeId);
    const td = this.tabs.get(activeId);
    if (!ed || !td) return;

    const content = ed.getValue();
    const suggestedName = td.file || td.title || "untitled.ts";

    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "TypeScript File",
            accept: { "text/typescript": [".ts"] },
          },
          {
            description: "JavaScript File",
            accept: { "text/javascript": [".js"] },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      const fileName = fileHandle.name;
      this.tabs.set(activeId, { title: fileName, file: fileName, isDirty: false });
      
      const tabEl = document.querySelector(`[data-tab-id="${activeId}"].tab .tab-title`);
      if (tabEl) tabEl.textContent = fileName;
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error saving file:", err);
      }
    }
  }
  private setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (cmdOrCtrl && e.key === "r") {
        e.preventDefault();
        this.executeCode();
      } else if (cmdOrCtrl && e.key === "t") {
        e.preventDefault();
        this.newFile();
      } else if (cmdOrCtrl && e.key === ".") {
        e.preventDefault();
        this.stopExecution();
      }
    });
  }

  private getWelcomeCode() {
    return `// Welcome to GhoulJS! 💀
// A stripped-down, high-performance execution environment.

function ignite(target: string): string {
  return \`Compiling \${target}... System ready.\`;
}

const status = ignite("payload");
console.log(status);

// Code executes automatically upon valid AST completion.
const metrics = [1024, 2048, 4096];
const allocated = metrics.map(m => m * 2);
allocated`;
  }
}