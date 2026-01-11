import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

type Cell = {
  revealed: boolean;
  isBomb: boolean;
  isDiamond: boolean;
};

export function MinesGame({ onClose, balance, onBalanceChange }: { onClose: () => void; balance: number; onBalanceChange: (amount: number) => void }) {
  const [betAmount, setBetAmount] = useState('10');
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [currentBet, setCurrentBet] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [revealedCount, setRevealedCount] = useState(0);

  const gridSize = 25;
  const bombCount = 5;

  const initGame = () => {
    const bet = parseInt(betAmount);
    if (!bet || bet <= 0) {
      toast.error('Укажите ставку');
      return;
    }
    if (bet > balance) {
      toast.error('Недостаточно средств');
      return;
    }

    onBalanceChange(-bet);
    setCurrentBet(bet);
    setMultiplier(1.0);
    setRevealedCount(0);

    const newGrid: Cell[] = Array(gridSize).fill(null).map(() => ({
      revealed: false,
      isBomb: false,
      isDiamond: false
    }));

    const bombIndices = new Set<number>();
    while (bombIndices.size < bombCount) {
      bombIndices.add(Math.floor(Math.random() * gridSize));
    }

    newGrid.forEach((cell, idx) => {
      if (bombIndices.has(idx)) {
        cell.isBomb = true;
      } else {
        cell.isDiamond = true;
      }
    });

    setGrid(newGrid);
    setGameStarted(true);
    toast.success('Игра началась! Найдите алмазы');
  };

  const revealCell = (index: number) => {
    if (!gameStarted || grid[index].revealed) return;

    const newGrid = [...grid];
    newGrid[index].revealed = true;
    setGrid(newGrid);

    if (newGrid[index].isBomb) {
      newGrid.forEach(cell => cell.revealed = true);
      setGrid(newGrid);
      setGameStarted(false);
      toast.error(`Бомба! Вы проиграли ${currentBet} ₽`);
    } else {
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      const newMultiplier = 1 + (newRevealedCount * 0.3);
      setMultiplier(newMultiplier);
      toast.success(`Алмаз! Множитель: x${newMultiplier.toFixed(2)}`);
    }
  };

  const cashout = () => {
    const winAmount = Math.floor(currentBet * multiplier);
    onBalanceChange(winAmount);
    setGameStarted(false);
    toast.success(`Выигрыш ${winAmount} ₽!`);
    
    const newGrid = [...grid];
    newGrid.forEach(cell => cell.revealed = true);
    setGrid(newGrid);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gold-text">Шахты ⛏️</DialogTitle>
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
              <Button onClick={initGame} className="w-full gold-gradient text-black font-bold text-lg py-6">
                Начать игру
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                💎 5 бомб на поле. Находите алмазы и увеличивайте множитель!
              </p>
            </div>
          ) : (
            <>
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ставка</p>
                    <p className="text-lg font-bold">{currentBet} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Множитель</p>
                    <p className="text-lg font-bold gold-text">x{multiplier.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Возможный выигрыш</p>
                    <p className="text-lg font-bold gold-text">{Math.floor(currentBet * multiplier)} ₽</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {grid.map((cell, idx) => (
                    <button
                      key={idx}
                      onClick={() => revealCell(idx)}
                      disabled={cell.revealed}
                      className={`aspect-square rounded-lg flex items-center justify-center text-3xl font-bold transition-all ${
                        cell.revealed 
                          ? cell.isBomb 
                            ? 'bg-red-900/50 border-2 border-red-500' 
                            : 'bg-green-900/50 border-2 border-green-500'
                          : 'bg-[#0a0a0a] border-2 border-primary/30 hover:border-primary hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {cell.revealed && (cell.isBomb ? '💣' : '💎')}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={cashout} 
                disabled={revealedCount === 0}
                className="w-full gold-gradient text-black font-bold text-lg py-6"
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
