import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MiniGame = () => {
  const navigate = useNavigate();
  
  // Financial terms and definitions for the memory game
  const cardPairs = [
    { term: '401(k)', definition: 'Retirement Savings Plan' },
    { term: 'APR', definition: 'Annual Percentage Rate' },
    { term: 'Credit Score', definition: '300-850 Rating' },
    { term: 'Emergency Fund', definition: '3-6 Months Expenses' },
    { term: 'Compound Interest', definition: 'Interest on Interest' },
    { term: 'Budget', definition: 'Income vs Expenses' },
    { term: 'Asset', definition: 'Valuable Resource' },
    { term: 'Liability', definition: 'Financial Obligation' }
  ];

  const createGameCards = (): GameCard[] => {
    const cards: GameCard[] = [];
    cardPairs.forEach((pair, index) => {
      cards.push({
        id: index * 2,
        content: pair.term,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: index * 2 + 1,
        content: pair.definition,
        isFlipped: false,
        isMatched: false
      });
    });
    return cards.sort(() => Math.random() - 0.5); // Shuffle
  };

  const [cards, setCards] = useState<GameCard[]>(createGameCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const isCardPair = (card1: GameCard, card2: GameCard): boolean => {
    const pair1 = cardPairs.find(p => p.term === card1.content || p.definition === card1.content);
    const pair2 = cardPairs.find(p => p.term === card2.content || p.definition === card2.content);
    return pair1 === pair2;
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId)!;
      const secondCard = cards.find(c => c.id === secondCardId)!;

      setTimeout(() => {
        if (isCardPair(firstCard, secondCard)) {
          // Match found
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatches(prev => prev + 1);
          
          if (matches + 1 === cardPairs.length) {
            setGameWon(true);
          }
        } else {
          // No match, flip back
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) 
              ? { ...c, isFlipped: false } 
              : c
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    setCards(createGameCards());
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
    setGameStarted(false);
  };

  const getCardClassName = (card: GameCard) => {
    let baseClass = "h-24 w-full cursor-pointer transition-all duration-300 hover:scale-105 flex items-center justify-center text-center p-2 rounded-lg font-medium text-sm";
    
    if (card.isMatched) {
      return `${baseClass} bg-green-100 text-green-800 border-2 border-green-300`;
    }
    if (card.isFlipped) {
      return `${baseClass} bg-blue-100 text-blue-800 border-2 border-blue-300`;
    }
    return `${baseClass} bg-gray-100 hover:bg-gray-200 text-gray-400 border-2 border-gray-300`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Financial Memory Game
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{matches}</div>
              <div className="text-sm text-gray-600">Matches Found</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{moves}</div>
              <div className="text-sm text-gray-600">Moves Made</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Button 
                onClick={resetGame}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Game
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Win Message */}
        {gameWon && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Congratulations! 🎉
              </h2>
              <p className="text-green-700">
                You completed the game in {moves} moves! Great job learning financial terms!
              </p>
              <div className="mt-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Score: {Math.max(1000 - (moves * 50), 100)} points
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!gameStarted && !gameWon && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-bold text-blue-800 mb-2">How to Play:</h3>
              <p className="text-blue-700">
                Match financial terms with their definitions! Click on cards to flip them over. 
                Find pairs by matching terms like "401(k)" with "Retirement Savings Plan". 
                Try to complete the game in as few moves as possible!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={getCardClassName(card)}
                  onClick={() => handleCardClick(card.id)}
                >
                  {card.isFlipped || card.isMatched ? card.content : '?'}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Tips */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <h3 className="font-bold text-yellow-800 mb-2">💡 Learning Tips:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <strong>401(k):</strong> Employer-sponsored retirement savings plan
              </div>
              <div>
                <strong>APR:</strong> The yearly cost of borrowing money
              </div>
              <div>
                <strong>Credit Score:</strong> A number that represents your creditworthiness
              </div>
              <div>
                <strong>Emergency Fund:</strong> Money saved for unexpected expenses
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MiniGame;