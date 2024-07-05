import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const isLoggedIn = !!token;
      const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
      const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");

      // If the user is on the dashboard, check if they are logged in
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      // If the user is on the login page, allow access regardless of login status
      if (isOnLoginPage) return true;

      // For all other pages, allow access if logged in
      if (isLoggedIn) return true;

      return false; // Redirect unauthenticated users to login page
    },
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.png|login).*)"],
};
