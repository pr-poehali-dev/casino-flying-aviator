import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SlotMachine } from '../games/SlotMachine';
import { VIPSlotMachine } from '../games/VIPSlotMachine';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';

export function SlotsSection({ balance, onBalanceChange }: { balance: number; onBalanceChange: (amount: number) => void }) {
  const [activeSlot, setActiveSlot] = useState<{ name: string; icon: string; symbols: string[]; isVIP?: boolean } | null>(null);

  const slots = [
    { name: 'Фрукты', icon: '🍒', multiplier: 'x500', popularity: 98, symbols: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓'] },
    { name: 'Рыбка', icon: '🐠', multiplier: 'x750', popularity: 95, symbols: ['🐠', '🐟', '🐡', '🦈', '🐙', '🦑'] },
    { name: 'Собачка', icon: '🐕', multiplier: 'x1000', popularity: 92, symbols: ['🐕', '🐶', '🦴', '🎾', '🐾', '🏠'] },
    { name: 'Сокровища', icon: '💎', multiplier: 'x2000', popularity: 90, symbols: ['💎', '👑', '💰', '🏆', '💍', '🔱'] },
    { name: 'Космос', icon: '🚀', multiplier: 'x1500', popularity: 93, symbols: ['🚀', '🌟', '🌙', '🪐', '☄️', '🛸'] },
    { name: 'Драконы', icon: '🐉', multiplier: 'x3000', popularity: 88, symbols: ['🐉', '🔥', '⚡', '🗡️', '🛡️', '🏔️'] },
    { name: 'Фрукты VIP', icon: '👑', multiplier: 'JACKPOT', popularity: 99, symbols: ['🍒', '🍋', '🍊', '🍇', '🍉'], isVIP: true }
  ];

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Слоты</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {slots.map(slot => (
          <Card key={slot.name} className={`bg-[#1a1a1a] overflow-hidden group cursor-pointer hover:border-primary transition-all ${
            slot.isVIP ? 'border-2 border-primary bg-gradient-to-br from-primary/10 to-transparent' : 'border-primary/20'
          }`}>
            <div className={`aspect-video flex items-center justify-center text-8xl group-hover:scale-110 transition-transform ${
              slot.isVIP ? 'bg-gradient-to-br from-primary/30 to-primary/10 animate-pulse-slow' : 'bg-gradient-to-br from-primary/20 to-transparent'
            }`}>
              {slot.icon}
              {slot.isVIP && <span className="ml-2 text-5xl">🎉</span>}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">{slot.name}</h3>
                <Badge className="gold-gradient text-black">{slot.multiplier}</Badge>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Популярность</span>
                  <span className="text-primary font-semibold">{slot.popularity}%</span>
                </div>
                <div className="w-full bg-[#0a0a0a] rounded-full h-2">
                  <div className="gold-gradient h-2 rounded-full" style={{ width: `${slot.popularity}%` }} />
                </div>
              </div>
              <Button 
                onClick={() => setActiveSlot({ name: slot.name, icon: slot.icon, symbols: slot.symbols, isVIP: slot.isVIP })}
                className={`w-full font-bold ${
                  slot.isVIP ? 'gold-gradient text-black text-lg' : 'gold-gradient text-black'
                }`}
              >
                {slot.isVIP ? '👑 Играть VIP' : 'Играть'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {activeSlot && !activeSlot.isVIP && (
        <SlotMachine 
          name={activeSlot.name}
          icon={activeSlot.icon}
          symbols={activeSlot.symbols}
          balance={balance}
          onBalanceChange={onBalanceChange}
          onClose={() => setActiveSlot(null)}
        />
      )}

      {activeSlot && activeSlot.isVIP && (
        <VIPSlotMachine 
          balance={balance}
          onBalanceChange={onBalanceChange}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}

export function AviatorSection({ balance, onBalanceChange }: { balance: number; onBalanceChange: (amount: number) => void }) {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [betAmount, setBetAmount] = useState('10');
  const [autoExit, setAutoExit] = useState('2.00');
  const [currentBet, setCurrentBet] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [autoPlayRounds, setAutoPlayRounds] = useState('10');

  useEffect(() => {
    if (autoPlay && !isFlying && autoPlayCount > 0) {
      setTimeout(() => {
        startFlight(true);
      }, 2000);
    }
  }, [isFlying, autoPlay, autoPlayCount]);

  useEffect(() => {
    if (isFlying) {
      const interval = setInterval(() => {
        setMultiplier(prev => {
          const next = prev + 0.01;
          
          const autoExitValue = parseFloat(autoExit);
          if (!isNaN(autoExitValue) && next >= autoExitValue) {
            handleCashout(next);
            return prev;
          }

          const crashChance = next < 1.5 ? 0.005 : next < 2 ? 0.01 : next < 3 ? 0.02 : next < 5 ? 0.035 : 0.05;
          if (Math.random() < crashChance) {
            setIsFlying(false);
            soundManager.play('crash');
            if (autoPlay) {
              setAutoPlayCount(prev => prev - 1);
              if (autoPlayCount <= 1) {
                setAutoPlay(false);
                toast.error(`💥 Авто-игра завершена`);
              }
            } else {
              toast.error(`💥 Самолёт упал на x${next.toFixed(2)}! Вы проиграли ${currentBet} ₽`);
            }
            return 1.00;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isFlying, autoExit, currentBet]);

  const startFlight = (isAuto = false) => {
    const bet = parseInt(betAmount);
    if (!bet || bet <= 0) {
      toast.error('Укажите ставку');
      if (isAuto) setAutoPlay(false);
      return;
    }
    if (bet > balance) {
      toast.error('Недостаточно средств');
      if (isAuto) setAutoPlay(false);
      return;
    }

    soundManager.play('click');
    onBalanceChange(-bet);
    setCurrentBet(bet);
    setMultiplier(1.00);
    setIsFlying(true);
    if (!isAuto) toast.success('🚀 Полёт начался!');
  };

  const startAutoPlay = () => {
    const rounds = parseInt(autoPlayRounds);
    if (!rounds || rounds <= 0) {
      toast.error('Укажите количество раундов');
      return;
    }
    setAutoPlay(true);
    setAutoPlayCount(rounds);
    toast.success(`🤖 Авто-игра начата: ${rounds} раундов`);
    startFlight(true);
  };

  const stopAutoPlay = () => {
    setAutoPlay(false);
    setAutoPlayCount(0);
    toast.info('🛑 Авто-игра остановлена');
  };

  const handleCashout = (mult?: number) => {
    const finalMult = mult || multiplier;
    const winAmount = Math.floor(currentBet * finalMult);
    onBalanceChange(winAmount);
    setIsFlying(false);
    setMultiplier(1.00);
    soundManager.play('win');
    
    if (autoPlay) {
      setAutoPlayCount(prev => prev - 1);
      if (autoPlayCount <= 1) {
        setAutoPlay(false);
        toast.success(`✅ Авто-игра завершена! Итоговый выигрыш: ${winAmount} ₽`);
      }
    } else {
      toast.success(`✅ Выигрыш ${winAmount} ₽ (x${finalMult.toFixed(2)})`);
    }
  };

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Авиатор</h2>
      <Card className="bg-[#1a1a1a] border-primary/20 p-8">
        <div className="relative h-96 bg-gradient-to-b from-blue-900/20 to-transparent rounded-xl flex items-center justify-center mb-6">
          <div className="text-center">
            <div className={`text-8xl mb-4 transition-all duration-300 ${isFlying ? 'animate-bounce scale-110' : 'scale-100'}`}>✈️</div>
            <div className="text-6xl font-bold gold-text transition-all duration-100">{multiplier.toFixed(2)}x</div>
            {isFlying && (
              <p className="text-sm text-muted-foreground mt-2">
                Возможный выигрыш: {Math.floor(currentBet * multiplier)} ₽
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Баланс:</span>
            <span className="text-xl font-bold gold-text">{balance.toLocaleString()} ₽</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
              <Input 
                type="number" 
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="100" 
                className="bg-[#0a0a0a] border-primary/30"
                disabled={isFlying || autoPlay}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Авто-выход</label>
              <Input 
                type="number" 
                value={autoExit}
                onChange={(e) => setAutoExit(e.target.value)}
                placeholder="2.00" 
                className="bg-[#0a0a0a] border-primary/30"
                disabled={isFlying || autoPlay}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">🤖 Раундов</label>
              <Input 
                type="number" 
                value={autoPlayRounds}
                onChange={(e) => setAutoPlayRounds(e.target.value)}
                placeholder="10" 
                className="bg-[#0a0a0a] border-primary/30"
                disabled={isFlying || autoPlay}
              />
            </div>
          </div>

          {autoPlay && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">Авто-игра активна</span>
                </div>
                <span className="text-sm gold-text font-bold">Осталось: {autoPlayCount} раундов</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {!isFlying && !autoPlay && (
              <>
                <Button 
                  onClick={() => startFlight()}
                  className="w-full gold-gradient text-black font-bold text-lg py-6"
                >
                  ✈️ Начать полёт
                </Button>
                <Button 
                  onClick={startAutoPlay}
                  variant="outline"
                  className="w-full border-primary/30 font-bold text-lg py-6"
                >
                  🤖 Авто-игра
                </Button>
              </>
            )}

            {autoPlay && (
              <Button 
                onClick={stopAutoPlay}
                variant="destructive"
                className="col-span-2 w-full font-bold text-lg py-6"
              >
                🛑 Остановить авто-игру
              </Button>
            )}

            {isFlying && !autoPlay && (
              <Button 
                onClick={() => handleCashout()}
                className="col-span-2 w-full gold-gradient text-black font-bold text-lg py-6"
              >
                💰 Забрать {Math.floor(currentBet * multiplier)} ₽
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}