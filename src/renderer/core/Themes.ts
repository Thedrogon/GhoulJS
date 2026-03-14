import * as monaco from "monaco-editor";

export function registerThemes() {
  monaco.editor.defineTheme("ghoul-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "string", foreground: "CE9178" },
      { token: "keyword", foreground: "569CD6" },
      { token: "number", foreground: "B5CEA8" },
      { token: "type", foreground: "4EC9B0" },
      { token: "class", foreground: "4EC9B0" },
      { token: "function", foreground: "DCDCAA" },
      { token: "variable", foreground: "9CDCFE" },
      { token: "operator", foreground: "D4D4D4" },
    ],
    colors: {
      "editor.background": "#1E1E1E",
      "editor.foreground": "#D4D4D4",
      "editor.selectionBackground": "#264F78",
      "editor.lineHighlightBackground": "#FFFFFF0A",
      "editorCursor.foreground": "#AEAFAD",
      "editorWhitespace.foreground": "#e3e4e229",
      "editorIndentGuide.background": "#404040",
      "editorIndentGuide.activeBackground": "#707070",
    },
  });

  monaco.editor.defineTheme("paladin-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "008000" },
      { token: "string", foreground: "A31515" },
      { token: "keyword", foreground: "0000FF" },
      { token: "number", foreground: "098658" },
      { token: "type", foreground: "267F99" },
      { token: "class", foreground: "267F99" },
      { token: "function", foreground: "795E26" },
      { token: "variable", foreground: "001080" },
    ],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#000000",
      "editor.selectionBackground": "#ADD6FF",
      "editor.lineHighlightBackground": "#0000000A",
      "editorCursor.foreground": "#000000",
      "editorIndentGuide.background": "#D3D3D3",
      "editorIndentGuide.activeBackground": "#939393",
    },
  });
}