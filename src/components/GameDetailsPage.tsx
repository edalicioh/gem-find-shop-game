
import React from 'react';
import { Download, Star, Calendar, HardDrive, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameDetailsPageProps {
  gameData: {
    name: string;
    background_image: string;
    description: string;
    metacritic_score: number;
    platforms: string[];
    released: string;
    size: string;
    link: string;
  };
}

const GameDetailsPage: React.FC<GameDetailsPageProps> = ({ gameData }) => {
  const {
    name,
    background_image,
    description,
    metacritic_score,
    platforms,
    released,
    size,
    link
  } = gameData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      {/* Hero Section com Banner */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={background_image}
          alt={`${name} - Imagem de fundo`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        
        {/* Título sobre a imagem */}
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            {name}
          </h1>
          
          {/* Botão de Download Principal */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-bold py-4 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Download className="h-6 w-6 mr-3" />
              Baixar Jogo
            </Button>
          </a>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal - Descrição */}
          <div className="lg:col-span-2">
            <Card className="bg-dark-800 border-neon-purple/30">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Sobre o Jogo</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Detalhes */}
          <div className="space-y-6">
            
            {/* Score Metacritic */}
            <Card className="bg-dark-800 border-neon-purple/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Metacritic Score</h3>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(metacritic_score)}`}>
                  {metacritic_score}/100
                </div>
              </CardContent>
            </Card>

            {/* Data de Lançamento */}
            <Card className="bg-dark-800 border-neon-purple/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-neon-blue" />
                  <h3 className="text-lg font-semibold text-white">Lançamento</h3>
                </div>
                <p className="text-gray-300 text-lg">
                  {formatDate(released)}
                </p>
              </CardContent>
            </Card>

            {/* Tamanho do Arquivo */}
            <Card className="bg-dark-800 border-neon-purple/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="h-5 w-5 text-neon-green" />
                  <h3 className="text-lg font-semibold text-white">Tamanho</h3>
                </div>
                <p className="text-gray-300 text-lg">
                  {size}
                </p>
              </CardContent>
            </Card>

            {/* Plataformas */}
            <Card className="bg-dark-800 border-neon-purple/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="h-5 w-5 text-neon-purple" />
                  <h3 className="text-lg font-semibold text-white">Plataformas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple/40 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botão de Download Secundário */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Agora
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
