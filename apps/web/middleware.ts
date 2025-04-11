import { type NextRequest, NextResponse } from "next/server";
import { environment } from "./configs/environment";

export function middleware(req: NextRequest) {
  console.log(req.nextUrl.pathname);
  if (req.nextUrl.pathname.startsWith("/meside/")) {
    console.log("rewrite");
    const destination = new URL(environment.SERVER_DOMAIN);
    const url = req.nextUrl.clone();
    url.host = destination.host;
    url.port = destination.port;
    url.protocol = destination.protocol;
    return NextResponse.rewrite(url);
  }
}
