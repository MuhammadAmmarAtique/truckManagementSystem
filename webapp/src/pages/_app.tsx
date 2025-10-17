// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/graphql/config/apollo-client";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CustomThemeProvider } from "@/contexts/ThemeContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import HomeNavbar from "@/components/vehicles/HomeNavbar";
import { inter } from "@/theme/theme";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { JobsProvider } from "@/contexts/JobsContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CustomThemeProvider>
            <SnackbarProvider>
              <JobsProvider>
                <CssBaseline />
                <main className={inter.className}>
                  {isHome && <HomeNavbar />}
                  <Component {...pageProps} />
                </main>
              </JobsProvider>
            </SnackbarProvider>
          </CustomThemeProvider>
        </LocalizationProvider>
      </ApolloProvider>
    </UserProvider>
  );
}
