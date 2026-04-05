// // frontend2\src\app\api\revalidate\route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";

// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get("authorization");

//     // 1. Security check
//     if (!authHeader || authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 2. Read payload
//     const body = await req.json();
//     const { model, slug } = body;

//     // 3. Decide what to revalidate
//     switch (model) {
//       case "project":
//         revalidatePath("/projects");
//         if (slug) revalidatePath(`/projects/${slug}`);
//         break;

//       case "creation":
//         revalidatePath("/creations");
//         if (slug) revalidatePath(`/creations/${slug}`);
//         break;

//       case "setting":
//         revalidatePath("/");
//         break;

//       default:
//         revalidatePath("/");
//     }

//     // 4. Respond success
//     return NextResponse.json({ revalidated: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Revalidation failed" },
//       { status: 500 }
//     );
//   }
// }




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