import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { WinRecord } from './types';

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

export function SlotsSection() {
  const slots = [
    { name: 'Фрукты', icon: '🍒', multiplier: 'x500', popularity: 98 },
    { name: 'Рыбка', icon: '🐠', multiplier: 'x750', popularity: 95 },
    { name: 'Собачка', icon: '🐕', multiplier: 'x1000', popularity: 92 }
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
              <Button className="w-full gold-gradient text-black font-bold">
                Играть
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AviatorSection() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    if (isFlying) {
      const interval = setInterval(() => {
        setMultiplier(prev => {
          const next = prev + 0.01;
          if (next > 10 && Math.random() > 0.7) {
            setIsFlying(false);
            return 1.00;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isFlying]);

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Авиатор</h2>
      <Card className="bg-[#1a1a1a] border-primary/20 p-8">
        <div className="relative h-96 bg-gradient-to-b from-blue-900/20 to-transparent rounded-xl flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">✈️</div>
            <div className="text-6xl font-bold gold-text">{multiplier.toFixed(2)}x</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
            <Input type="number" placeholder="100" className="bg-[#0a0a0a] border-primary/30" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Авто-выход</label>
            <Input type="number" placeholder="2.00x" className="bg-[#0a0a0a] border-primary/30" />
          </div>
        </div>
        <Button 
          onClick={() => setIsFlying(!isFlying)} 
          className="w-full mt-4 gold-gradient text-black font-bold text-lg py-6"
        >
          {isFlying ? 'Забрать выигрыш' : 'Начать полёт'}
        </Button>
      </Card>
    </div>
  );
}

export function MinecraftSection() {
  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Майнкрафт</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { name: 'Шахты', icon: '⛏️', desc: 'Откройте клетки и найдите алмазы' },
          { name: 'Башня', icon: '🗼', desc: 'Поднимайтесь выше для больших призов' },
          { name: 'Кейсы', icon: '📦', desc: 'Откройте кейсы с редкими предметами' }
        ].map(game => (
          <Card key={game.name} className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all cursor-pointer">
            <div className="text-6xl mb-4">{game.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
            <p className="text-muted-foreground mb-4">{game.desc}</p>
            <Button className="w-full gold-gradient text-black font-bold">Играть</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SportSection() {
  const matches = [
    { team1: 'Спартак', team2: 'ЦСКА', odds1: 2.1, oddsX: 3.2, odds2: 2.8, sport: '⚽' },
    { team1: 'Лейкерс', team2: 'Уориорз', odds1: 1.8, oddsX: null, odds2: 1.9, sport: '🏀' }
  ];

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Ставки на спорт</h2>
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
              <Button variant="outline" className="border-primary/30 hover:gold-gradient hover:text-black">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">П1</div>
                  <div className="font-bold">{match.odds1}</div>
                </div>
              </Button>
              {match.oddsX && (
                <Button variant="outline" className="border-primary/30 hover:gold-gradient hover:text-black">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">X</div>
                    <div className="font-bold">{match.oddsX}</div>
                  </div>
                </Button>
              )}
              <Button variant="outline" className="border-primary/30 hover:gold-gradient hover:text-black">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">П2</div>
                  <div className="font-bold">{match.odds2}</div>
                </div>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BonusesSection() {
  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Бонусы</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Приветственный бонус', amount: '+100%', desc: 'На первый депозит до 50 000 ₽', icon: 'Gift' },
          { title: 'Кэшбэк', amount: '15%', desc: 'Еженедельный возврат проигрышей', icon: 'RefreshCw' },
          { title: 'Фриспины', amount: '50 FS', desc: 'За регистрацию на слот месяца', icon: 'Sparkles' },
          { title: 'VIP программа', amount: 'до 25%', desc: 'Эксклюзивные привилегии', icon: 'Crown' }
        ].map(bonus => (
          <Card key={bonus.title} className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 gold-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name={bonus.icon as any} size={28} className="text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{bonus.title}</h3>
                <p className="text-2xl gold-text font-bold mb-2">{bonus.amount}</p>
                <p className="text-sm text-muted-foreground mb-4">{bonus.desc}</p>
                <Button className="gold-gradient text-black font-semibold">Получить</Button>
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
