import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MinesGame } from '../games/MinesGame';
import { TowerGame } from '../games/TowerGame';
import { CasesGame } from '../games/CasesGame';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';

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
  const [sportFilter, setSportFilter] = useState<string>('all');

  const allMatches = [
    { team1: 'Спартак', team2: 'ЦСКА', odds1: 2.1, oddsX: 3.2, odds2: 2.8, sport: 'football', icon: '⚽', league: 'РПЛ' },
    { team1: 'Зенит', team2: 'Динамо', odds1: 1.9, oddsX: 3.0, odds2: 3.5, sport: 'football', icon: '⚽', league: 'РПЛ' },
    { team1: 'Реал Мадрид', team2: 'Барселона', odds1: 2.3, oddsX: 3.1, odds2: 2.6, sport: 'football', icon: '⚽', league: 'Ла Лига' },
    { team1: 'СКА', team2: 'Спартак', odds1: 1.7, oddsX: 3.8, odds2: 4.2, sport: 'hockey', icon: '🏒', league: 'КХЛ' },
    { team1: 'Авангард', team2: 'Динамо', odds1: 2.0, oddsX: 3.5, odds2: 3.0, sport: 'hockey', icon: '🏒', league: 'КХЛ' },
    { team1: 'Лейкерс', team2: 'Уориорз', odds1: 1.8, oddsX: null, odds2: 1.9, sport: 'basketball', icon: '🏀', league: 'NBA' },
    { team1: 'Майами', team2: 'Бостон', odds1: 2.2, oddsX: null, odds2: 1.6, sport: 'basketball', icon: '🏀', league: 'NBA' }
  ];

  const matches = sportFilter === 'all' ? allMatches : allMatches.filter(m => m.sport === sportFilter);

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

    soundManager.play('click');
    onBalanceChange(-bet);
    setActiveBet({ match: matchIdx, outcome, odds });

    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        soundManager.play('win');
        const winAmount = Math.floor(bet * odds);
        onBalanceChange(winAmount);
        toast.success(`✅ Ставка сыграла! Выигрыш ${winAmount} ₽`);
      } else {
        soundManager.play('lose');
        toast.error('❌ Ставка не сыграла');
      }
      setActiveBet(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 mb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gold-text">Ставки на спорт</h2>
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-48 bg-[#1a1a1a] border-primary/30">
            <SelectValue placeholder="Все виды спорта" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-primary/30">
            <SelectItem value="all">Все виды</SelectItem>
            <SelectItem value="football">⚽ Футбол</SelectItem>
            <SelectItem value="hockey">🏒 Хоккей</SelectItem>
            <SelectItem value="basketball">🏀 Баскетбол</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
          <Card key={idx} className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{match.icon}</span>
                <div>
                  <p className="text-xs text-primary font-semibold">{match.league}</p>
                  <p className="font-bold text-lg">{match.team1} vs {match.team2}</p>
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