import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
    const q = `SELECT site, username, password, id FROM credentials WHERE email=$1 ORDER BY site`;
    const data = await request.json();
    const res = await query(q, [data.email]);
    return NextResponse.json(res.rows);
}