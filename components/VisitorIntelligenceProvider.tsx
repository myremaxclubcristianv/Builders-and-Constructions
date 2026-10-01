"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { flushSessionSummary, trackHighValueActivity, trackPageView } from "@/lib/visitor-tracker";

export function VisitorIntelligenceProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialMount = useRef(false);

  // 1. Automatic Route Navigation & Pageview Tracking
  useEffect(() => {
    if (!pathname) return;

    // Small delay to ensure document title is updated by Next.js
    const timer = setTimeout(() => {
      trackPageView(pathname, searchParams ? searchParams.toString() : "");
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // 2. High-Value Action Detection & Global CTA Listener
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("a, button, [data-analytics-cta]") as HTMLElement | null;
      if (!clickable) return;

      const ctaAttr = clickable.getAttribute("data-analytics-cta");
      const href = clickable.getAttribute("href") || "";
      const text = (clickable.innerText || clickable.textContent || "").trim();

      if (ctaAttr) {
        trackHighValueActivity("CTA Interaction", ctaAttr);
        return;
      }

      if (
        href.includes("/research-request") ||
        href.includes("/work-with-us") ||
        href.includes("/promote") ||
        href.includes("/claim")
      ) {
        trackHighValueActivity("Commercial CTA Clicked", `Destination: ${href} (${text.slice(0, 50)})`);
      } else if (
        /^(REQUEST RESEARCH|CLAIM PROFILE|WORK WITH US|CONTACT DEVELOPER|CONSULTATION|START DOSSIER)/i.test(text)
      ) {
        trackHighValueActivity("High-Intent Button Clicked", text.slice(0, 60));
      }
    };

    window.addEventListener("click", handleGlobalClick, { passive: true });
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // 3. Unload / Visibility Flush for Session Summary
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushSessionSummary();
      }
    };

    const handlePageHide = () => {
      flushSessionSummary();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}
