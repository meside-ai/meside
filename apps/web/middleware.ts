import { type NextRequest, NextResponse } from "next/server";
import { environment } from "./configs/environment";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/meside/server/")) {
    const destination = new URL(environment.SERVER_DOMAIN);
    const url = req.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.protocol = destination.protocol;
    return NextResponse.rewrite(url);
  }

  if (req.nextUrl.pathname.startsWith("/_next/static/")) {
    const destination = new URL(environment.ASSET_PREFIX ?? req.url);
    const url = req.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.protocol = destination.protocol;
    return NextResponse.rewrite(url);
  }
}
