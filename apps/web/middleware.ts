import { type NextRequest, NextResponse } from "next/server";
import { environment } from "./configs/environment";

export function middleware(req: NextRequest) {
  // Define conditions to decide which requests to proxy
  if (req.nextUrl.pathname.startsWith("/meside/server/")) {
    // Create URL for the destination (your proxy target)
    const destination = new URL(environment.SERVER_DOMAIN);

    // Clone the request URL and modify it
    const url = req.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.protocol = destination.protocol;

    // Keep the original path or modify as needed
    // url.pathname = req.nextUrl.pathname;

    // Rewrite the request to the new URL
    return NextResponse.rewrite(url);
  }
}

// Optional: Define matcher to specify which paths this middleware applies to
export const config = {
  matcher: "/meside/server/:path*",
};
