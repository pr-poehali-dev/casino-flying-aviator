import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, WinRecord } from '@/components/casino/types';
import { Header } from '@/components/casino/Header';
import { WinsFooter } from '@/components/casino/WinsFooter';
import { 
  HomeSection, 
  SlotsSection, 
  AviatorSection, 
  MinecraftSection, 
  SportSection, 
  BonusesSection, 
  SupportSection 
} from '@/components/casino/GameSections';
import { ProfileSection, AdminPanel } from '@/components/casino/UserSections';

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
      <Header 
        currentUser={currentUser}
        onlineCount={onlineCount}
        activeSection={activeSection}
        onLogin={handleLogin}
        onAdminLogin={handleAdminLogin}
        onNavigate={setActiveSection}
      />

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

      <WinsFooter recentWins={recentWins} />
    </div>
  );
}
