import { NextResponse } from "next/server";
import { Client } from "pg";

export const dynamic = "force-dynamic";

export async function GET() {
  const pgClient = new Client({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5416,
    user: process.env.DB_USER || "educorekh_user",
    password: process.env.DB_PASSWORD || "qwer",
    database: process.env.DB_NAME || "educorekh",
  });

  try {
    await pgClient.connect();
    const result = await pgClient.query(
      `SELECT id, name, status, start_date as "startDate", end_date as "endDate" 
       FROM academic_years 
       WHERE status = 'ACTIVE' 
       ORDER BY start_date DESC`
    );

    let rows = result.rows;

    if (rows.length === 0) {
      const allRes = await pgClient.query(
        `SELECT id, name, status, start_date as "startDate", end_date as "endDate" 
         FROM academic_years 
         ORDER BY start_date DESC LIMIT 5`
      );
      rows = allRes.rows;
    }

    if (rows.length > 0) {
      return NextResponse.json({ content: rows });
    }
  } catch (dbErr) {
    console.warn("Public academic years DB query failed, using fallback:", dbErr);
  } finally {
    await pgClient.end().catch(() => {});
  }

  // Fallback to active academic year
  return NextResponse.json({
    content: [
      {
        id: "5a988873-9f38-46cf-88ee-e1dba7941d45",
        name: "Academic Year 2025-2026",
        startDate: "2025-09-01",
        endDate: "2026-06-30",
        status: "ACTIVE",
      },
    ],
  });
}
