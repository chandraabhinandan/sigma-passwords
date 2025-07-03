import { NextResponse } from "next/server";
import { query } from "@/lib/db";

 
// export async function HEAD(request) {}
 
export async function POST(request) {
    let data = await request.json();
    console.log(data);
    const q = `INSERT INTO credentials (email, site, username, password, id) values($1, $2, $3, $4, $5)`;
    await query(q, [data.email, data.site, data.username, data.password, data.id]);
    return new NextResponse(null, { status: 204 });
}
 
// export async function PUT(request) {}
 
export async function DELETE(request) {
    let data = await request.json();
    await query(`DELETE FROM credentials WHERE id = $1`, [data.id]);
    return new NextResponse(null, { status: 204 });
}
 
// export async function PATCH(request) {}
 
// export async function OPTIONS(request) {}