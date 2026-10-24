// Run with @playwright/test installed and Edge available: node scripts/verify-motion.mjs
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  headless: true,
});
const baseURL = process.env.APP_URL || "http://127.0.0.1:8080";
await mkdir("artifacts/motion", { recursive: true });
const errors = [];

async function open(options = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__motionLayoutShift = 0;
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (!entry.hadRecentInput) window.__motionLayoutShift += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  assert(
    await page.evaluate(() => window.__motionLayoutShift < 0.01),
    "Entrance causes no significant layout shift",
  );
  return { context, page };
}

async function checkWidth(page) {
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    "No horizontal overflow",
  );
}

try {
  const { context, page } = await open({ viewport: { width: 1440, height: 1000 } });
  const alphaResults = await page.evaluate(async () => {
    const sources = [
      ...new Set(
        Array.from(document.querySelectorAll('[data-scroll-section="fragrance-card"] img')).map(
          (node) => node.src,
        ),
      ),
    ];
    return Promise.all(
      sources.map(async (src) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return {
          transparentCorner: ctx.getImageData(0, 0, 1, 1).data[3] === 0,
          width: image.naturalWidth,
          height: image.naturalHeight,
        };
      }),
    );
  });
  assert.equal(alphaResults.length, 4, "Four distinct dummy product assets");
  assert(
    alphaResults.every(
      (result) => result.transparentCorner && result.width === 640 && result.height === 960,
    ),
    "Optimized bottles retain genuine transparency",
  );
  assert(
    await page.locator("html").evaluate((node) => node.classList.contains("lenis")),
    "Desktop Lenis active",
  );
  assert.equal(
    await page.locator(".cinematic-showcase .pin-spacer").count(),
    1,
    "One signature pin",
  );
  assert.equal(
    await page.locator("[data-perfume-spray] .pin-spacer").count(),
    1,
    "One spray scene pin",
  );
  await checkWidth(page);
  await page.screenshot({ path: "artifacts/motion/desktop-hero.png" });

  const stage = page.locator("[data-showcase-stage]");
  const stageTop = await stage.evaluate((node) => node.getBoundingClientRect().top + scrollY);
  const stageHeight = await stage.evaluate((node) => node.getBoundingClientRect().height);
  const pinStart = stageTop - (1000 - stageHeight) / 2;
  await page.evaluate((y) => window.scrollTo(0, y), pinStart + 80);
  await page.waitForTimeout(1200);
  const before = await stage.evaluate((node) => node.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollBy(0, 150));
  await page.waitForTimeout(1200);
  const after = await stage.evaluate((node) => node.getBoundingClientRect().top);
  assert(Math.abs(before - after) < 3, "Showcase stays pinned during scroll");
  await page.screenshot({ path: "artifacts/motion/desktop-showcase.png" });

  // A live preference change must remove smooth scrolling, pins and hidden content.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  assert.equal(await page.locator(".pin-spacer").count(), 0);
  assert.equal(await page.locator("html.lenis").count(), 0);
  assert.equal(
    await page
      .locator('[data-scroll-section="fragrance-card"]')
      .first()
      .evaluate((node) => getComputedStyle(node).opacity),
    "1",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(300);
  assert.equal(await page.locator(".cinematic-showcase .pin-spacer").count(), 1);

  await page.setViewportSize({ width: 768, height: 900 });
  await page.waitForTimeout(300);
  assert.equal(
    await page.locator(".cinematic-showcase .pin-spacer, html.lenis").count(),
    0,
    "Resize removes desktop motion",
  );
  await checkWidth(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.waitForTimeout(300);
  assert.equal(
    await page.locator(".cinematic-showcase .pin-spacer").count(),
    1,
    "Resize restores exactly one signature pin",
  );

  // Repeat SPA navigation to detect accumulating pins and stale animations.
  for (let i = 0; i < 2; i++) {
    await page.locator('[data-scroll-section="hero"] a[href="/story"]').click();
    await page.waitForURL("**/story");
    assert.equal(await page.locator(".pin-spacer").count(), 0);
    await page.locator('a[href="/"]').last().click();
    await page.waitForURL(baseURL + "/");
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".cinematic-showcase .pin-spacer").count(), 1);
  }
  await page.locator('[data-scroll-section="hero"] a[href="/collections"]').click();
  await page.waitForURL("**/collections");
  await page.locator('[data-scroll-section="fragrance-card"]').first().click();
  await page.waitForURL("**/fragrances/*");
  const firstProduct = page.url();
  await page.getByRole("button", { name: /ml/ }).last().click();
  assert.equal(
    await page.getByRole("button", { name: /ml/ }).last().getAttribute("aria-pressed"),
    "true",
  );
  await page.locator('[data-scroll-section="fragrance-card"]').first().click();
  await page.waitForURL((url) => url.href !== firstProduct);
  assert.equal(await page.locator('[data-scroll-section="product-hero"] h1').count(), 1);
  await page.goBack();
  await page.waitForURL(firstProduct);
  await page.waitForTimeout(300);
  await checkWidth(page);
  await context.close();

  const laptop = await open({ viewport: { width: 1366, height: 768 } });
  assert.equal(
    await laptop.page.locator(".cinematic-showcase .pin-spacer").count(),
    1,
    "Normal laptop receives the showcase pin",
  );
  const card = laptop.page.locator('[data-scroll-section="fragrance-card"]').first();
  const cardTop = await card.evaluate((node) => node.getBoundingClientRect().top + scrollY);
  await laptop.page.evaluate((y) => scrollTo(0, y), cardTop - 768 * 0.97);
  await laptop.page.waitForTimeout(500);
  assert.equal(
    await card.evaluate((node) => getComputedStyle(node).opacity),
    "0",
    "Card starts concealed below reveal threshold",
  );
  await laptop.page.evaluate(() => scrollBy(0, 180));
  await laptop.page.waitForTimeout(250);
  const midReveal = await card.evaluate((node) => Number(getComputedStyle(node).opacity));
  assert(midReveal > 0 && midReveal < 1, "Card visibly animates while entering the viewport");
  await laptop.page.waitForTimeout(1500);
  assert.equal(await card.evaluate((node) => getComputedStyle(node).opacity), "1");
  await laptop.page.evaluate(() => scrollBy(0, -220));
  await laptop.page.waitForTimeout(1500);
  assert.equal(
    await card.evaluate((node) => getComputedStyle(node).opacity),
    "0",
    "Reveal resets for another scroll pass",
  );
  await laptop.context.close();

  const mobile = await open({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  assert.equal(await mobile.page.locator(".cinematic-showcase .pin-spacer").count(), 0);
  assert.equal(await mobile.page.locator("[data-perfume-spray] .pin-spacer").count(), 1);
  assert.equal(await mobile.page.locator("html.lenis").count(), 0);
  await checkWidth(mobile.page);
  await mobile.page.screenshot({ path: "artifacts/motion/mobile-hero.png" });
  await mobile.page
    .locator('[data-scroll-section="fragrance-card"]')
    .first()
    .scrollIntoViewIfNeeded();
  await mobile.page.waitForTimeout(900);
  assert.equal(
    await mobile.page
      .locator('[data-scroll-section="fragrance-card"]')
      .first()
      .evaluate((node) => getComputedStyle(node).opacity),
    "1",
  );
  await mobile.context.close();

  const reduced = await open({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  assert.equal(await reduced.page.locator(".pin-spacer, html.lenis").count(), 0);
  assert.equal(
    await reduced.page
      .locator("[data-hero-line]")
      .first()
      .evaluate((node) => getComputedStyle(node).transform),
    "none",
  );
  await reduced.page.screenshot({ path: "artifacts/motion/reduced-motion.png" });
  await reduced.context.close();
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log(
    "PASS: desktop pin, mobile native scrolling, reduced motion, live preference changes, repeated route cleanup, product navigation and size selection; no runtime errors.",
  );
} finally {
  await browser.close();
}
