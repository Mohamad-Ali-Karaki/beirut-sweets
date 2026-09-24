import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";

// Mechanical web exports only. Originals are preserved for future replacement.
const dir = "public/images";
for (const name of await readdir(dir)) {
  if (!/\.(jpg|png)$/.test(name) || name === "menu-collection.png") continue;
  const width = name.startsWith("beirut-sweets-hero") ? 1200 : 640;
  await sharp(`${dir}/${name}`)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${dir}/${name.replace(/\.(jpg|png)$/, ".webp")}`);
}
const atlas = `${dir}/menu-collection.png`;
const { width, height } = await sharp(atlas).metadata();
for (const [index, name] of [
  [0, "fruit-pieces"],
  [6, "kashta-fruit"],
]) {
  const left = Math.round(((index % 4) * width) / 4);
  const top = Math.round((Math.floor(index / 4) * height) / 2);
  const right = Math.round((((index % 4) + 1) * width) / 4);
  const bottom = Math.round(((Math.floor(index / 4) + 1) * height) / 2);
  await sharp(atlas)
    .extract({ left, top, width: right - left, height: bottom - top })
    .webp({ quality: 82 })
    .toFile(`${dir}/${name}.webp`);
}
execFileSync(
  ffmpeg,
  [
    "-y",
    "-i",
    "public/video/crepe-intro.mp4",
    "-t",
    "4",
    "-an",
    "-vf",
    "scale=960:-2",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "27",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "public/video/crepe-intro-short.mp4",
  ],
  { stdio: "ignore" },
);
execFileSync(
  ffmpeg,
  [
    "-y",
    "-ss",
    "1",
    "-i",
    "public/video/crepe-intro-short.mp4",
    "-frames:v",
    "1",
    "public/images/crepe-intro-poster.webp",
  ],
  { stdio: "ignore" },
);
console.log("Optimized WebP images and four-second silent intro ready.");
