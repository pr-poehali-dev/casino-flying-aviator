import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

type TowerCell = {
  isWinning: boolean;
  revealed: boolean;
};

export function TowerGame({ onClose, balance, onBalanceChange }: { onClose: () => void; balance: number; onBalanceChange: (amount: number) => void }) {
  const [betAmount, setBetAmount] = useState('10');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [tower, setTower] = useState<TowerCell[][]>([]);
  const [currentBet, setCurrentBet] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);

  const levels = 10;
  const cellsPerLevel = 3;

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
    setMultiplier(1.5);
    setCurrentLevel(0);

    const newTower: TowerCell[][] = Array(levels).fill(null).map(() => {
      const winningIndex = Math.floor(Math.random() * cellsPerLevel);
      return Array(cellsPerLevel).fill(null).map((_, idx) => ({
        isWinning: idx === winningIndex,
        revealed: false
      }));
    });

    setTower(newTower);
    setGameStarted(true);
    toast.success('Стройте башню! Выбирайте правильные блоки');
  };

  const selectCell = (levelIdx: number, cellIdx: number) => {
    if (!gameStarted || levelIdx !== currentLevel || tower[levelIdx][cellIdx].revealed) return;

    const newTower = [...tower];
    newTower[levelIdx][cellIdx].revealed = true;
    setTower(newTower);

    if (newTower[levelIdx][cellIdx].isWinning) {
      const newLevel = currentLevel + 1;
      const newMultiplier = multiplier * 1.4;
      setMultiplier(newMultiplier);

      if (newLevel >= levels) {
        const winAmount = Math.floor(currentBet * newMultiplier);
        onBalanceChange(winAmount);
        setGameStarted(false);
        toast.success(`Вы прошли всю башню! Выигрыш ${winAmount} ₽!`);
      } else {
        setCurrentLevel(newLevel);
        toast.success(`Уровень пройден! Множитель: x${newMultiplier.toFixed(2)}`);
      }
    } else {
      newTower[levelIdx].forEach(cell => cell.revealed = true);
      setTower(newTower);
      setGameStarted(false);
      toast.error(`Неверный блок! Вы проиграли ${currentBet} ₽`);
    }
  };

  const cashout = () => {
    const winAmount = Math.floor(currentBet * multiplier);
    onBalanceChange(winAmount);
    setGameStarted(false);
    toast.success(`Выигрыш ${winAmount} ₽!`);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gold-text">Башня 🗼</DialogTitle>
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
                🗼 Стройте башню! На каждом уровне 1 правильный блок из 3
              </p>
            </div>
          ) : (
            <>
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Уровень</p>
                    <p className="text-lg font-bold">{currentLevel + 1} / {levels}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Множитель</p>
                    <p className="text-lg font-bold gold-text">x{multiplier.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Выигрыш</p>
                    <p className="text-lg font-bold gold-text">{Math.floor(currentBet * multiplier)} ₽</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {tower.slice().reverse().map((level, reversedIdx) => {
                    const levelIdx = levels - 1 - reversedIdx;
                    const isCurrentLevel = levelIdx === currentLevel;
                    const isPassed = levelIdx < currentLevel;

                    return (
                      <div key={levelIdx} className="grid grid-cols-3 gap-2">
                        {level.map((cell, cellIdx) => (
                          <button
                            key={cellIdx}
                            onClick={() => selectCell(levelIdx, cellIdx)}
                            disabled={!isCurrentLevel || cell.revealed}
                            className={`h-12 rounded-lg flex items-center justify-center text-xl font-bold transition-all ${
                              cell.revealed
                                ? cell.isWinning
                                  ? 'bg-green-900/50 border-2 border-green-500'
                                  : 'bg-red-900/50 border-2 border-red-500'
                                : isPassed
                                ? 'bg-[#0a0a0a]/50 border border-primary/10'
                                : isCurrentLevel
                                ? 'bg-[#0a0a0a] border-2 border-primary/50 hover:border-primary hover:scale-105 cursor-pointer'
                                : 'bg-[#0a0a0a]/30 border border-primary/10'
                            }`}
                          >
                            {cell.revealed && (cell.isWinning ? '✓' : '✗')}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={cashout} 
                disabled={currentLevel === 0}
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
