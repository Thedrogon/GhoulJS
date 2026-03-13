import * as monaco from "monaco-editor";

export function registerThemes() {
  monaco.editor.defineTheme("ghoul-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "regexp", foreground: "50fa7b" },
      { token: "operator", foreground: "ff79c6" },
      { token: "namespace", foreground: "8be9fd" },
      { token: "type", foreground: "8be9fd" },
      { token: "class", foreground: "8be9fd" },
      { token: "function", foreground: "50fa7b" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#44475a",
      "editorCursor.foreground": "#f8f8f0",
      "editor.lineHighlightBackground": "#44475a55",
    },
  });

  monaco.editor.defineTheme("paladin-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "a0a1a7", fontStyle: "italic" },
      { token: "keyword", foreground: "a626a4" },
      { token: "string", foreground: "50a14f" },
      { token: "number", foreground: "986801" },
      { token: "type", foreground: "c18401" },
      { token: "class", foreground: "c18401" },
      { token: "function", foreground: "4078f2" },
    ],
    colors: {
      "editor.background": "#fafafa",
      "editor.foreground": "#383a42",
      "editor.selectionBackground": "#e5e5e6",
      "editor.lineHighlightBackground": "#f0f0f1",
    },
  });
}