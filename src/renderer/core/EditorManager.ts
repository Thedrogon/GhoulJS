import * as monaco from "monaco-editor";
import { AppSettings, TabId } from "../config/types";

export type OnContentChange = (tabId: TabId) => void;

export class EditorManager {
  private editors = new Map<TabId, monaco.editor.IStandaloneCodeEditor>();
  private onContentChange: OnContentChange | null = null;

  constructor(private getSettings: () => AppSettings) {}

  setOnContentChange(cb: OnContentChange) {
    this.onContentChange = cb;
  }

  create(tabId: TabId, initialValue: string) {
    const el = document.querySelector(
      `[data-tab-id="${tabId}"].editor-container`
    ) as HTMLElement | null;
    if (!el) return;
    const s = this.getSettings();
    const editor = monaco.editor.create(el, {
      value: initialValue,
      language: "typescript",
      theme: s.theme, // This will now point to 'ghoul-dark' or 'paladin-light' from your settings
      fontSize: s.fontSize,
      fontFamily: s.fontFamily,
      lineHeight: 24,
      minimap: { enabled: s.minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: s.tabSize,
      insertSpaces: true,
      wordWrap: s.wordWrap ? "on" : "off",
      lineNumbers: s.lineNumbers ? "on" : "off",
      renderWhitespace: "selection",
      mouseWheelZoom: true,
      cursorBlinking: "blink",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: "always",
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      hover: { enabled: true },
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on",
      tabCompletion: "on",
      wordBasedSuggestions: "currentDocument",
      parameterHints: { enabled: true },
      autoClosingBrackets: "languageDefined",
      autoClosingQuotes: "languageDefined",
      autoSurround: "languageDefined",
    });
    this.editors.set(tabId, editor);
    
    if (this.onContentChange) {
      const cb = this.onContentChange;
      editor.onDidChangeModelContent(() => cb(tabId));
    }
    
    return editor;
  }

  get(tabId: TabId) {
    return this.editors.get(tabId) || null;
  }
  
  forEach(cb: (e: monaco.editor.IStandaloneCodeEditor) => void) {
    this.editors.forEach(cb);
  }
  
  dispose(tabId: TabId) {
    const editor = this.editors.get(tabId);
    if (editor) {
      // FIX: Dispose of the model to prevent RAM leaks when tabs are closed
      editor.getModel()?.dispose(); 
      editor.dispose();
      this.editors.delete(tabId);
    }
  }
}