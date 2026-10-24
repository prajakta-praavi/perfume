export interface MistPlayhead {
  frame: number;
  spread: number;
}

/** Decode one atlas; render fractional frames only when the scrubbed timeline changes. */
export function createPerfumeMistRenderer(root: HTMLElement, mobile: boolean) {
  const jet = root.querySelector<HTMLCanvasElement>("[data-spray-jet]");
  const cover = root.querySelector<HTMLCanvasElement>("[data-spray-cover]");
  const stage = root.querySelector<HTMLElement>("[data-spray-scene]");
  const bottle = root.querySelector<HTMLElement>(".spray-product-anchor");
  const jetContext = jet?.getContext("2d");
  const coverContext = cover?.getContext("2d");
  const playhead: MistPlayhead = { frame: 0, spread: 0 };
  if (!jet || !cover || !stage || !bottle || !jetContext || !coverContext) {
    return { playhead, render: () => {}, destroy: () => {} };
  }

  const canvas = jet;
  const field = cover;
  const jetCtx = jetContext;
  const fieldCtx = coverContext;
  let disposed = false;
  let frameRequest = 0;
  let loaded = false;
  let pixelRatio = 1;
  let width = 1;
  let height = 1;
  let jetWidth = 1;
  let jetHeight = 1;
  let nozzleX = 0;
  let nozzleY = 0;
  const atlas = new Image();
  atlas.decoding = "async";
  const asset = root.getAttribute(mobile ? "data-mist-mobile" : "data-mist-desktop");

  const drawSample = (
    context: CanvasRenderingContext2D,
    frame: number,
    x: number,
    y: number,
    w: number,
    h: number,
    opacity = 1,
  ) => {
    const cellWidth = atlas.naturalWidth / 4;
    const cellHeight = atlas.naturalHeight / 4;
    const position = Math.max(0, Math.min(15, frame));
    const first = Math.floor(position);
    const fraction = position - first;
    const draw = (index: number, alpha: number) => {
      context.globalAlpha = alpha * opacity;
      context.drawImage(
        atlas,
        (index % 4) * cellWidth,
        Math.floor(index / 4) * cellHeight,
        cellWidth,
        cellHeight,
        x,
        y,
        w,
        h,
      );
    };
    draw(first, 1 - fraction);
    if (fraction > 0) draw(Math.min(15, first + 1), fraction);
    context.globalAlpha = 1;
  };

  const paint = () => {
    frameRequest = 0;
    if (disposed || !loaded) return;
    jetCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    fieldCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    jetCtx.clearRect(0, 0, jetWidth, jetHeight);
    fieldCtx.clearRect(0, 0, width, height);
    drawSample(jetCtx, playhead.frame, 0, 0, jetWidth, jetHeight);
    if (playhead.spread > 0) {
      const scale = 0.9 + playhead.spread * 5.6;
      const mistWidth = Math.max(width, height) * scale;
      const mistHeight = mistWidth / 1.5;
      const angles = mobile ? [-0.25, 2.8] : [-0.25, 1.1, 2.8];
      angles.forEach((angle, index) => {
        fieldCtx.save();
        fieldCtx.translate(nozzleX, nozzleY);
        fieldCtx.rotate(angle);
        drawSample(
          fieldCtx,
          Math.max(4, playhead.frame - index * 0.65),
          -mistWidth * 0.12,
          -mistHeight * 0.5,
          mistWidth,
          mistHeight,
          0.86 - index * 0.1,
        );
        fieldCtx.restore();
      });
    }
    root.setAttribute("data-mist-frame", String(Math.round(playhead.frame)));
  };
  const render = () => {
    if (!disposed && !frameRequest) frameRequest = requestAnimationFrame(paint);
  };
  const resize = () => {
    if (disposed) return;
    width = stage.clientWidth;
    height = stage.clientHeight;
    jetWidth = canvas.clientWidth;
    jetHeight = canvas.clientHeight;
    // Cap the full-screen backing store as well as DPR on large monitors.
    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      mobile ? 1 : 1.5,
      Math.sqrt(2_400_000 / Math.max(1, width * height)),
    );
    canvas.width = Math.max(1, Math.round(jetWidth * pixelRatio));
    canvas.height = Math.max(1, Math.round(jetHeight * pixelRatio));
    field.width = Math.max(1, Math.round(width * pixelRatio));
    field.height = Math.max(1, Math.round(height * pixelRatio));
    nozzleX = width * 0.5 + bottle.offsetWidth * (0.547 - 0.5);
    nozzleY = height * 0.5 + bottle.offsetHeight * (0.113 - 0.5) + 4;
    render();
  };
  atlas.onload = () => {
    if (disposed) return;
    loaded = true;
    root.setAttribute("data-mist-status", "ready");
    resize();
  };
  atlas.onerror = () => {
    if (!disposed) root.setAttribute("data-mist-status", "unavailable");
  };
  if (asset) atlas.src = asset;
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  resize();

  return {
    playhead,
    render,
    destroy: () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frameRequest);
      atlas.onload = null;
      atlas.onerror = null;
      // Release decoded textures and canvas backing stores on navigation/preferences.
      atlas.src = "";
      canvas.width = canvas.height = field.width = field.height = 1;
      root.removeAttribute("data-mist-status");
      root.removeAttribute("data-mist-frame");
    },
  };
}
