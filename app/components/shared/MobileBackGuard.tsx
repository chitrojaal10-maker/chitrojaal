"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MobileBackGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initial history stack buffer so mobile webview wrapper doesn't exit immediately on first back
    if (typeof window !== "undefined") {
      try {
        if (window.history.length <= 1) {
          window.history.pushState({ appInit: true }, "");
        }
      } catch (err) {
        console.error("MobileBackGuard history init error:", err);
      }
    }

    // 2. Intercept Cordova/Capacitor/Android Webview native backbutton event
    const handleNativeBackButton = (e: Event) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.back();
      }
    };

    document.addEventListener("backbutton", handleNativeBackButton);

    return () => {
      document.removeEventListener("backbutton", handleNativeBackButton);
    };
  }, [pathname, router]);

  return null;
}
