import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { canPerform } from "./permissions/hasPermission";
import { Action, Permissions, Subject } from "./permissions/permission.types";

async function verify(
  token: string,
  secret: string,
): Promise<{ userId: string; accessPerms: Permissions[] }> {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(secret),
    {},
  );

  return payload as { userId: string; accessPerms: Permissions[] };
}

const getSubjectUsingPathname = (pathname: string) => {
  if (pathname.startsWith("/dashboard/estates")) {
    return Subject.ESTATES;
  }

  if (pathname.startsWith("/dashboard/users")) {
    return Subject.USERS;
  }

  if (pathname.startsWith("/dashboard/categories")) {
    return Subject.CATEGORIES;
  }

  if (pathname.startsWith("/dashboard/sessions")) {
    return Subject.SESSIONS;
  }

  if (pathname.startsWith("/dashboard/landings")) {
    return Subject.LANDINGS;
  }
};

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/static") ||
    req.nextUrl.pathname.startsWith("/public") ||
    req.nextUrl.pathname.startsWith("/images") ||
    req.nextUrl.pathname.startsWith("/favicon") ||
    req.nextUrl.pathname.startsWith("/svg")
  ) {
    return NextResponse.next();
  }

  try {
    const token = req.cookies.get("refreshToken")?.value;

    if (!token) {
      if (
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/user-panel")
      ) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      return NextResponse.next();
    }

    // console.log(token, process.env.REFRESH_TOKEN_PRIVATE_KEY, "| token");

    const payload = await verify(
      token,
      process.env.REFRESH_TOKEN_PRIVATE_KEY || "",
    );

    // console.log(payload, "| payload");

    if (req.nextUrl.pathname.startsWith("/auth/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      payload.accessPerms.includes(Permissions.SUPER_USER) ||
      payload.accessPerms.includes(Permissions.OWNER)
    ) {
      return NextResponse.next();
    }

    // DASHBOARD
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (payload.accessPerms.includes(Permissions.USER)) {
        return NextResponse.redirect(new URL("/user-panel", req.url));
      } else {
        const subject = getSubjectUsingPathname(req.nextUrl.pathname);

        if (!subject) {
          return NextResponse.next();
        }
        if (!canPerform(subject, Action.READ, payload.accessPerms)) {
          return NextResponse.rewrite(new URL("/403", req.url));
        }
      }
    }

    return NextResponse.next();
  } catch {
    await req.cookies.delete("refreshToken");
    await req.cookies.delete("accessToken");

    if (
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/user-panel")
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
