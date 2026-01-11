import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';

type Obstacle = {
  x: number;
  y: number;
  type: 'cloud' | 'bird' | 'rocket';
};

type Bonus = {
  x: number;
  y: number;
  value: number;
};

export function AviaMasterGame({ onClose, balance, onBalanceChange }: { onClose: () => void; balance: number; onBalanceChange: (amount: number) => void }) {
  const [betAmount, setBetAmount] = useState('10');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);
  const [planeY, setPlaneY] = useState(50);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const gameLoopRef = useRef<number>();

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === ' ') {
        setPlaneY(prev => Math.max(0, prev - 10));
      } else if (e.key === 'ArrowDown') {
        setPlaneY(prev => Math.min(90, prev + 10));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    gameLoopRef.current = window.setInterval(() => {
      setObstacles(prev => {
        const newObstacles = prev
          .map(o => ({ ...o, x: o.x - gameSpeed }))
          .filter(o => o.x > -10);

        if (Math.random() < 0.03) {
          const types: Array<'cloud' | 'bird' | 'rocket'> = ['cloud', 'bird', 'rocket'];
          newObstacles.push({
            x: 100,
            y: Math.random() * 80,
            type: types[Math.floor(Math.random() * types.length)]
          });
        }

        const planeHitbox = { x: 10, y: planeY, width: 8, height: 6 };
        const hit = newObstacles.some(o => {
          const obstacleHitbox = { x: o.x, y: o.y, width: 6, height: 6 };
          return (
            planeHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
            planeHitbox.x + planeHitbox.width > obstacleHitbox.x &&
            planeHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
            planeHitbox.y + planeHitbox.height > obstacleHitbox.y
          );
        });

        if (hit) {
          endGame(false);
        }

        return newObstacles;
      });

      setBonuses(prev => {
        let newBonuses = prev
          .map(b => ({ ...b, x: b.x - gameSpeed }))
          .filter(b => b.x > -10);

        if (Math.random() < 0.02) {
          newBonuses.push({
            x: 100,
            y: Math.random() * 80,
            value: Math.random() > 0.7 ? 0.5 : 0.2
          });
        }

        const planeHitbox = { x: 10, y: planeY, width: 8, height: 6 };
        newBonuses = newBonuses.filter(b => {
          const bonusHitbox = { x: b.x, y: b.y, width: 4, height: 4 };
          const collected = (
            planeHitbox.x < bonusHitbox.x + bonusHitbox.width &&
            planeHitbox.x + planeHitbox.width > bonusHitbox.x &&
            planeHitbox.y < bonusHitbox.y + bonusHitbox.height &&
            planeHitbox.y + planeHitbox.height > bonusHitbox.y
          );

          if (collected) {
            soundManager.play('click');
            setMultiplier(prev => prev + b.value);
            return false;
          }
          return true;
        });

        return newBonuses;
      });

      setScore(prev => prev + 1);
      setMultiplier(prev => prev + 0.01);
      setGameSpeed(prev => Math.min(prev + 0.001, 5));
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, planeY, gameSpeed]);

  const startGame = () => {
    const bet = parseInt(betAmount);
    if (!bet || bet <= 0) {
      toast.error('Укажите ставку');
      return;
    }
    if (bet > balance) {
      toast.error('Недостаточно средств');
      return;
    }

    soundManager.play('click');
    onBalanceChange(-bet);
    setCurrentBet(bet);
    setGameStarted(true);
    setScore(0);
    setMultiplier(1.0);
    setPlaneY(50);
    setObstacles([]);
    setBonuses([]);
    setGameSpeed(2);
    toast.success('🛩️ Полёт начался! Управление: ↑ / ↓ или Пробел');
  };

  const endGame = (cashout: boolean) => {
    setGameStarted(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);

    if (cashout) {
      const winAmount = Math.floor(currentBet * multiplier);
      onBalanceChange(winAmount);
      soundManager.play('win');
      toast.success(`✅ Выигрыш ${winAmount} ₽! (x${multiplier.toFixed(2)})`);
    } else {
      soundManager.play('crash');
      toast.error(`💥 Столкновение! Пройдено: ${score}м, множитель: x${multiplier.toFixed(2)}`);
    }
  };

  const getObstacleIcon = (type: string) => {
    switch(type) {
      case 'cloud': return '☁️';
      case 'bird': return '🦅';
      case 'rocket': return '🚀';
      default: return '☁️';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gold-text">AviaMaster 🛩️</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Баланс:</span>
            <span className="text-xl font-bold gold-text">{balance.toLocaleString()} ₽</span>
          </div>

          {!gameStarted ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
                <Input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>
              <div className="flex gap-2">
                {[10, 50, 100, 500].map(amount => (
                  <Button 
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount.toString())}
                    className="border-primary/30"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              <Button onClick={startGame} className="w-full gold-gradient text-black font-bold text-lg py-6">
                Начать полёт
              </Button>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>🎮 Управление: Стрелки ↑↓ или Пробел</p>
                <p>⭐ Собирайте звёзды для увеличения множителя</p>
                <p>☁️ Избегайте препятствий: облака, птицы, ракеты</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-primary/20 relative h-96 overflow-hidden">
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-black/50 px-3 py-1 rounded-lg">
                    <p className="text-sm text-muted-foreground">Дистанция</p>
                    <p className="text-xl font-bold gold-text">{score}м</p>
                  </div>
                  <div className="bg-black/50 px-3 py-1 rounded-lg">
                    <p className="text-sm text-muted-foreground">Множитель</p>
                    <p className="text-xl font-bold gold-text">x{multiplier.toFixed(2)}</p>
                  </div>
                  <div className="bg-black/50 px-3 py-1 rounded-lg">
                    <p className="text-sm text-muted-foreground">Выигрыш</p>
                    <p className="text-lg font-bold gold-text">{Math.floor(currentBet * multiplier)} ₽</p>
                  </div>
                </div>

                <div 
                  className="absolute text-5xl transition-all duration-100"
                  style={{ left: '10%', top: `${planeY}%` }}
                >
                  🛩️
                </div>

                {obstacles.map((obstacle, idx) => (
                  <div
                    key={`obstacle-${idx}`}
                    className="absolute text-4xl"
                    style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
                  >
                    {getObstacleIcon(obstacle.type)}
                  </div>
                ))}

                {bonuses.map((bonus, idx) => (
                  <div
                    key={`bonus-${idx}`}
                    className="absolute text-3xl animate-pulse"
                    style={{ left: `${bonus.x}%`, top: `${bonus.y}%` }}
                  >
                    ⭐
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => setPlaneY(prev => Math.max(0, prev - 15))}
                  className="gold-gradient text-black font-bold text-lg py-8"
                >
                  ↑ Вверх
                </Button>
                <Button 
                  onClick={() => setPlaneY(prev => Math.min(90, prev + 15))}
                  className="gold-gradient text-black font-bold text-lg py-8"
                >
                  ↓ Вниз
                </Button>
              </div>

              <Button 
                onClick={() => endGame(true)}
                variant="outline"
                className="w-full border-primary/30 font-bold text-lg py-4"
              >
                Забрать {Math.floor(currentBet * multiplier)} ₽
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
