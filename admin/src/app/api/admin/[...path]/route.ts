// admin\src\app\api\admin\[...path]\route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  const { path } = await context.params;
  const cleanPath = path.join("/");

  const url = `${BASE_URL}${cleanPath}/`.replace(/\/{2,}/g, "/");

  console.log(`Proxy ${method} path="${cleanPath}" → ${url}`);

  const headers: HeadersInit = {};
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!["host", "connection", "keep-alive", "transfer-encoding", "content-length"].includes(lowerKey)) {
      headers[key] = value;
    }
  });

  let body: BodyInit | null = null;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      body = await req.clone().text();
    } catch (e) {
      console.error("Failed to read body:", e);
    }
  }

  const backendRes = await fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
    redirect: "manual",
  });

  const resBody = await backendRes.text();

  const response = new NextResponse(resBody, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  let cookieCount = 0;
  backendRes.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "set-cookie") {
      response.headers.append("set-cookie", value);
      cookieCount++;
    } else if (!["content-encoding", "transfer-encoding"].includes(lowerKey)) {
      response.headers.set(key, value);
    }
  });

  console.log(`Backend ${method} ${backendRes.status} | Cookies forwarded: ${cookieCount}`);

  return response;
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context, "GET");
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context, "POST");
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context, "PUT");
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context, "PATCH");
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context, "DELETE");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}