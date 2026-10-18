import { NextResponse } from "next/server";
import { Client } from "pg";

const SPRING_BOOT_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, sex, role } = body;

    // 1. Call Spring Boot to create user with BCrypt hashing and email validation
    const springResponse = await fetch(`${SPRING_BOOT_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        sex,
      }),
    });

    if (!springResponse.ok) {
      let errorData;
      try {
        errorData = await springResponse.json();
      } catch {
        errorData = { message: "Spring Boot registration failed" };
      }
      return NextResponse.json(errorData, { status: springResponse.status });
    }

    const createdUser = await springResponse.json();

    // 2. Security check: strictly block public/unauthenticated requests from assigning ADMIN or PRINCIPAL
    let targetRole = role;
    if (targetRole === "ADMIN" || targetRole === "PRINCIPAL") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        targetRole = "STUDENT";
      } else {
        try {
          const meRes = await fetch(`${SPRING_BOOT_URL}/auth/me`, {
            headers: { Authorization: authHeader },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.role !== "ADMIN") {
              targetRole = "STUDENT";
            }
          } else {
            targetRole = "STUDENT";
          }
        } catch {
          targetRole = "STUDENT";
        }
      }
    }

    // 3. If a custom role was selected (e.g. TEACHER, STAFF, PARENT), update in PostgreSQL
    if (targetRole && targetRole !== "STUDENT" && createdUser.id) {
      const pgClient = new Client({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5416,
        user: process.env.DB_USER || "educorekh_user",
        password: process.env.DB_PASSWORD || "qwer",
        database: process.env.DB_NAME || "educorekh",
      });

      try {
        await pgClient.connect();
        await pgClient.query("UPDATE users SET role = $1 WHERE id = $2", [
          targetRole,
          createdUser.id,
        ]);
        createdUser.role = targetRole;
      } catch (dbErr) {
        console.error("Failed to update user role in PostgreSQL:", dbErr);
      } finally {
        await pgClient.end().catch(() => {});
      }
    }

    return NextResponse.json(createdUser, { status: 201 });
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { message: err?.message || "Internal server error during registration" },
      { status: 500 }
    );
  }
}
