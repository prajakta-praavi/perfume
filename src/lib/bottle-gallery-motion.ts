import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

/** Called synchronously within the owning route's matchMedia context. */
export function createBottleGalleryMotion(scope: HTMLElement, lenis?: Lenis, compact = false) {
  const gallery = scope.querySelector<HTMLElement>("[data-bottle-gallery]");
  if (!gallery) return () => {};
  const items = Array.from(gallery.querySelectorAll<HTMLElement>("[data-bottle-item]"));
  if (items.length < 2) return () => {};
  gallery.setAttribute("data-gallery-enhanced", "");
  let active = -1;
  const focusTimes = [0];
  const restTimes = [0.2];
  let refreshing = false;
  const selectAt = (time: number) => {
    let index = 0;
    focusTimes.forEach((focusTime, i) => {
      if (time >= focusTime) index = i;
    });
    publish(index);
  };
  const width = () => gallery.clientWidth;
  const spacing = compact ? 0.5 : 0.3;
  const publish = (index: number) => {
    if (active === index) return;
    active = index;
    gallery.setAttribute("data-active-bottle", String(index));
    gallery.dispatchEvent(new CustomEvent("bottle:change", { detail: index }));
  };
  publish(0);

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: gallery,
      start: "top top",
      end: () =>
        `+=${gallery.offsetHeight - (gallery.querySelector<HTMLElement>(".bottle-gallery-stage")?.offsetHeight ?? window.innerHeight)}`,
      scrub: compact ? 0.35 : 0.65,
      invalidateOnRefresh: true,
    },
  });

  items.forEach((item, index) => {
    // Function-based values recalculate horizontal travel when the viewport changes.
    const initial = {
      xPercent: -50,
      yPercent: -50,
      x: () => width() * index * spacing,
      y: index * 14,
      scale: Math.max(0.3, 1 - index * 0.24),
      rotationY: index === 0 ? 0 : compact ? -16 : -26,
      rotationZ: index * 3,
      opacity: Math.max(0, 1 - index * 0.3),
      filter: `blur(${!compact && index > 1 ? 2 : 0}px)`,
      zIndex: items.length - index,
      transformPerspective: 1200,
    };
    gsap.set(item, initial);
    timeline.set(item, initial, 0);
  });
  timeline.to({}, { duration: 0.4 });

  for (let index = 0; index < items.length - 1; index++) {
    const at = 0.4 + index * 1.55;
    focusTimes.push(at + 0.62);
    restTimes.push(at + 1.3);
    // Outgoing bottle crosses the foreground; incoming bottle moves out of depth.
    timeline.to(
      items[index]!,
      {
        x: () => -width() * (compact ? 0.85 : 0.65),
        y: compact ? -26 : -45,
        scale: compact ? 1.35 : 1.65,
        rotationY: compact ? -18 : -28,
        rotationZ: compact ? -8 : -12,
        opacity: 0,
        filter: compact ? "blur(0px)" : "blur(5px)",
        duration: 1.18,
        ease: "power2.inOut",
      },
      at,
    );
    for (let next = index + 1; next < items.length; next++) {
      const distance = next - index - 1;
      timeline.to(
        items[next]!,
        {
          x: () => width() * distance * spacing,
          y: distance * 14,
          scale: Math.max(0.3, 1 - distance * 0.24),
          rotationY: distance === 0 ? 0 : compact ? -16 : -26,
          rotationZ: distance * 3,
          opacity: Math.max(0, 1 - distance * 0.3),
          filter: `blur(${!compact && distance > 1 ? 2 : 0}px)`,
          duration: 1.18,
          ease: "power2.inOut",
        },
        at + 0.06,
      );
    }
    timeline.to({}, { duration: 0.31 }, at + 1.24);
  }
  timeline.eventCallback("onUpdate", () => {
    if (!refreshing) selectAt(timeline.time());
  });
  const onRefreshStart = () => {
    refreshing = true;
  };
  const onRefreshEnd = () => {
    refreshing = false;
    // Refresh rewinds animations with callbacks suppressed on restore.
    // Reconcile once all trigger geometry and scroll positions are restored.
    const trigger = timeline.scrollTrigger;
    if (trigger) selectAt(trigger.progress * timeline.duration());
  };
  ScrollTrigger.addEventListener("refreshInit", onRefreshStart);
  ScrollTrigger.addEventListener("refresh", onRefreshEnd);
  gsap.fromTo(
    gallery.querySelector("[data-gallery-light]"),
    { xPercent: -15 },
    {
      xPercent: 15,
      ease: "none",
      scrollTrigger: { trigger: gallery, start: "top top", end: "bottom bottom", scrub: 1 },
    },
  );

  const onNavigate = (event: Event) => {
    if (!(event instanceof CustomEvent) || !Number.isInteger(event.detail)) return;
    const time = restTimes[event.detail];
    const trigger = timeline.scrollTrigger;
    if (time === undefined || !trigger) return;
    const destination =
      trigger.start + (time / timeline.duration()) * (trigger.end - trigger.start);
    if (lenis) lenis.scrollTo(destination, { duration: 1.2 });
    else window.scrollTo({ top: destination, behavior: "smooth" });
  };
  gallery.addEventListener("bottle:navigate", onNavigate);

  return () => {
    ScrollTrigger.removeEventListener("refreshInit", onRefreshStart);
    ScrollTrigger.removeEventListener("refresh", onRefreshEnd);
    gallery.removeEventListener("bottle:navigate", onNavigate);
    gallery.removeAttribute("data-gallery-enhanced");
    gallery.removeAttribute("data-active-bottle");
    gallery.dispatchEvent(new CustomEvent("bottle:change", { detail: 0 }));
  };
}
