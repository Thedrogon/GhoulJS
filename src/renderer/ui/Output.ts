type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'object' | 'function' | 'symbol' | 'bigint';

interface OutputItem {
  text: string;
  type: ValueType;
}

function getValueType(val: any): ValueType {
  if (val === null) return 'null';
  if (typeof val === 'function') return 'function';
  return typeof val;
}

function safeStringify(obj: any, indent = 2): string {
  let cache: any[] = [];
  const retVal = JSON.stringify(
    obj,
    (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (value instanceof Map) return `Map(${value.size}) { ... }`;
        if (value instanceof Set) return `Set(${value.size}) { ... }`;
        if (cache.includes(value)) return '[Circular Reference]';
        cache.push(value);
      }
      return value;
    },
    indent
  );
  cache = [];
  return retVal || String(obj);
}

function stringifyWithType(val: any): OutputItem {
  const type = getValueType(val);
  let text: string;
  
  switch (type) {
    case 'null': text = 'null'; break;
    case 'undefined': text = 'undefined'; break;
    case 'string': text = `'${val}'`; break;
    case 'boolean': text = String(val); break;
    case 'number': text = String(val); break;
    case 'function': text = '[Function]'; break;
    case 'symbol': text = String(val); break;
    case 'bigint': text = `${val}n`; break;
    case 'object':
      try { text = safeStringify(val); } 
      catch { text = String(val); }
      break;
    default: text = String(val);
  }
  
  return { text, type };
}

//const lineOutputs = new Map<string, Map<number, OutputItem[]>>();
//let lastResultLine = new Map<string, number>();

export function appendOutput(tabId: string, type: string, args: any[]) {
  const container = document.querySelector(`[data-tab-id="${tabId}"].output-container`) as HTMLElement | null;
  if (!container) return;

  if (type === "error") {
    renderError(container, args[0]);
    scrollToBottom(container);
    return;
  }

  let lineNo: number | undefined;
  let realArgs = args;

  if (typeof args[0] === "number") {
    lineNo = args[0];
    realArgs = args.slice(1);
  }

  const row = document.createElement("div");
  row.className = "output-line-sequential";

  // Create Line Badge if available
  if (lineNo !== undefined) {
    const badge = document.createElement("span");
    badge.className = "output-line-badge";
    badge.textContent = `L${lineNo}`;
    row.appendChild(badge);
  }

  const content = document.createElement("div");
  content.className = "output-content";

  realArgs.forEach((arg, idx) => {
    if (idx > 0) content.appendChild(document.createTextNode("  "));
    const item = stringifyWithType(arg);
    const span = document.createElement("span");
    span.className = `output-${item.type}`;
    span.textContent = item.text;
    content.appendChild(span);
  });

  row.appendChild(content);
  container.appendChild(row);
  scrollToBottom(container);
}

function renderError(container: HTMLElement, errorMsg: string) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "output-error-container";
  
  const parts = String(errorMsg).split('\n\n');
  const mainMessage = parts[0] || errorMsg;
  const codeFrame = parts.slice(1).join('\n\n');
  
  const msgDiv = document.createElement("div");
  msgDiv.className = "output-error";
  msgDiv.textContent = mainMessage;
  errorDiv.appendChild(msgDiv);
  
  if (codeFrame) {
    const frameDiv = document.createElement("pre");
    frameDiv.className = "output-error-frame";
    frameDiv.textContent = codeFrame;
    errorDiv.appendChild(frameDiv);
  }
  
  container.appendChild(errorDiv);
}

export function clearOutput(tabId: string) {
  const c = document.querySelector(`[data-tab-id="${tabId}"].output-container`) as HTMLElement | null;
  if (c) c.innerHTML = "";
}

export const appendSecurity = (tabId: string, msg: string) => {
  const c = document.querySelector(`[data-tab-id="${tabId}"].output-container`) as HTMLElement | null;
  if (!c) return;
  const line = document.createElement("div");
  line.className = "output-security-error";
  line.textContent = `🛡️ [Security] ${msg}`;
  c.appendChild(line);
  scrollToBottom(c);
};

function scrollToBottom(container: HTMLElement) {
  container.scrollTop = container.scrollHeight;
}