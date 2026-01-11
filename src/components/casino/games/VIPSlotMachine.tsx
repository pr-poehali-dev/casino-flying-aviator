import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';

type VIPSlotMachineProps = {
  onClose: () => void;
  balance: number;
  onBalanceChange: (amount: number) => void;
};

const fruits = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍌', '🥝'];

export function VIPSlotMachine({ onClose, balance, onBalanceChange }: VIPSlotMachineProps) {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒', '🍒', '🍒']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState('50');
  const [lastWin, setLastWin] = useState(0);
  const [jackpot, setJackpot] = useState(125000);

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
    setJackpot(prev => prev + Math.floor(bet * 0.1));

    const spinDuration = 3000;
    const interval = setInterval(() => {
      setReels([
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      const finalReels = [
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)],
        fruits[Math.floor(Math.random() * fruits.length)]
      ];
      setReels(finalReels);
      setIsSpinning(false);

      const uniqueSymbols = new Set(finalReels);
      
      if (uniqueSymbols.size === 1) {
        soundManager.play('bonus');
        const winAmount = jackpot;
        setLastWin(winAmount);
        onBalanceChange(winAmount);
        setJackpot(50000);
        toast.success(`🎰 ДЖЕКПОТ! Выигрыш ${winAmount.toLocaleString()} ₽!`, { duration: 5000 });
      } else if (uniqueSymbols.size === 2) {
        soundManager.play('win');
        const winAmount = bet * 50;
        setLastWin(winAmount);
        onBalanceChange(winAmount);
        toast.success(`💎 4 одинаковых! Выигрыш ${winAmount.toLocaleString()} ₽!`);
      } else {
        const matchCount = Math.max(...Array.from(uniqueSymbols).map(
          symbol => finalReels.filter(r => r === symbol).length
        ));

        if (matchCount === 4) {
          soundManager.play('win');
          const winAmount = bet * 20;
          setLastWin(winAmount);
          onBalanceChange(winAmount);
          toast.success(`⭐ 4 одинаковых! Выигрыш ${winAmount.toLocaleString()} ₽!`);
        } else if (matchCount === 3) {
          soundManager.play('win');
          const winAmount = bet * 5;
          setLastWin(winAmount);
          onBalanceChange(winAmount);
          toast.success(`✨ 3 одинаковых! Выигрыш ${winAmount.toLocaleString()} ₽!`);
        } else {
          soundManager.play('lose');
          toast.error('Не повезло. Попробуйте ещё!');
        }
      }
    }, spinDuration);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold gold-text flex items-center gap-3">
            👑 VIP ФРУКТЫ 
            <Badge className="gold-gradient text-black text-lg px-4 py-1">Premium</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl p-4 border border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">💰 ДЖЕКПОТ</span>
            </div>
            <div className="text-5xl font-bold gold-text text-center animate-pulse-slow">
              {jackpot.toLocaleString()} ₽
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-8 border border-primary/20">
            <div className="grid grid-cols-5 gap-3 mb-6">
              {reels.map((symbol, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-xl flex items-center justify-center text-8xl border-2 border-primary/30 transition-all duration-300 ${isSpinning ? 'animate-bounce scale-110' : 'scale-100'}`}
                  style={{
                    boxShadow: isSpinning ? '0 0 30px rgba(212, 175, 55, 0.5)' : 'none'
                  }}
                >
                  {symbol}
                </div>
              ))}
            </div>

            {lastWin > 0 && (
              <div className="text-center mb-4">
                <p className="text-5xl font-bold gold-text animate-bounce">
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
                <label className="text-sm text-muted-foreground mb-2 block">Ставка (мин. 50₽)</label>
                <Input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-[#1a1a1a] border-primary/30"
                  disabled={isSpinning}
                  min="50"
                />
              </div>
              <div className="flex items-end gap-2">
                {[50, 100, 500, 1000].map(amount => (
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
              className="w-full gold-gradient text-black font-bold text-xl py-8"
            >
              {isSpinning ? '🎰 Крутим...' : '👑 КРУТИТЬ VIP'}
            </Button>

            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-primary/20">
              <h4 className="font-bold mb-2 text-center">Таблица выплат</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center p-2 bg-[#0a0a0a] rounded">
                  <span>🎰 5 одинаковых</span>
                  <span className="gold-text font-bold">ДЖЕКПОТ 💰</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#0a0a0a] rounded">
                  <span>💎 4 одинаковых</span>
                  <span className="gold-text font-bold">x50</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#0a0a0a] rounded">
                  <span>⭐ 4 одинаковых</span>
                  <span className="gold-text font-bold">x20</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[#0a0a0a] rounded">
                  <span>✨ 3 одинаковых</span>
                  <span className="gold-text font-bold">x5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
