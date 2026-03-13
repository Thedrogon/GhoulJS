import { SettingsStore } from "../services/SettingsStore";

export function mountSettingsUI(
  store: SettingsStore,
  onChange: () => void
) {
  const $ = (id: string) => document.getElementById(id)!;
  
  $("settingsBtn")?.addEventListener("click", () => $("settingsPanel")?.classList.add("open"));
  
  $("closeSettingsBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    $("settingsPanel")?.classList.remove("open");
  });
  
  $("settingsPanel")?.addEventListener("click", (e) => {
    if (e.target === $("settingsPanel")) $("settingsPanel")?.classList.remove("open");
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("settingsPanel")?.classList.contains("open")) {
      $("settingsPanel")?.classList.remove("open");
    }
  });

  const s = store.get();
  
  const theme = $("theme-select") as HTMLSelectElement;
  if(theme) {
      theme.value = s.theme;
      theme.onchange = () => {
        store.save({ theme: theme.value });
        onChange();
      };
  }

  const fs = $("font-size-input") as HTMLInputElement;
  if(fs) {
      fs.value = String(s.fontSize);
      fs.onchange = () => {
        const val = Math.min(32, Math.max(8, parseInt(fs.value, 10) || 14));
        fs.value = String(val);
        store.save({ fontSize: val });
        onChange();
      };
  }

  const wrap = $("word-wrap-toggle") as HTMLInputElement;
  if(wrap) {
      wrap.checked = s.wordWrap;
      wrap.onchange = () => {
        store.save({ wordWrap: wrap.checked });
        onChange();
      };
  }

  const mini = $("minimap-toggle") as HTMLInputElement;
  if(mini) {
      mini.checked = s.minimap;
      mini.onchange = () => {
        store.save({ minimap: mini.checked });
        onChange();
      };
  }

  const ln = $("line-numbers-toggle") as HTMLInputElement;
  if(ln) {
      ln.checked = s.lineNumbers;
      ln.onchange = () => {
        store.save({ lineNumbers: ln.checked });
        onChange();
      };
  }

  const tr = $("auto-run-toggle") as HTMLInputElement;
  if(tr) {
      tr.checked = s.autoRunEnabled;
      tr.onchange = () => {
        store.save({ autoRunEnabled: tr.checked });
      };
  }

  const tab = $("tab-size-select") as HTMLSelectElement;
  if(tab) {
      tab.value = String(s.tabSize);
      tab.onchange = () => {
        store.save({ tabSize: parseInt(tab.value, 10) });
        onChange();
      };
  }

  const ff = $("font-family-select") as HTMLSelectElement;
  if(ff) {
      ff.value = s.fontFamily;
      ff.onchange = () => {
        store.save({ fontFamily: ff.value });
        onChange();
      };
  }
}