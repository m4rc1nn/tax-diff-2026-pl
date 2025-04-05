
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
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
            Dane bazują na przepisach podatkowych z roku 2025. Ta aplikacja ma charakter informacyjny.
          </p>
          <p className="mt-1">
            © 2025 Tax-Diff-Wizard | Wszystkie prawa zastrzeżone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
