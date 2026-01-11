import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from './types';

type HeaderProps = {
  currentUser: User | null;
  onlineCount: number;
  activeSection: string;
  onLogin: () => void;
  onAdminLogin: () => void;
  onNavigate: (section: string) => void;
};

export function Header({ currentUser, onlineCount, activeSection, onLogin, onAdminLogin, onNavigate }: HeaderProps) {
  return (
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
                <Button onClick={onLogin} className="gold-gradient text-black font-semibold hover:opacity-90">
                  Войти
                </Button>
                <Button onClick={onAdminLogin} variant="outline" size="icon">
                  <Icon name="Shield" size={18} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{currentUser.username}</p>
                  <p className="text-xs gold-text font-bold">{currentUser.balance.toLocaleString()} ₽</p>
                </div>
                <Button onClick={() => onNavigate('profile')} size="icon" className="gold-gradient text-black">
                  <Icon name="User" size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['home', 'slots', 'aviator', 'aviamaster', 'minecraft', 'sport', 'bonuses', 'support'].map(section => (
            <Button
              key={section}
              onClick={() => onNavigate(section)}
              variant={activeSection === section ? 'default' : 'ghost'}
              className={activeSection === section ? 'gold-gradient text-black' : ''}
            >
              <Icon 
                name={
                  section === 'home' ? 'Home' :
                  section === 'slots' ? 'Cherry' :
                  section === 'aviator' ? 'Plane' :
                  section === 'aviamaster' ? 'Rocket' :
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
                section === 'aviamaster' ? 'AviaMaster' :
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
  );
}