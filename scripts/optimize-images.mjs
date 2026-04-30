/**
 * Resize and re-encode images under images/services/ (service-*.{png,jpg,jpeg}).
 * Writes paired .webp + .jpg next to originals for use with <picture>.
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SERVICES_DIR = path.join(root, "images", "services");

const MAX_WIDTH = 1200;
const WEBP_QUALITY = 82;
const JPEG_QUALITY = 82;

const INPUT_RE = /^service-.+\.(png|jpe?g)$/i;

async function main() {
  let entries;
  try {
    entries = await readdir(SERVICES_DIR);
  } catch (e) {
    console.error("Cannot read", SERVICES_DIR, e.message);
    process.exit(1);
  }

  const inputs = entries.filter((f) => INPUT_RE.test(f));
  if (inputs.length === 0) {
    console.log("No matching service-* images in", SERVICES_DIR);
    return;
  }

  for (const filename of inputs) {
    const inputPath = path.join(SERVICES_DIR, filename);
    const base = filename.replace(/\.(png|jpe?g)$/i, "");
    const outWebp = path.join(SERVICES_DIR, `${base}.webp`);
    const outJpeg = path.join(SERVICES_DIR, `${base}.jpg`);

    const resized = await sharp(inputPath)
      .rotate()
      .resize(MAX_WIDTH, null, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    await sharp(resized).webp({ quality: WEBP_QUALITY }).toFile(outWebp);
    await sharp(resized)
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outJpeg);

    const inSize = (await stat(inputPath)).size;
    console.log(`${filename} -> ${base}.webp, ${base}.jpg (${inSize} B in)`);
  }

  console.log("Done.");
}

main();
