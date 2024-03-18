import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (session === null) {
    return NextResponse.json({}, { status: 401 });
  }
  const token = await getToken({ req });
  console.log(token);
  return NextResponse.json({});
}
