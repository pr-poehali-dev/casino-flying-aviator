import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';
import { User } from '../types';

type BonusesSectionProps = {
  onClaimBonus: (id: string, amount: number) => void;
  user: User;
};

export function BonusesSection({ onClaimBonus, user }: BonusesSectionProps) {
  const claimBonus = (id: string, amount: number, isOneTime: boolean) => {
    if (isOneTime && user.claimedBonuses.includes(id)) {
      toast.error('Этот бонус можно получить только один раз');
      return;
    }
    
    soundManager.play('bonus');
    onClaimBonus(id, amount);
    toast.success(`🎁 Получено ${amount} ₽!`);
  };

  const bonuses = [
    { 
      id: 'welcome', 
      title: 'Приветственный бонус', 
      amount: 500, 
      desc: 'Одноразовый бонус за регистрацию', 
      icon: 'Gift',
      oneTime: true,
      claimed: user.claimedBonuses.includes('welcome')
    },
    { 
      id: 'cashback', 
      title: 'Кэшбэк 5%', 
      amount: 100, 
      desc: 'Еженедельный возврат от проигрышей', 
      icon: 'RefreshCw',
      oneTime: false,
      claimed: false
    },
    { 
      id: 'freespins', 
      title: '10 фриспинов', 
      amount: 10, 
      desc: 'Бесплатные вращения на популярные слоты', 
      icon: 'Sparkles',
      oneTime: false,
      claimed: false
    },
    { 
      id: 'vip', 
      title: 'VIP статус', 
      amount: 10, 
      desc: 'Эксклюзивные привилегии и бонусы', 
      icon: 'Crown',
      oneTime: false,
      claimed: false
    }
  ];

  const vipLevels = [
    { level: 1, name: 'Бронза', required: 0, bonus: 100 },
    { level: 2, name: 'Серебро', required: 10000, bonus: 500 },
    { level: 3, name: 'Золото', required: 50000, bonus: 2000 },
    { level: 4, name: 'Платина', required: 150000, bonus: 5000 },
    { level: 5, name: 'Алмаз', required: 500000, bonus: 15000 }
  ];

  const currentVip = vipLevels.find(v => user.totalWagered >= v.required && user.totalWagered < (vipLevels[v.level]?.required || Infinity)) || vipLevels[0];
  const nextVip = vipLevels[currentVip.level];
  const progress = nextVip ? ((user.totalWagered - currentVip.required) / (nextVip.required - currentVip.required)) * 100 : 100;

  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Бонусы и программа лояльности</h2>

      <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold gold-text mb-1">VIP Статус: {currentVip.name}</h3>
            <p className="text-sm text-muted-foreground">
              Сделано ставок на сумму: {user.totalWagered.toLocaleString()} ₽
            </p>
          </div>
          <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center">
            <Icon name="Crown" size={32} className="text-black" />
          </div>
        </div>
        
        {nextVip && (
          <>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>До {nextVip.name}</span>
                <span className="gold-text font-bold">{nextVip.required.toLocaleString()} ₽</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              Осталось: {(nextVip.required - user.totalWagered).toLocaleString()} ₽
            </p>
          </>
        )}
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        {bonuses.map(bonus => (
          <Card key={bonus.id} className="bg-[#1a1a1a] border-primary/20 p-6 hover:border-primary transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 gold-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name={bonus.icon as any} size={28} className="text-black" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{bonus.title}</h3>
                  {bonus.oneTime && <Badge variant="outline" className="text-xs">Разовый</Badge>}
                </div>
                <p className="text-2xl gold-text font-bold mb-2">
                  {bonus.id === 'freespins' ? `${bonus.amount} вращений` : `+${bonus.amount} ₽`}
                </p>
                <p className="text-sm text-muted-foreground mb-4">{bonus.desc}</p>
                <Button 
                  onClick={() => claimBonus(bonus.id, bonus.amount, bonus.oneTime)}
                  disabled={bonus.claimed}
                  className="gold-gradient text-black font-semibold"
                >
                  {bonus.claimed ? '✓ Получено' : 'Получить'}
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