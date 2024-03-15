// import createMiddleware from "next-intl/middleware";

// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: ["en", "de"],

//   // Used when no locale matches
//   defaultLocale: "en",
// });

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ["/", "/(de|en)/:path*"],
// };

import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { i18n } from "./i18n";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: i18n.locales,

  // Used when no locale matches
  defaultLocale: "en",
  localeDetection: false,
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/login",
    },
  }
);

const protectedPages = ["/dashboard"];

export default function middleware(req: NextRequest) {
  let isPageProtected = false;
  for (const protectedPage of protectedPages) {
    if (req.nextUrl.pathname.includes(protectedPage)) {
      isPageProtected = true;
      break;
    }
  }
  if (isPageProtected) {
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  // Skip paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
