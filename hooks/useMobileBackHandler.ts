import { useEffect, useRef } from "react";

interface UseMobileBackHandlerOptions {
  active: boolean;
  onBack: () => void;
}

/**
 * Custom hook to handle Mobile Physical/Gesture Back Button for in-page states
 * (such as modals, drawers, image viewers, and folder views).
 * Pushes a temporary browser history entry when `active` becomes true,
 * and intercepts `popstate` to execute `onBack` instead of exiting the mobile webview app.
 */
export function useMobileBackHandler({ active, onBack }: UseMobileBackHandlerOptions) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;

    const stateId = "modal_" + Math.random().toString(36).substring(2, 9);
    try {
      window.history.pushState({ modalId: stateId }, "");
    } catch (err) {
      console.error("Error pushing history state for back handler:", err);
    }

    const handlePopState = () => {
      onBackRef.current();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [active]);
}
