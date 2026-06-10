/**
 * Generate raster image assets for Suraag from SVG sources.
 *
 *   pnpm/npm run build:images
 *
 * Output (root of repo):
 *   og-image.png            1200x630   social previews
 *   apple-touch-icon.png     180x180   iOS home screen
 *   icon-192.png             192x192   Android / PWA
 *   icon-512.png             512x512   Android / PWA splash
 *   favicon-32.png            32x32    legacy browser tab
 *   favicon-16.png            16x16    legacy browser tab
 *   maskable-icon-512.png    512x512   PWA maskable
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const assets = resolve(root, "assets");

async function loadSvg(name) {
  return await readFile(resolve(assets, name));
}

async function render(svgBuffer, { width, height, out, background = { r: 8, g: 6, b: 17, alpha: 1 } }) {
  const pipeline = sharp(svgBuffer, { density: 384 }).resize({
    width,
    height,
    fit: "contain",
    background,
  });
  await pipeline.png({ compressionLevel: 9, palette: false }).toFile(resolve(root, out));
  console.log(`  wrote ${out}  (${width}x${height})`);
}

async function main() {
  console.log("Rendering image assets...");

  const og = await loadSvg("og-image.svg");
  await render(og, { width: 1200, height: 630, out: "og-image.png" });

  const fav = await loadSvg("favicon.svg");
  // copy SVG favicon to repo root so it can be served at /favicon.svg
  await writeFile(resolve(root, "favicon.svg"), fav);
  console.log("  wrote favicon.svg");
  await render(fav, { width: 16,  height: 16,  out: "favicon-16.png" });
  await render(fav, { width: 32,  height: 32,  out: "favicon-32.png" });
  await render(fav, { width: 180, height: 180, out: "apple-touch-icon.png" });
  await render(fav, { width: 192, height: 192, out: "icon-192.png" });
  await render(fav, { width: 512, height: 512, out: "icon-512.png" });

  // Maskable icon: pad inner glyph so it stays inside the 80% safe zone
  // when the platform crops it into a circle/rounded square.
  const maskable = await loadSvg("favicon.svg");
  const padded = await sharp(maskable, { density: 384 })
    .resize({ width: 410, height: 410, fit: "contain", background: { r: 21, g: 17, b: 46, alpha: 1 } })
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: { r: 21, g: 17, b: 46, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(resolve(root, "maskable-icon-512.png"), padded);
  console.log("  wrote maskable-icon-512.png  (512x512)");

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
