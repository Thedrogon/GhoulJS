export function mountToolbar(
  onRun: () => void,
  onClear: () => void,
  onStop?: () => void
) {
  document.getElementById("runBtn")?.addEventListener("click", onRun);
  document.getElementById("stopBtn")?.addEventListener("click", () => onStop?.());
  document.getElementById("clearBtn")?.addEventListener("click", onClear);
  
  // Note: Ensure the HTML IDs for 'newBtn', 'openBtn', and 'saveBtn' 
  // are actually removed from your index.html.
}