import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ThemeProvider lets the home page share its sunset/midnight mood with the
    // header and footer. Other routes leave it at the sunset default.
    <ThemeProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
