import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createBottleGalleryMotion } from "@/lib/bottle-gallery-motion";
import { createPerfumeSprayMotion } from "@/lib/perfume-spray-motion";

/** All transforms belong to this route's matchMedia context, never to global killAll(). */
export function createCinematicMotion(scope: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let disposed = false;
  let refreshFrame = 0;
  const refresh = () => {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
  };

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 767px)",
      desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
      pin: "(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine)",
    },
    (context) => {
      if (!context.conditions?.["motion"]) return;
      const desktop = Boolean(context.conditions["desktop"]);
      const select = gsap.utils.selector(scope);
      const reveals: { element: HTMLElement; tween: gsap.core.Tween }[] = [];

      // Native window scrolling keeps router restoration, keyboard scrolling and sticky media intact.
      const lenis = desktop
        ? new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: true })
        : undefined;
      const tick = (seconds: number) => lenis?.raf(seconds * 1000);
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
      }
      const cleanupGallery = createBottleGalleryMotion(scope, lenis, !desktop);
      const cleanupSpray = createPerfumeSprayMotion(scope, Boolean(context.conditions["mobile"]));

      // Reserve the pin's travel in CSS before first paint; no runtime spacer growth.
      const showcase = scope.querySelector<HTMLElement>(".cinematic-showcase");
      const stage = showcase?.querySelector<HTMLElement>("[data-showcase-stage]");
      if (context.conditions["pin"] && showcase && stage) {
        const image = stage.querySelector("[data-showcase-image]");
        const mediaFrame = stage.querySelector<HTMLElement>("[data-showcase-media]");
        // On short screens pin only the bottle, leaving longer copy free to scroll.
        const pinTarget = stage.offsetHeight > window.innerHeight - 48 ? mediaFrame : stage;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: stage,
              start: "center center",
              end: () => `+=${window.innerHeight * 0.6}`,
              pin: pinTarget ?? stage,
              pinSpacing: false,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            image,
            { scale: 1.18, yPercent: 3, rotation: -8 },
            { scale: 1, yPercent: 0, rotation: 5, duration: 1.4, ease: "none" },
          )
          .fromTo(
            stage.querySelectorAll("dl > div"),
            { y: 28, opacity: 0.35, rotationX: -25, transformPerspective: 700 },
            { y: 0, opacity: 1, rotationX: 0, stagger: 0.22, duration: 0.7, ease: "power2.out" },
            0.15,
          );
      }

      // Separate entrance and scroll layers so their transforms never compete.
      const hero = scope.querySelector<HTMLElement>('[data-scroll-section="hero"]');
      let entrance: gsap.core.Timeline | undefined;
      if (hero && hero.getBoundingClientRect().bottom > 0) {
        entrance = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(select("[data-hero-image]"), { scale: 1.2, duration: desktop ? 2.4 : 1.4 }, 0)
          .from(
            select("[data-hero-bottle]"),
            {
              y: desktop ? 90 : 30,
              rotate: desktop ? -9 : -3,
              scale: 0.86,
              opacity: 0,
              duration: 1.6,
              clearProps: "transform,opacity",
            },
            0.1,
          )
          .from(select("[data-hero-line]"), { yPercent: 105, duration: 1.2, stagger: 0.16 }, 0.12)
          .from(
            select("[data-hero-reveal]"),
            {
              y: desktop ? 22 : 12,
              opacity: 0,
              duration: 0.85,
              stagger: 0.12,
              clearProps: "transform,opacity",
            },
            0.35,
          );
        if (desktop) {
          gsap.to(select("[data-hero-bottle-float]"), {
            y: -12,
            rotation: -1.5,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: hero,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          });
          gsap.to(select("[data-hero-bottle-depth]"), {
            yPercent: -28,
            rotate: 7,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.9 },
          });
          gsap.to(select("[data-hero-depth]"), {
            yPercent: 22,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
          });
          gsap.to(select("[data-hero-atmosphere]"), {
            yPercent: -10,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 },
          });
          gsap.to(select("[data-hero-content]"), {
            yPercent: -16,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
          });
        }
      }

      const reveal = (element: HTMLElement, index = 0) => {
        // Never hide content above a restored scroll position.
        if (element.getBoundingClientRect().bottom < 0) return;
        const tween = gsap.from(element, {
          y: desktop ? 64 : 22,
          opacity: 0,
          duration: desktop ? 1.15 : 0.75,
          delay: desktop ? (index % 4) * 0.13 : 0,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
        reveals.push({ element, tween });
      };

      // Text stays semantic and selectable; no character splitting or DOM replacement.
      select("section .eyebrow, section h1, section h2, section .lede, section blockquote").forEach(
        (element: HTMLElement) => {
          if (
            element.closest(
              '[data-scroll-section="hero"], [data-scroll-section="fragrance-card"], [data-scroll-section="ingredient"], [data-bottle-gallery], [data-perfume-spray]',
            )
          )
            return;
          reveal(element);
        },
      );
      select('[data-scroll-section="fragrance-card"], [data-scroll-section="ingredient"]').forEach(
        reveal,
      );

      // Editorial image transitions use a clipped outer frame and a dedicated inner layer.
      select("[data-image-reveal]").forEach((element: HTMLElement) => {
        if (element.getBoundingClientRect().bottom < 0) return;
        const tween = gsap.from(element, {
          opacity: 0,
          y: desktop ? 24 : 12,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
        reveals.push({ element, tween });
      });

      if (desktop) {
        select("[data-card-image-layer]").forEach((layer: HTMLElement) => {
          gsap.fromTo(
            layer,
            { scale: 1.16 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: layer.parentElement,
                start: "top bottom",
                end: "center center",
                scrub: 0.7,
              },
            },
          );
        });
        select("[data-parallax-frame]").forEach((frame: HTMLElement) => {
          const layer = frame.querySelector("[data-parallax-layer]");
          if (!layer) return;
          gsap.fromTo(
            layer,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });
      }

      // Tabbing into an unrevealed link must make it visible immediately.
      const onFocus = (event: FocusEvent) => {
        if (!(event.target instanceof Node)) return;
        const target = event.target;
        if (hero?.contains(target)) entrance?.totalProgress(1);
        reveals.forEach(({ element, tween }) => {
          if (element.contains(target) || target.contains(element)) tween.totalProgress(1);
        });
      };
      scope.addEventListener("focusin", onFocus);
      refresh();
      return () => {
        cleanupGallery();
        cleanupSpray();
        scope.removeEventListener("focusin", onFocus);
        gsap.ticker.remove(tick);
        lenis?.off("scroll", ScrollTrigger.update);
        lenis?.destroy();
      };
    },
    scope,
  );

  // Font metrics and lazy media can settle after hydration. Coalesce refreshes.
  const images = Array.from(scope.querySelectorAll("img"));
  images.forEach((image) => image.addEventListener("load", refresh));
  void document.fonts?.ready.then(() => {
    if (!disposed) refresh();
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    images.forEach((image) => image.removeEventListener("load", refresh));
    media.revert();
  };
}
