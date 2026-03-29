"use client";

import { useEffect } from "react";

export function TrySoroVideoFix() {
  useEffect(() => {
    const findHeroVideo = () => {
      const videos = [...document.querySelectorAll<HTMLVideoElement>(".trysoro-root video")];
      return (
        videos.find((video) => {
          const src = video.currentSrc || video.src || "";
          return src.includes("hero.webm");
        }) ?? null
      );
    };

    const heroVideo = findHeroVideo();

    if (!heroVideo) return;

    heroVideo.defaultMuted = true;
    heroVideo.muted = true;
    heroVideo.volume = 0;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute("webkit-playsinline", "true");
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("preload", "auto");

    const tryPlay = () => {
      void heroVideo.play().catch(() => {
        // ignore autoplay block; retry on user gestures/visibility changes
      });
    };

    heroVideo.load();
    heroVideo.addEventListener("loadeddata", tryPlay);
    heroVideo.addEventListener("canplay", tryPlay);
    heroVideo.addEventListener("canplaythrough", tryPlay);

    const onUserGesture = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointerdown", onUserGesture, { passive: true });
    window.addEventListener("touchstart", onUserGesture, { passive: true });
    window.addEventListener("keydown", onUserGesture);

    const retryTimer = window.setInterval(() => {
      if (heroVideo.paused) {
        tryPlay();
      } else {
        window.clearInterval(retryTimer);
      }
    }, 1200);

    tryPlay();

    return () => {
      window.clearInterval(retryTimer);
      heroVideo.removeEventListener("loadeddata", tryPlay);
      heroVideo.removeEventListener("canplay", tryPlay);
      heroVideo.removeEventListener("canplaythrough", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
    };
  }, []);

  return null;
}
