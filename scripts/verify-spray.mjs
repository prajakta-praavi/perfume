import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge" });
const url = process.env.APP_URL || "http://127.0.0.1:8080";
const errors = [];
await mkdir("artifacts/motion", { recursive: true });

async function open(options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      document.querySelector("[data-spray-enhanced]")?.getAttribute("data-mist-status") === "ready",
  );
  const root = page.locator("[data-perfume-spray]");
  const bounds = await root.evaluate((node) => ({
    top: node.getBoundingClientRect().top + scrollY,
    travel: node.offsetHeight - node.querySelector("[data-spray-scene]").offsetHeight,
  }));
  const at = async (progress) => {
    await page.evaluate((top) => scrollTo(0, top), bounds.top + bounds.travel * progress);
    await page.waitForTimeout(950);
  };
  return { context, page, root, bounds, at };
}

try {
  const desktop = await open({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const { page, root, at } = desktop;
  assert(
    await root.evaluate(
      (node) =>
        node.previousElementSibling?.getAttribute("data-scroll-section") === "hero" &&
        node.nextElementSibling?.getAttribute("data-scroll-section") === "featured",
    ),
    "Experience sits between the hero and featured fragrances without collection banners",
  );
  await at(0.14);
  assert.equal(await root.getAttribute("data-spray-phase"), "entrance");
  await page.screenshot({ path: "artifacts/motion/spray-entrance.png" });
  await at(0.27);
  assert.equal(await root.getAttribute("data-spray-phase"), "spray");
  const spray = await root.evaluate((node) => {
    const nozzle = node.querySelector("[data-spray-nozzle]");
    const jet = node.querySelector("[data-spray-jet]");
    const nozzleBox = nozzle.getBoundingClientRect();
    const jetBox = jet.getBoundingClientRect();
    const context = jet.getContext("2d");
    const data = context.getImageData(0, 0, jet.width, jet.height).data;
    let alpha = 0;
    for (let i = 3; i < data.length; i += 4) alpha += data[i];
    return {
      alpha,
      nozzleTransform: getComputedStyle(nozzle).transform,
      originError: Math.hypot(
        jetBox.left + jetBox.width * 0.12 - (nozzleBox.left + nozzleBox.width * 0.547),
        jetBox.top + jetBox.height * 0.5 - (nozzleBox.top + nozzleBox.height * 0.113),
      ),
      oldBottleOffscreen:
        document.querySelector("[data-hero-bottle]").getBoundingClientRect().bottom < 0,
    };
  });
  assert(spray.alpha > 0, "Frame renderer draws genuine transparent mist imagery");
  assert(spray.originError < 3, `Mist source meets pressed nozzle (${spray.originError}px)`);
  assert(spray.oldBottleOffscreen, "No duplicate hero bottle is visible");
  const wheelStart = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1300);
  assert(
    await page.evaluate((start) => scrollY > start, wheelStart),
    "Native wheel input advances the scrubbed scene",
  );
  await at(0.27);
  await page.screenshot({ path: "artifacts/motion/spray-nozzle.png" });
  const pressedFrame = Number(await root.getAttribute("data-mist-frame"));
  await at(0.46);
  assert.equal(await root.getAttribute("data-spray-phase"), "mist");
  assert(
    Number(
      await root.locator("[data-spray-cover]").evaluate((node) => getComputedStyle(node).opacity),
    ) > 0.8,
  );
  await page.screenshot({ path: "artifacts/motion/spray-full-mist.png" });
  await at(0.72);
  assert.equal(await root.getAttribute("data-spray-phase"), "botanicals");
  assert(
    await root
      .locator("[data-spray-botanical]")
      .evaluateAll((nodes) => nodes.some((node) => Number(getComputedStyle(node).opacity) > 0.5)),
  );
  await page.screenshot({ path: "artifacts/motion/spray-flowers.png" });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await page.waitForTimeout(500);
  assert.equal(
    await root.getAttribute("data-spray-phase"),
    "botanicals",
    "Refresh retains the correct stage",
  );
  await at(0.97);
  assert.equal(await root.getAttribute("data-spray-phase"), "reveal");
  assert(
    Number(
      await root.locator("[data-spray-reveal]").evaluate((node) => getComputedStyle(node).opacity),
    ) > 0.99,
  );
  await page.screenshot({ path: "artifacts/motion/spray-botanical-reveal.png" });
  await at(0.27);
  assert.equal(
    Number(await root.getAttribute("data-mist-frame")),
    pressedFrame,
    "Reverse scrolling restores the same mist frame",
  );
  await at(0.1);
  assert.equal(await root.getAttribute("data-spray-phase"), "entrance");
  await at(0.97);
  await root.getByRole("link", { name: /Continue to the collections/ }).click();
  await page.waitForTimeout(1500);
  assert(
    await page
      .locator("#chapters")
      .evaluate((node) => Math.abs(node.getBoundingClientRect().top) < 10),
    "Skip link releases the pin into the existing chapter section",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(await page.locator("[data-spray-enhanced]").count(), 0);
  assert.equal(await root.locator(".pin-spacer").count(), 0);
  assert.equal(
    await root.locator("[data-spray-jet]").evaluate((node) => node.width),
    1,
    "Preference change releases canvas memory",
  );
  assert.equal(
    await root.locator("[data-spray-reveal]").evaluate((node) => getComputedStyle(node).opacity),
    "1",
  );
  await page.locator('[data-scroll-section="hero"] a[href="/story"]').click();
  await page.waitForURL("**/story");
  assert.equal(
    await page.locator("[data-perfume-spray], .pin-spacer").count(),
    0,
    "Route unmount removes the entire scene and its pin",
  );
  await desktop.context.close();

  const mobile = await open({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
    deviceScaleFactor: 2,
  });
  await mobile.at(0.27);
  const touchStart = await mobile.page.evaluate(() => scrollY);
  const touch = await mobile.context.newCDPSession(mobile.page);
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 195, y: 650 }],
  });
  for (let step = 1; step <= 8; step++) {
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 195, y: 650 - step * 35 }],
    });
    await mobile.page.waitForTimeout(20);
  }
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await mobile.page.waitForTimeout(600);
  assert(
    await mobile.page.evaluate((start) => scrollY > start, touchStart),
    "Real touch gesture advances the scene without scroll locking",
  );
  await touch.detach();
  await mobile.at(0.72);
  assert.equal(
    await mobile.root
      .locator("[data-spray-botanical]")
      .evaluateAll(
        (nodes) => nodes.filter((node) => getComputedStyle(node).display !== "none").length,
      ),
    6,
  );
  assert(
    await mobile.root.locator("[data-spray-cover]").evaluate((node) => node.width <= 390),
    "Mobile mist caps backing resolution",
  );
  assert.equal(await mobile.page.locator("html.lenis").count(), 0);
  assert(await mobile.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await mobile.page.screenshot({ path: "artifacts/motion/spray-mobile.png" });
  await mobile.at(0.97);
  await mobile.root.getByRole("link", { name: /Continue to the collections/ }).click();
  await mobile.page.waitForTimeout(300);
  assert(
    await mobile.page
      .locator("#chapters")
      .evaluate((node) => Math.abs(node.getBoundingClientRect().top) < 10),
  );
  await mobile.context.close();
  const tablet = await open({
    viewport: { width: 820, height: 1180 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  await tablet.at(0.97);
  assert.equal(await tablet.root.getAttribute("data-spray-phase"), "reveal");
  assert.equal(
    await tablet.page.locator("html.lenis").count(),
    0,
    "Tablet keeps native touch scrolling",
  );
  assert(await tablet.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await tablet.page.screenshot({ path: "artifacts/motion/spray-tablet.png" });
  await tablet.context.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: exact placement; five scrubbed stages; pressed-nozzle origin; rendered mist; flowers; reverse frames; refresh; clean pin release; reduced motion; mobile resolution and touch-native scrolling; no browser errors.",
  );
} finally {
  await browser.close();
}
