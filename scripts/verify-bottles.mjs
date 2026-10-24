import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge" });
const url = process.env.APP_URL || "http://127.0.0.1:8080";
const errors = [];
await mkdir("artifacts/motion", { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  const gallery = page.locator("[data-bottle-gallery]");
  await gallery.waitFor({ state: "attached" });
  await page.waitForFunction(() => document.querySelector("[data-gallery-enhanced]"));
  const bounds = await gallery.evaluate((node) => ({
    top: node.getBoundingClientRect().top + scrollY,
    travel: node.offsetHeight - innerHeight,
  }));
  const at = async (progress) => {
    await page.evaluate((y) => scrollTo(0, y), bounds.top + bounds.travel * progress);
    await page.waitForTimeout(1100);
  };
  await at(0);
  assert.equal(await gallery.getAttribute("data-active-bottle"), "0");
  const second = page.locator("[data-bottle-item]").nth(1);
  const distantWidth = await second.evaluate((node) => node.getBoundingClientRect().width);
  const stageTop = await page
    .locator(".bottle-gallery-stage")
    .evaluate((node) => node.getBoundingClientRect().top);
  await page.screenshot({ path: "artifacts/motion/bottles-vetiver.png" });
  await at(0.15);
  const fading = await page
    .locator("[data-bottle-item]")
    .first()
    .evaluate((node) => ({
      opacity: Number(getComputedStyle(node).opacity),
      filter: getComputedStyle(node).filter,
    }));
  assert(
    fading.opacity > 0 && fading.opacity < 1,
    "Outgoing bottle fades through an intermediate state",
  );
  assert.notEqual(fading.filter, "blur(0px)", "Foreground bottle gains depth blur");
  await page.screenshot({ path: "artifacts/motion/bottles-transition.png" });
  for (const [index, progress, name] of [
    [1, 0.34, "Cedar & Smoke"],
    [2, 0.65, "Sage Reverie"],
    [3, 0.96, "Jasmine & Fern"],
  ]) {
    await at(progress);
    assert.equal(await gallery.getAttribute("data-active-bottle"), String(index));
    assert.equal(await page.locator(".bottle-gallery-caption h3").textContent(), name);
    assert.equal(
      await page.getByRole("button", { name: `Show ${name}` }).getAttribute("aria-pressed"),
      "true",
    );
    const currentTop = await page
      .locator(".bottle-gallery-stage")
      .evaluate((node) => node.getBoundingClientRect().top);
    assert(Math.abs(currentTop - stageTop) < 2, "Gallery stays pinned across bottle transitions");
    if (index === 1)
      assert(
        (await second.evaluate((node) => node.getBoundingClientRect().width)) > distantWidth * 1.1,
        "Incoming bottle grows out of depth",
      );
    if (index === 2) {
      await page.evaluate(() => window.dispatchEvent(new Event("resize")));
      await page.waitForTimeout(700);
      assert.equal(
        await gallery.getAttribute("data-active-bottle"),
        "2",
        "Geometry refresh preserves bottle-caption synchronization",
      );
    }
    await page.screenshot({ path: `artifacts/motion/bottles-${index}.png` });
  }
  await at(0);
  assert.equal(
    await gallery.getAttribute("data-active-bottle"),
    "0",
    "Reverse scroll restores the first bottle",
  );
  await page.getByRole("button", { name: "Show Sage Reverie" }).click();
  await page.waitForTimeout(2200);
  assert.equal(
    await gallery.getAttribute("data-active-bottle"),
    "2",
    "Accessible controls navigate the scroll sequence",
  );
  await page.locator(".bottle-gallery-caption a").click();
  await page.waitForURL("**/fragrances/sage-reverie");
  assert.equal(await page.locator("[data-gallery-enhanced]").count(), 0);
  await page.goBack();
  await page.waitForURL(url + "/");
  await page.waitForTimeout(700);
  assert.equal(
    await page.locator("[data-gallery-enhanced]").count(),
    1,
    "Navigation restores one gallery instance",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(await page.locator("[data-gallery-enhanced]").count(), 0);
  assert.equal(
    await page.locator(".bottle-gallery-static-caption a:visible").count(),
    4,
    "Reduced motion exposes all product links",
  );
  await context.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const phone = await mobile.newPage();
  phone.on("pageerror", (error) => errors.push(error.message));
  await phone.goto(url, { waitUntil: "networkidle" });
  await phone.locator("[data-bottle-gallery]").scrollIntoViewIfNeeded();
  assert.equal(await phone.locator("[data-gallery-enhanced]").count(), 0);
  await phone
    .locator(".bottle-gallery-items")
    .evaluate((node) => node.scrollTo({ left: node.clientWidth }));
  await phone.waitForTimeout(300);
  assert(
    await phone.locator(".bottle-gallery-items").evaluate((node) => node.scrollLeft > 0),
    "Mobile rail supports native horizontal scrolling",
  );
  assert(
    await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    "No mobile page overflow",
  );
  await phone.screenshot({ path: "artifacts/motion/bottles-mobile.png" });
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: four bottle depth transitions, growing foreground, blur, pinning, reverse scroll, keyboard-accessible controls, product links, route cleanup, reduced motion and mobile swipe rail.",
  );
} finally {
  await browser.close();
}
