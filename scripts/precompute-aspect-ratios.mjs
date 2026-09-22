/**
 * Precomputes the aspect ratio (width / height) of every media item listed
 * in public/data/content.xlsx and writes it back into the sheet as a new
 * "aspectRatio" column.
 *
 * Why: the app used to have to fully load each image (and each video's
 * first frame) at runtime just to read its pixel dimensions. Baking the
 * ratio into the source data means the scene can lay out every sprite at
 * the correct size immediately, without waiting on any media to download.
 *
 * Run whenever content.xlsx or the underlying images/videos change:
 *   npm run precompute-aspect
 */
import XLSX from "xlsx";
import { imageSize } from "image-size";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("public/data");
const XLSX_PATH = path.join(DATA_DIR, "content.xlsx");

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "webp", "PNG", "JPG", "JPEG", "WEBP"]);
const VIDEO_EXT = new Set(["mp4", "webm", "mov", "MP4", "WEBM", "MOV"]);

function round(n) {
    return Math.round(n * 10000) / 10000;
}

function getImageAspect(filePath) {
    const { width, height } = imageSize(readFileSync(filePath));
    return width / height;
}

function getVideoAspect(filePath) {
    const out = execFileSync("ffprobe", [
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height",
        "-of", "csv=s=x:p=0",
        filePath,
    ]).toString().trim();
    const [w, h] = out.split("x").map(Number);
    if (!w || !h) throw new Error(`ffprobe returned no dimensions for ${filePath}`);
    return w / h;
}

function main() {
    if (!existsSync(XLSX_PATH)) {
        console.error(`Could not find ${XLSX_PATH}`);
        process.exit(1);
    }

    const wb = XLSX.readFile(XLSX_PATH);
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];

    // Drop genuinely blank header cells (Excel sometimes leaves trailing
    // formatted-but-empty columns). Round-tripping those through
    // json_to_sheet as literal `undefined`/"" header names previously
    // wrote them back out as junk "undefined" columns in the saved file —
    // never keep them.
    const headerRow = XLSX.utils
        .sheet_to_json(sheet, { header: 1, range: 0, blankrows: false })[0]
        .filter((h) => h != null && String(h).trim() !== "");

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    let updated = 0;
    let skipped = 0;
    const problems = [];

    for (const row of rows) {
        const { folder, image, extension } = row;
        if (!folder || !image || !extension) {
            skipped++;
            continue;
        }

        const filePath = path.join(DATA_DIR, folder, `${image}.${extension}`);
        if (!existsSync(filePath)) {
            problems.push(`Missing file, could not compute aspect ratio: ${filePath}`);
            skipped++;
            continue;
        }

        try {
            if (IMAGE_EXT.has(extension)) {
                row.aspectRatio = round(getImageAspect(filePath));
                updated++;
            } else if (VIDEO_EXT.has(extension)) {
                row.aspectRatio = round(getVideoAspect(filePath));
                updated++;
            } else {
                skipped++;
            }
        } catch (err) {
            problems.push(`Failed on ${filePath}: ${err.message}`);
            skipped++;
        }
    }

    const newHeaders = headerRow.includes("aspectRatio")
        ? headerRow
        : [...headerRow, "aspectRatio"];

    const newSheet = XLSX.utils.json_to_sheet(rows, { header: newHeaders });
    wb.Sheets[sheetName] = newSheet;
    XLSX.writeFile(wb, XLSX_PATH);

    console.log(`\nWrote aspect ratios into ${path.relative(process.cwd(), XLSX_PATH)}`);
    console.log(`  updated: ${updated}, skipped: ${skipped}`);
    if (problems.length) {
        console.log("\nIssues:");
        problems.forEach((p) => console.log("  - " + p));
    }
}

main();
