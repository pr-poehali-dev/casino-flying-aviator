import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type User = {
  id: string;
  username: string;
  balance: number;
  isAdmin: boolean;
};

type WinRecord = {
  username: string;
  game: string;
  amount: number;
  time: string;
};

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [onlineCount, setOnlineCount] = useState(1247);
  const [recentWins, setRecentWins] = useState<WinRecord[]>([
    { username: 'Игрок***123', game: 'Авиатор', amount: 15000, time: '2 мин назад' },
    { username: 'Lucky***777', game: 'Слот Фрукты', amount: 8500, time: '5 мин назад' },
    { username: 'Gold***999', game: 'Слот Рыбка', amount: 12000, time: '8 мин назад' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setCurrentUser({
      id: '1',
      username: 'Игрок123',
      balance: 5000,
      isAdmin: false
    });
    toast.success('Добро пожаловать в казино!');
  };

  const handleAdminLogin = () => {
    setCurrentUser({
      id: 'admin',
      username: 'Администратор',
      balance: 0,
      isAdmin: true
    });
    setActiveSection('admin');
    toast.success('Вход в панель администратора');
  };

  const handleDeposit = (amount: number) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, balance: currentUser.balance + amount });
      toast.success(`Баланс пополнен на ${amount} ₽`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center">
                <Icon name="Crown" size={28} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gold-text">ROYAL CASINO</h1>
                <p className="text-xs text-muted-foreground">Элитный игровой клуб</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">{onlineCount} онлайн</span>
              </div>

              {!currentUser ? (
                <div className="flex gap-2">
                  <Button onClick={handleLogin} className="gold-gradient text-black font-semibold hover:opacity-90">
                    Войти
                  </Button>
                  <Button onClick={handleAdminLogin} variant="outline" size="icon">
                    <Icon name="Shield" size={18} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{currentUser.username}</p>
                    <p className="text-xs gold-text font-bold">{currentUser.balance.toLocaleString()} ₽</p>
                  </div>
                  <Button onClick={() => setActiveSection('profile')} size="icon" className="gold-gradient text-black">
                    <Icon name="User" size={18} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['home', 'slots', 'aviator', 'minecraft', 'sport', 'bonuses', 'support'].map(section => (
              <Button
                key={section}
                onClick={() => setActiveSection(section)}
                variant={activeSection === section ? 'default' : 'ghost'}
                className={activeSection === section ? 'gold-gradient text-black' : ''}
              >
                <Icon 
                  name={
                    section === 'home' ? 'Home' :
                    section === 'slots' ? 'Cherry' :
                    section === 'aviator' ? 'Plane' :
                    section === 'minecraft' ? 'Box' :
                    section === 'sport' ? 'Trophy' :
                    section === 'bonuses' ? 'Gift' :
                    'MessageCircle'
                  } 
                  size={16} 
                />
                <span className="ml-2 capitalize">{
                  section === 'home' ? 'Главная' :
                  section === 'slots' ? 'Слоты' :
                  section === 'aviator' ? 'Авиатор' :
                  section === 'minecraft' ? 'Майнкрафт' :
                  section === 'sport' ? 'Спорт' :
                  section === 'bonuses' ? 'Бонусы' :
                  'Поддержка'
                }</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && <HomeSection recentWins={recentWins} onNavigate={setActiveSection} />}
        {activeSection === 'slots' && <SlotsSection />}
        {activeSection === 'aviator' && <AviatorSection />}
        {activeSection === 'minecraft' && <MinecraftSection />}
        {activeSection === 'sport' && <SportSection />}
        {activeSection === 'bonuses' && <BonusesSection />}
        {activeSection === 'support' && <SupportSection />}
        {activeSection === 'profile' && currentUser && <ProfileSection user={currentUser} onDeposit={handleDeposit} />}
        {activeSection === 'admin' && currentUser?.isAdmin && <AdminPanel />}
      </main>

      <aside className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] p-4">
        <div className="container mx-auto">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            Последние выигрыши
          </h3>
          <div className="flex gap-4 overflow-x-auto">
            {recentWins.map((win, idx) => (
              <Card key={idx} className="flex-shrink-0 bg-[#1a1a1a] border-primary/20 p-3 min-w-[250px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{win.username}</p>
                    <p className="text-xs text-muted-foreground">{win.game}</p>
                  </div>
                  <div className="text-right">
                    <p className="gold-text font-bold text-lg">+{win.amount.toLocaleString()} ₽</p>
                    <p className="text-xs text-muted-foreground">{win.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function HomeSection({ recentWins, onNavigate }: { recentWins: WinRecord[], onNavigate: (section: string) => void }) {
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

function SlotsSection() {
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

function AviatorSection() {
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

function MinecraftSection() {
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

function SportSection() {
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

function BonusesSection() {
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

function SupportSection() {
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

function ProfileSection({ user, onDeposit }: { user: User, onDeposit: (amount: number) => void }) {
  const [depositAmount, setDepositAmount] = useState('');

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Личный кабинет</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-primary/20 p-6">
          <h3 className="text-xl font-bold mb-4">Баланс</h3>
          <div className="text-4xl font-bold gold-text mb-6">{user.balance.toLocaleString()} ₽</div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Сумма пополнения</label>
              <Input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="1000" 
                className="bg-[#0a0a0a] border-primary/30"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 5000, 10000].map(amount => (
                <Button 
                  key={amount} 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDepositAmount(amount.toString())}
                  className="border-primary/30"
                >
                  {amount}
                </Button>
              ))}
            </div>
            <Button 
              onClick={() => {
                const amount = parseInt(depositAmount);
                if (amount > 0) {
                  onDeposit(amount);
                  setDepositAmount('');
                }
              }}
              className="w-full gold-gradient text-black font-bold"
              disabled={!depositAmount || parseInt(depositAmount) <= 0}
            >
              Пополнить
            </Button>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-primary/20 p-6">
          <h3 className="text-xl font-bold mb-4">Статистика</h3>
          <div className="space-y-4">
            {[
              { label: 'Всего ставок', value: '247', icon: 'TrendingUp' },
              { label: 'Выигрышей', value: '156', icon: 'Trophy' },
              { label: 'Общий выигрыш', value: '125 000 ₽', icon: 'DollarSign' },
              { label: 'Уровень', value: 'Silver', icon: 'Star' }
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name={stat.icon as any} size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="space-y-6 mb-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={24} className="text-black" />
        </div>
        <h2 className="text-3xl font-bold gold-text">Панель администратора</h2>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="bg-[#1a1a1a]">
          <TabsTrigger value="stats">Статистика</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="games">Игры</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Активных игроков', value: '1,247', change: '+12%', icon: 'Users' },
              { label: 'Доход за день', value: '2.4M ₽', change: '+8%', icon: 'DollarSign' },
              { label: 'Всего ставок', value: '15,892', change: '+15%', icon: 'TrendingUp' },
              { label: 'Выплачено', value: '1.8M ₽', change: '+5%', icon: 'ArrowDownToLine' }
            ].map(stat => (
              <Card key={stat.label} className="bg-[#1a1a1a] border-primary/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon name={stat.icon as any} size={20} className="text-primary" />
                  <Badge variant="outline" className="text-xs text-green-500 border-green-500">{stat.change}</Badge>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-[#1a1a1a] border-primary/20">
            <div className="p-4 border-b border-[#0a0a0a]">
              <Input placeholder="Поиск пользователей..." className="bg-[#0a0a0a] border-primary/30" />
            </div>
            <div className="divide-y divide-[#0a0a0a]">
              {[
                { username: 'Игрок123', balance: 5000, status: 'Онлайн', bets: 45 },
                { username: 'Lucky777', balance: 12000, status: 'Онлайн', bets: 89 },
                { username: 'Gold999', balance: 3500, status: 'Оффлайн', bets: 23 }
              ].map(user => (
                <div key={user.username} className="p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.bets} ставок</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{user.balance.toLocaleString()} ₽</p>
                      <Badge variant={user.status === 'Онлайн' ? 'default' : 'outline'} className="text-xs">
                        {user.status}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Icon name="MoreVertical" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Слот Фрукты', status: 'Активен', players: 145, rtp: '96.5%' },
              { name: 'Авиатор', status: 'Активен', players: 234, rtp: '97.0%' },
              { name: 'Слот Рыбка', status: 'Активен', players: 98, rtp: '95.8%' }
            ].map(game => (
              <Card key={game.name} className="bg-[#1a1a1a] border-primary/20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{game.name}</h3>
                  <Badge className="gold-gradient text-black">{game.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Игроков</p>
                    <p className="font-semibold">{game.players}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RTP</p>
                    <p className="font-semibold">{game.rtp}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-primary/30">
                  Настроить
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-[#1a1a1a] border-primary/20 p-6">
            <h3 className="text-xl font-bold mb-4">Общие настройки</h3>
            <div className="space-y-4">
              {[
                { label: 'Минимальная ставка', value: '10 ₽' },
                { label: 'Максимальная ставка', value: '100 000 ₽' },
                { label: 'Комиссия платформы', value: '5%' },
                { label: 'Лимит вывода в день', value: '500 000 ₽' }
              ].map(setting => (
                <div key={setting.label} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                  <span className="text-sm">{setting.label}</span>
                  <div className="flex items-center gap-2">
                    <Input value={setting.value} className="w-32 h-8 text-sm bg-transparent border-primary/30" />
                    <Button size="sm" className="gold-gradient text-black">
                      <Icon name="Check" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
