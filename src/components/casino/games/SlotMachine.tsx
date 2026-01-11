import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';

type SlotMachineProps = {
  name: string;
  icon: string;
  symbols: string[];
  onClose: () => void;
  balance: number;
  onBalanceChange: (amount: number) => void;
};

export function SlotMachine({ name, icon, symbols, onClose, balance, onBalanceChange }: SlotMachineProps) {
  const [reels, setReels] = useState([icon, icon, icon]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState('10');
  const [lastWin, setLastWin] = useState(0);

  const spin = () => {
    const bet = parseInt(betAmount);
    if (!bet || bet <= 0) {
      toast.error('Укажите ставку');
      return;
    }
    if (bet > balance) {
      toast.error('Недостаточно средств');
      return;
    }

    soundManager.play('spin');
    setIsSpinning(true);
    onBalanceChange(-bet);
    setLastWin(0);

    const spinDuration = 2000;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      setReels(finalReels);
      setIsSpinning(false);

      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        const winAmount = bet * 10;
        setLastWin(winAmount);
        onBalanceChange(winAmount);
        soundManager.play('win');
        toast.success(`Выигрыш ${winAmount} ₽!`);
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2]) {
        const winAmount = bet * 2;
        setLastWin(winAmount);
        onBalanceChange(winAmount);
        soundManager.play('win');
        toast.success(`Выигрыш ${winAmount} ₽!`);
      } else {
        soundManager.play('lose');
        toast.error('Не повезло. Попробуйте ещё!');
      }
    }, spinDuration);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gold-text">Слот: {name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-primary/20">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {reels.map((symbol, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square bg-[#0a0a0a] rounded-lg flex items-center justify-center text-7xl border-2 border-primary/30 transition-all duration-300 ${isSpinning ? 'animate-spin-slow scale-110' : 'scale-100'}`}
                  style={{
                    animation: isSpinning ? `spin-reel-${idx} 0.1s linear infinite` : 'none'
                  }}
                >
                  {symbol}
                </div>
              ))}
            </div>

            {lastWin > 0 && (
              <div className="text-center mb-4">
                <p className="text-3xl font-bold gold-text animate-bounce">
                  +{lastWin.toLocaleString()} ₽
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Баланс:</span>
              <span className="text-xl font-bold gold-text">{balance.toLocaleString()} ₽</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
                <Input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-[#1a1a1a] border-primary/30"
                  disabled={isSpinning}
                />
              </div>
              <div className="flex items-end gap-2">
                {[10, 50, 100].map(amount => (
                  <Button 
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount.toString())}
                    disabled={isSpinning}
                    className="border-primary/30"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={spin}
              disabled={isSpinning}
              className="w-full gold-gradient text-black font-bold text-lg py-6"
            >
              {isSpinning ? 'Крутим...' : 'КРУТИТЬ'}
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>🎰 3 одинаковых = x10</p>
              <p>🎰 2 одинаковых = x2</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}