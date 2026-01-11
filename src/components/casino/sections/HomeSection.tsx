import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { WinRecord } from '../types';

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
