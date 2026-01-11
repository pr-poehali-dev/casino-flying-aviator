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
    }
  ];



  return (
    <div className="space-y-6 mb-32">
      <h2 className="text-3xl font-bold gold-text">Бонусы</h2>
      
      <div className="grid md:grid-cols-1 gap-6">
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