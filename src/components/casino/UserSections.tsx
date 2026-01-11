import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { User } from './types';

export function ProfileSection({ user, onDeposit }: { user: User, onDeposit: (amount: number) => void }) {
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

export function AdminPanel() {
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
