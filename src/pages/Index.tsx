
import React from 'react';
import Layout from '@/components/Layout';
import TaxCalculator from '@/components/TaxCalculator';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Porównaj zmiany w składkach zdrowotnych dla przedsiębiorców
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Wprowadź swój miesięczny przychód/dochód i wybierz formę opodatkowania,
            aby zobaczyć jak zmiany od 2026 roku wpłyną na wysokość Twojej składki zdrowotnej.
          </p>
        </div>

        <TaxCalculator />

        <Card className="mt-8 border-purple-light/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">O kalkulatorze</h3>
            <p className="text-gray-700 mb-3">
              Kalkulator umożliwia porównanie wysokości składek zdrowotnych dla przedsiębiorców 
              przed i po wprowadzeniu zmian w przepisach od 2026 roku.
            </p>
            <p className="text-gray-700">
              Pamiętaj, że kalkulacje mają charakter przybliżony i opierają się na ogłoszonych 
              zmianach w przepisach. Rzeczywiste wartości mogą się różnić w zależności od indywidualnej 
              sytuacji podatkowej.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
