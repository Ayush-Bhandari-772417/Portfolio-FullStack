// frontend2\src\app\api\revalidate\route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    // ✅ Security check
    if (authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Read payload
    const body = await req.json();
    const { paths = [], tags = [] } = body;

    // 🔥 PATH-BASED
    paths.forEach((path: string) => {
      try {
        revalidatePath(path);
      } catch (e) {
        console.error("Path error:", path, e);
      }
    });

    // 🔥 TAG-BASED
    tags.forEach((tag: string) => {
      try {
        revalidateTag(tag, "default");
      } catch (e) {
        console.error("Tag error:", tag, e);
      }
    });
    
    return NextResponse.json({
      success: true,
      paths,
      tags,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}