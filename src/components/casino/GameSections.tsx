import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { WinRecord } from './types';
import { SlotMachine } from './games/SlotMachine';
import { MinesGame } from './games/MinesGame';
import { TowerGame } from './games/TowerGame';
import { CasesGame } from './games/CasesGame';
import { toast } from 'sonner';

export function HomeSection({ recentWins, onNavigate }: { recentWins: WinRecord[], onNavigate: (section: string) => void }) {
  return (
    <div className="space-y-8 mb-32">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] p-12 border border-primary/30">
        <div className="relative z-10">
          <Badge className="gold-gradient text-black mb-4">Новинка сезона</Badge>
          <h2 className="text-5xl font-bold mb-4 gold-text">Добро пожаловать в элитный клуб</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Испытайте удачу в премиальных играх. Быстрые выплаты, честная игра, эксклюзивные бонусы.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => onNavigate('slots')} size="lg" className="gold-gradient text-black font-bold text-lg px-8">
              Начать игру
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            <Button onClick={() => onNavigate('bonuses')} size="lg" variant="outline" className="border-primary text-primary">
              Получить бонус
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
          <Icon name="Sparkles" size={300} className="text-primary" />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Слоты', icon: 'Cherry', games: ['Фрукты', 'Рыбка', 'Собачка'], section: 'slots' },
          { title: 'Авиатор', icon: 'Plane', games: ['Классика', 'Турбо', 'VIP'], section: 'aviator' },
          { title: 'Майнкрафт', icon: 'Box', games: ['Шахты', 'Башня', 'Кейсы'], section: 'minecraft' }
        ].map(category => (
          <Card 
            key={category.title} 
            className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => onNavigate(category.section)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name={category.icon as any} size={24} className="text-black" />
              </div>
              <h3 className="text-xl font-bold">{category.title}</h3>
            </div>
            <div className="space-y-2">
              {category.games.map(game => (
                <div key={game} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{game}</span>
                  <Badge variant="outline" className="text-xs">Играть</Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function SlotsSection({ balance, onBalanceChange }: { balance: number; onBalanceChange: (amount: number) => void }) {
  const [activeSlot, setActiveSlot] = useState<{ name: string; icon: string; symbols: string[] } | null>(null);

  const slots = [
    { name: 'Фрукты', icon: '🍒', multiplier: 'x500', popularity: 98, symbols: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓'] },
    { name: 'Рыбка', icon: '🐠', multiplier: 'x750', popularity: 95, symbols: ['🐠', '🐟', '🐡', '🦈', '🐙', '🦑'] },
    { name: 'Собачка', icon: '🐕', multiplier: 'x1000', popularity: 92, symbols: ['🐕', '🐶', '🦴', '🎾', '🐾', '🏠'] }
  ];

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Слоты</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {slots.map(slot => (
          <Card key={slot.name} className="bg-[#1a1a1a] border-primary/20 overflow-hidden group cursor-pointer hover:border-primary transition-all">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
              {slot.icon}
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
                onClick={() => setActiveSlot({ name: slot.name, icon: slot.icon, symbols: slot.symbols })}
                className="w-full gold-gradient text-black font-bold"
              >
                Играть
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {activeSlot && (
        <SlotMachine 
          name={activeSlot.name}
          icon={activeSlot.icon}
          symbols={activeSlot.symbols}
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

          if (next > 2 && Math.random() > 0.98) {
            setIsFlying(false);
            toast.error(`Самолёт упал на x${next.toFixed(2)}! Вы проиграли ${currentBet} ₽`);
            return 1.00;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isFlying, autoExit, currentBet]);

  const startFlight = () => {
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
    setMultiplier(1.00);
    setIsFlying(true);
    toast.success('Полёт начался!');
  };

  const handleCashout = (mult?: number) => {
    const finalMult = mult || multiplier;
    const winAmount = Math.floor(currentBet * finalMult);
    onBalanceChange(winAmount);
    setIsFlying(false);
    setMultiplier(1.00);
    toast.success(`Выигрыш ${winAmount} ₽ (x${finalMult.toFixed(2)})`);
  };

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Авиатор</h2>
      <Card className="bg-[#1a1a1a] border-primary/20 p-8">
        <div className="relative h-96 bg-gradient-to-b from-blue-900/20 to-transparent rounded-xl flex items-center justify-center mb-6">
          <div className="text-center">
            <div className={`text-8xl mb-4 ${isFlying ? 'animate-bounce' : ''}`}>✈️</div>
            <div className="text-6xl font-bold gold-text">{multiplier.toFixed(2)}x</div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
              <Input 
                type="number" 
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="100" 
                className="bg-[#0a0a0a] border-primary/30"
                disabled={isFlying}
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
                disabled={isFlying}
              />
            </div>
          </div>

          {!isFlying ? (
            <Button 
              onClick={startFlight}
              className="w-full gold-gradient text-black font-bold text-lg py-6"
            >
              Начать полёт
            </Button>
          ) : (
            <Button 
              onClick={() => handleCashout()}
              className="w-full gold-gradient text-black font-bold text-lg py-6"
            >
              Забрать {Math.floor(currentBet * multiplier)} ₽
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export function MinecraftSection({ balance, onBalanceChange }: { balance: number; onBalanceChange: (amount: number) => void }) {
  const [activeGame, setActiveGame] = useState<'mines' | 'tower' | 'cases' | null>(null);

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Майнкрафт</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card 
          className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all cursor-pointer"
          onClick={() => setActiveGame('mines')}
        >
          <div className="text-6xl mb-4">⛏️</div>
          <h3 className="text-2xl font-bold mb-2">Шахты</h3>
          <p className="text-muted-foreground mb-4">Откройте клетки и найдите алмазы</p>
          <Button className="w-full gold-gradient text-black font-bold">Играть</Button>
        </Card>

        <Card 
          className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all cursor-pointer"
          onClick={() => setActiveGame('tower')}
        >
          <div className="text-6xl mb-4">🗼</div>
          <h3 className="text-2xl font-bold mb-2">Башня</h3>
          <p className="text-muted-foreground mb-4">Поднимайтесь выше для больших призов</p>
          <Button className="w-full gold-gradient text-black font-bold">Играть</Button>
        </Card>

        <Card 
          className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all cursor-pointer"
          onClick={() => setActiveGame('cases')}
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold mb-2">Кейсы</h3>
          <p className="text-muted-foreground mb-4">Откройте кейсы с редкими предметами</p>
          <Button className="w-full gold-gradient text-black font-bold">Играть</Button>
        </Card>
      </div>

      {activeGame === 'mines' && (
        <MinesGame 
          balance={balance}
          onBalanceChange={onBalanceChange}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'tower' && (
        <TowerGame 
          balance={balance}
          onBalanceChange={onBalanceChange}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'cases' && (
        <CasesGame 
          balance={balance}
          onBalanceChange={onBalanceChange}
          onClose={() => setActiveGame(null)}
        />
      )}
    </div>
  );
}

export function SportSection({ balance, onBalanceChange }: { balance: number; onBalanceChange: (amount: number) => void }) {
  const [betAmount, setBetAmount] = useState('10');
  const [activeBet, setActiveBet] = useState<{ match: number; outcome: string; odds: number } | null>(null);

  const matches = [
    { team1: 'Спартак', team2: 'ЦСКА', odds1: 2.1, oddsX: 3.2, odds2: 2.8, sport: '⚽' },
    { team1: 'Лейкерс', team2: 'Уориорз', odds1: 1.8, oddsX: null, odds2: 1.9, sport: '🏀' }
  ];

  const placeBet = (matchIdx: number, outcome: string, odds: number) => {
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
    setActiveBet({ match: matchIdx, outcome, odds });

    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        const winAmount = Math.floor(bet * odds);
        onBalanceChange(winAmount);
        toast.success(`Ставка сыграла! Выигрыш ${winAmount} ₽`);
      } else {
        toast.error('Ставка не сыграла');
      }
      setActiveBet(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Ставки на спорт</h2>
      
      <Card className="bg-[#1a1a1a] border-primary/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Баланс:</span>
          <span className="text-xl font-bold gold-text">{balance.toLocaleString()} ₽</span>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Сумма ставки</label>
          <Input 
            type="number" 
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="100" 
            className="bg-[#0a0a0a] border-primary/30"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {matches.map((match, idx) => (
          <Card key={idx} className="bg-[#1a1a1a] border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{match.sport}</span>
                <div>
                  <p className="font-semibold">{match.team1} vs {match.team2}</p>
                  <p className="text-xs text-muted-foreground">Через 2 часа</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="border-primary/30 hover:gold-gradient hover:text-black"
                onClick={() => placeBet(idx, 'П1', match.odds1)}
                disabled={activeBet !== null}
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">П1</div>
                  <div className="font-bold">{match.odds1}</div>
                </div>
              </Button>
              {match.oddsX && (
                <Button 
                  variant="outline" 
                  className="border-primary/30 hover:gold-gradient hover:text-black"
                  onClick={() => placeBet(idx, 'X', match.oddsX!)}
                  disabled={activeBet !== null}
                >
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">X</div>
                    <div className="font-bold">{match.oddsX}</div>
                  </div>
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-primary/30 hover:gold-gradient hover:text-black"
                onClick={() => placeBet(idx, 'П2', match.odds2)}
                disabled={activeBet !== null}
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">П2</div>
                  <div className="font-bold">{match.odds2}</div>
                </div>
              </Button>
            </div>
            {activeBet && activeBet.match === idx && (
              <p className="text-center mt-3 text-sm gold-text animate-pulse">Ожидаем результат...</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BonusesSection({ onClaimBonus }: { onClaimBonus: (amount: number) => void }) {
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});

  const claimBonus = (id: string, amount: number) => {
    if (claimed[id]) {
      toast.error('Бонус уже получен');
      return;
    }
    
    setClaimed({ ...claimed, [id]: true });
    onClaimBonus(amount);
    toast.success(`Получено ${amount} ₽!`);
  };

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Бонусы</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { id: 'welcome', title: 'Приветственный бонус', amount: 5000, desc: 'На первый депозит до 50 000 ₽', icon: 'Gift' },
          { id: 'cashback', title: 'Кэшбэк', amount: 1000, desc: 'Еженедельный возврат проигрышей', icon: 'RefreshCw' },
          { id: 'freespins', title: 'Фриспины', amount: 500, desc: 'За регистрацию на слот месяца', icon: 'Sparkles' },
          { id: 'vip', title: 'VIP программа', amount: 2500, desc: 'Эксклюзивные привилегии', icon: 'Crown' }
        ].map(bonus => (
          <Card key={bonus.id} className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 gold-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name={bonus.icon as any} size={28} className="text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{bonus.title}</h3>
                <p className="text-2xl gold-text font-bold mb-2">+{bonus.amount} ₽</p>
                <p className="text-sm text-muted-foreground mb-4">{bonus.desc}</p>
                <Button 
                  onClick={() => claimBonus(bonus.id, bonus.amount)}
                  disabled={claimed[bonus.id]}
                  className="gold-gradient text-black font-semibold"
                >
                  {claimed[bonus.id] ? 'Получено' : 'Получить'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SupportSection() {
  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Поддержка</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-primary/20 p-6">
          <h3 className="text-xl font-bold mb-4">Связаться с нами</h3>
          <div className="space-y-4">
            <Button className="w-full gold-gradient text-black font-semibold justify-start" size="lg">
              <Icon name="MessageCircle" size={20} />
              <span className="ml-3">Онлайн-чат (24/7)</span>
            </Button>
            <Button variant="outline" className="w-full border-primary/30 justify-start" size="lg">
              <Icon name="Send" size={20} />
              <span className="ml-3">Telegram</span>
            </Button>
            <Button variant="outline" className="w-full border-primary/30 justify-start" size="lg">
              <Icon name="Mail" size={20} />
              <span className="ml-3">Email</span>
            </Button>
          </div>
        </Card>
        
        <Card className="bg-[#1a1a1a] border-primary/20 p-6">
          <h3 className="text-xl font-bold mb-4">Часто задаваемые вопросы</h3>
          <div className="space-y-3">
            {[
              'Как пополнить баланс?',
              'Сколько времени занимает вывод?',
              'Есть ли лимиты на ставки?',
              'Как получить бонус?'
            ].map(q => (
              <button key={q} className="w-full text-left p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors">
                <p className="text-sm">{q}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
