import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetsRoot = path.resolve(root, "public", "assets");
const targets = [
  { file: "public/assets/gallery/cameroon-1.jpg", width: 1400, height: 1400, format: "jpeg" },
  { file: "public/assets/gallery/cameroon-2.jpg", width: 1400, height: 1400, format: "jpeg" },
  { file: "public/assets/gallery/cameroon-3.jpg", width: 1600, height: 1200, format: "jpeg" },
  { file: "public/assets/partners/MINEPDED.png", width: 512, height: 512, format: "png" },
  { file: "public/assets/partners/MINRESI.png", width: 512, height: 512, format: "png" },
  { file: "public/assets/partners/PAD.png", width: 512, height: 512, format: "png" },
  { file: "public/assets/partners/PAK.png", width: 512, height: 512, format: "png" },
];

for (const target of targets) {
  const input = path.join(root, target.file);
  const temporary = `${input}.optimized.${target.format === "jpeg" ? "jpg" : "png"}`;
  const backup = `${input}.original`;
  if (!path.resolve(input).startsWith(`${assetsRoot}${path.sep}`)) {
    throw new Error(`Refusing to modify a file outside public/assets: ${input}`);
  }
  fs.rmSync(temporary, { force: true });
  if (fs.existsSync(backup)) throw new Error(`Backup already exists and requires review: ${backup}`);
  const originalSize = fs.statSync(input).size;
  let pipeline = sharp(input)
    .rotate()
    .resize({ width: target.width, height: target.height, fit: "inside", withoutEnlargement: true });

  pipeline = target.format === "jpeg"
    ? pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true })
    : pipeline.png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 });

  await pipeline.toFile(temporary);
  const optimizedSize = fs.statSync(temporary).size;
  if (optimizedSize < originalSize) {
    fs.renameSync(input, backup);
    try {
      fs.renameSync(temporary, input);
      fs.rmSync(backup);
    } catch (error) {
      if (!fs.existsSync(input) && fs.existsSync(backup)) fs.renameSync(backup, input);
      throw error;
    }
    console.log(`${target.file}: ${Math.round(originalSize / 1024)} KB -> ${Math.round(optimizedSize / 1024)} KB`);
  } else {
    console.log(`${target.file}: retained original (${Math.round(originalSize / 1024)} KB)`);
  }
  fs.rmSync(temporary, { force: true });
}
