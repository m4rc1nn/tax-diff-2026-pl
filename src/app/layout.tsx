import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kalkulator składki zdrowotnej",
    description: "Porównaj składkę zdrowotną teraz i w 2026 roku",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
            <body className={inter.className}>
                <main className="min-h-screen bg-background">
                    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-purple-700/5 to-purple-500/10">
                        <header className="tax-calculator-gradient py-4 shadow-md">
                            <div className="container mx-auto px-4">
                                <h1 className="text-white text-2xl font-bold">
                                    <span className="gold-text">Kalkulator</span> Składki Zdrowotnej
                                </h1>
                                <p className="text-white/80 text-sm">
                                    Porównaj zmiany w składkach zdrowotnych teraz i w 2026 roku
                                </p>
                            </div>
                        </header>

                        <main className="container mx-auto py-8">
                            {children}
                        </main>

                        <footer className="tax-calculator-gradient py-4 mt-auto text-white/70">
                            <div className="container mx-auto px-4 text-center text-sm">
                                <p>
                                    Aplikacja ma charakter informacyjny, prezentowane informacje mogą zawierać błędy.
                                </p>
                            </div>
                        </footer>
                    </div>
                    <Toaster />
                </main>
            </body>
        </html>
    );
} 