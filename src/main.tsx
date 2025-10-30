import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@solana/wallet-adapter-react-ui/styles.css';

// Runtime safety for libraries expecting Node globals in browser
// These shims are harmless in modern browsers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).global = globalThis as unknown as typeof globalThis;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).process = (globalThis as any).process || { env: {} };

createRoot(document.getElementById("root")!).render(<App />);
