import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPerfumeMistRenderer } from "@/lib/perfume-mist-renderer";

/** One reversible master timeline, collected by the route's GSAP media context. */
export function createPerfumeSprayMotion(scope: HTMLElement, mobile: boolean) {
  const root = scope.querySelector<HTMLElement>("[data-perfume-spray]");
  const scene = root?.querySelector<HTMLElement>("[data-spray-scene]");
  if (!root || !scene) return () => {};
  root.setAttribute("data-spray-enhanced", "");
  const select = gsap.utils.selector(root);
  const mist = createPerfumeMistRenderer(root, mobile);
  const flowers = Array.from(root.querySelectorAll<HTMLElement>("[data-spray-botanical]")).filter(
    (node) => getComputedStyle(node).display !== "none",
  );
  const phases = ["entrance", "spray", "mist", "botanicals", "reveal"];
  const thresholds = [0, 0.2, 0.35, 0.55, 0.8];
  let previousPhase = -1;
  let refreshing = false;
  let disposed = false;
  const publish = (progress: number) => {
    let index = 0;
    thresholds.forEach((threshold, i) => {
      if (progress >= threshold) index = i;
    });
    if (index === previousPhase) return;
    previousPhase = index;
    root.setAttribute("data-spray-phase", phases[index]!);
    const step = root.querySelector("[data-spray-step]");
    if (step) step.textContent = `0${index + 1} / 05`;
  };
  publish(0);

  gsap.set(
    select("[data-spray-forest], [data-spray-reveal], [data-spray-cover], [data-spray-jet]"),
    { opacity: 0 },
  );
  gsap.set(select("[data-spray-dark], [data-spray-intro]"), { opacity: 1 });
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "sylva-perfume-spray",
      trigger: root,
      pin: scene,
      pinSpacing: false,
      start: "top top",
      end: () => `+=${Math.max(1, root.offsetHeight - scene.offsetHeight)}`,
      scrub: mobile ? 0.25 : 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .fromTo(
      select("[data-spray-bottle]"),
      {
        x: () => (mobile ? 0 : scene.clientWidth * 0.24),
        y: 65,
        scale: 0.78,
        rotation: -5,
        opacity: 0,
      },
      { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 20, ease: "power2.out" },
      0,
    )
    .to(
      select("[data-spray-cap]"),
      { yPercent: -22, rotation: -7, opacity: 0, duration: 8, ease: "power2.inOut" },
      12,
    )
    .to(
      select("[data-spray-nozzle], [data-spray-emitter-press]"),
      { y: 4, duration: 3, ease: "power2.inOut" },
      20,
    )
    .to(
      select("[data-spray-nozzle], [data-spray-emitter-press]"),
      { y: 0, duration: 4, ease: "power2.inOut" },
      31,
    )
    .to(select("[data-spray-jet]"), { opacity: 1, duration: 3 }, 22)
    .to(mist.playhead, { frame: 15, duration: 31 }, 22)
    .to(select("[data-spray-jet]"), { opacity: 0, duration: 8 }, 37)
    .to(select("[data-spray-cover]"), { opacity: 1, duration: 12 }, 35)
    .to(mist.playhead, { spread: 1, duration: 20 }, 35)
    .to(select("[data-spray-bottle]"), { opacity: 0, scale: 0.95, duration: 13 }, 42)
    .to(select("[data-spray-intro]"), { opacity: 0, duration: 8 }, 32)
    .to(select("[data-spray-forest]"), { opacity: 1, duration: 20 }, 43)
    .to(select("[data-spray-dark]"), { opacity: 0, duration: 16 }, 47)
    .to(select("[data-spray-cover]"), { opacity: 0, duration: 20 }, 55)
    .fromTo(select("[data-spray-forest]"), { scale: 1.1 }, { scale: 1, duration: 45 }, 55)
    .fromTo(
      select("[data-spray-reveal]"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 15, ease: "power2.out" },
      80,
    )
    .fromTo(select("[data-spray-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 100 }, 0);

  flowers.forEach((flower, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const start = 55 + (index % 6) * 1.7;
    timeline
      .fromTo(
        flower,
        {
          opacity: 0,
          x: direction * 35,
          y: mobile ? 75 : 140,
          scale: 0.65,
          rotation: direction * -22,
        },
        {
          opacity: index % 3 === 0 ? 0.95 : 0.7,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 12,
          ease: "power2.out",
        },
        start,
      )
      .to(
        flower,
        {
          y: mobile ? -32 : -80,
          x: direction * 24,
          rotation: direction * 25,
          scale: index % 3 === 0 ? 1.1 : 0.92,
          duration: 100 - start - 12,
        },
        start + 12,
      );
  });
  timeline.eventCallback("onUpdate", () => {
    if (disposed) return;
    if (!refreshing) publish(timeline.progress());
    mist.render();
  });
  const beginRefresh = () => {
    refreshing = true;
  };
  const endRefresh = () => {
    refreshing = false;
    publish(timeline.scrollTrigger?.progress ?? 0);
    mist.render();
  };
  ScrollTrigger.addEventListener("refreshInit", beginRefresh);
  ScrollTrigger.addEventListener("refresh", endRefresh);

  return () => {
    disposed = true;
    ScrollTrigger.removeEventListener("refreshInit", beginRefresh);
    ScrollTrigger.removeEventListener("refresh", endRefresh);
    mist.destroy();
    root.removeAttribute("data-spray-enhanced");
    root.removeAttribute("data-spray-phase");
    const step = root.querySelector("[data-spray-step]");
    if (step) step.textContent = "01 / 05";
  };
}
