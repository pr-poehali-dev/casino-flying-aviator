import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { WinRecord } from './types';

type WinsFooterProps = {
  recentWins: WinRecord[];
};

export function WinsFooter({ recentWins }: WinsFooterProps) {
  return (
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
  );
}
