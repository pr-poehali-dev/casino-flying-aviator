import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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
