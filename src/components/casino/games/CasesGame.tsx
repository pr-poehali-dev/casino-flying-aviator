import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

type CaseItem = {
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  multiplier: number;
};

const caseItems: CaseItem[] = [
  { name: 'Уголь', icon: '🪨', rarity: 'common', multiplier: 0.5 },
  { name: 'Железо', icon: '⚙️', rarity: 'common', multiplier: 1 },
  { name: 'Золото', icon: '🪙', rarity: 'rare', multiplier: 3 },
  { name: 'Изумруд', icon: '💚', rarity: 'epic', multiplier: 10 },
  { name: 'Алмаз', icon: '💎', rarity: 'legendary', multiplier: 50 },
];

const rarityColors = {
  common: 'border-gray-500 bg-gray-900/30',
  rare: 'border-blue-500 bg-blue-900/30',
  epic: 'border-purple-500 bg-purple-900/30',
  legendary: 'border-yellow-500 bg-yellow-900/30'
};

export function CasesGame({ onClose, balance, onBalanceChange }: { onClose: () => void; balance: number; onBalanceChange: (amount: number) => void }) {
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);
  const casePrice = 100;

  const openCase = () => {
    if (balance < casePrice) {
      toast.error('Недостаточно средств');
      return;
    }

    onBalanceChange(-casePrice);
    setIsOpening(true);
    setWonItem(null);

    const random = Math.random();
    let item: CaseItem;

    if (random < 0.01) {
      item = caseItems[4];
    } else if (random < 0.05) {
      item = caseItems[3];
    } else if (random < 0.20) {
      item = caseItems[2];
    } else if (random < 0.50) {
      item = caseItems[1];
    } else {
      item = caseItems[0];
    }

    setTimeout(() => {
      setWonItem(item);
      setIsOpening(false);
      
      const winAmount = Math.floor(casePrice * item.multiplier);
      if (winAmount > casePrice) {
        onBalanceChange(winAmount);
        toast.success(`Выигрыш ${winAmount} ₽! (${item.name})`);
      } else if (winAmount === casePrice) {
        onBalanceChange(winAmount);
        toast.info(`Возврат ставки! (${item.name})`);
      } else {
        onBalanceChange(winAmount);
        toast.error(`Выпало: ${item.name}`);
      }
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gold-text">Кейсы 📦</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Баланс:</span>
            <span className="text-xl font-bold gold-text">{balance.toLocaleString()} ₽</span>
          </div>

          <Card className="bg-[#1a1a1a] border-primary/20 p-8">
            <div className="text-center mb-6">
              <div className={`text-9xl mb-4 ${isOpening ? 'animate-bounce' : ''}`}>📦</div>
              {wonItem && !isOpening && (
                <div className="space-y-4 animate-scale-in">
                  <div className="text-8xl">{wonItem.icon}</div>
                  <div>
                    <p className="text-2xl font-bold">{wonItem.name}</p>
                    <Badge className={`mt-2 ${rarityColors[wonItem.rarity]}`}>
                      {wonItem.rarity === 'common' ? 'Обычный' :
                       wonItem.rarity === 'rare' ? 'Редкий' :
                       wonItem.rarity === 'epic' ? 'Эпический' :
                       'Легендарный'}
                    </Badge>
                    <p className="text-xl gold-text font-bold mt-2">
                      x{wonItem.multiplier} ({Math.floor(casePrice * wonItem.multiplier)} ₽)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={openCase}
              disabled={isOpening || balance < casePrice}
              className="w-full gold-gradient text-black font-bold text-lg py-6"
            >
              {isOpening ? 'Открываем...' : `Открыть кейс (${casePrice} ₽)`}
            </Button>
          </Card>

          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-primary/20">
            <h3 className="font-bold mb-3 text-center">Содержимое кейса</h3>
            <div className="space-y-2">
              {caseItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${rarityColors[item.rarity]}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.rarity === 'common' ? 'Обычный (49%)' :
                         item.rarity === 'rare' ? 'Редкий (30%)' :
                         item.rarity === 'epic' ? 'Эпический (15%)' :
                         'Легендарный (1%)'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold gold-text">x{item.multiplier}</p>
                    <p className="text-xs text-muted-foreground">{Math.floor(casePrice * item.multiplier)} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
