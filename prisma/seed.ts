// prisma/seed.ts
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const results: any[] = [];
    const filePath = path.join(__dirname, "../src/seed_data/leetcode_problem.csv");

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                try {
                    results.push(parseRow(data));
                } catch (err) {
                    console.error("Error parsing row:", err);
                }
            })
            .on("end", () => resolve())
            .on("error", (err) => reject(err));
    });

    console.log(`Parsed ${results.length} questions. Inserting into DB...`);

    for (const question of results) {
        try {
            await prisma.dSAQuestion.create({ data: question });
        } catch (e) {
            console.error(`Failed to insert ${question.title}:`, e);
        }
    }

    console.log("🌱 Seeding complete!");
}

function parseRow(row: Record<string, string>) {
    return {
        title: row.title,
        description: row.description,
        is_premium: row.is_premium.toLowerCase() === "true",
        difficulty: row.difficulty,
        acceptance_rate: parseFloat(row.acceptance_rate) || null,
        url: row.url || null,
        companies: toArray(row.companies),
        related_topics: toArray(row.related_topics),
        asked_by_faang: row.asked_by_faang.toLowerCase() === "true",
        similar_questions: toArray(row.similar_questions),
    };
}

function toArray(input: string): string[] {
    if (!input) return [];
    return input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
