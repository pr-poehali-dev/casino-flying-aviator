import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, WinRecord } from '@/components/casino/types';
import { Header } from '@/components/casino/Header';
import { WinsFooter } from '@/components/casino/WinsFooter';
import { AuthDialog } from '@/components/casino/AuthDialog';
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
  const [showAuth, setShowAuth] = useState(false);
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

  const handleLogin = (username: string, isAdmin?: boolean) => {
    setCurrentUser({
      id: isAdmin ? 'admin' : Math.random().toString(),
      username,
      balance: 5000,
      isAdmin: isAdmin || false
    });

    if (isAdmin) {
      setActiveSection('admin');
    }
  };

  const handleAdminLogin = () => {
    setShowAuth(true);
  };

  const handleBalanceChange = (amount: number) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, balance: currentUser.balance + amount });
    }
  };

  const handleDeposit = (amount: number) => {
    handleBalanceChange(amount);
    toast.success(`Баланс пополнен на ${amount} ₽`);
  };

  const handleClaimBonus = (amount: number) => {
    handleBalanceChange(amount);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header 
        currentUser={currentUser}
        onlineCount={onlineCount}
        activeSection={activeSection}
        onLogin={() => setShowAuth(true)}
        onAdminLogin={handleAdminLogin}
        onNavigate={setActiveSection}
      />

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && <HomeSection recentWins={recentWins} onNavigate={setActiveSection} />}
        {activeSection === 'slots' && currentUser && (
          <SlotsSection 
            balance={currentUser.balance} 
            onBalanceChange={handleBalanceChange}
          />
        )}
        {activeSection === 'aviator' && currentUser && (
          <AviatorSection 
            balance={currentUser.balance} 
            onBalanceChange={handleBalanceChange}
          />
        )}
        {activeSection === 'minecraft' && currentUser && (
          <MinecraftSection 
            balance={currentUser.balance} 
            onBalanceChange={handleBalanceChange}
          />
        )}
        {activeSection === 'sport' && currentUser && (
          <SportSection 
            balance={currentUser.balance} 
            onBalanceChange={handleBalanceChange}
          />
        )}
        {activeSection === 'bonuses' && currentUser && (
          <BonusesSection onClaimBonus={handleClaimBonus} />
        )}
        {activeSection === 'support' && <SupportSection />}
        {activeSection === 'profile' && currentUser && (
          <ProfileSection user={currentUser} onDeposit={handleDeposit} />
        )}
        {activeSection === 'admin' && currentUser?.isAdmin && <AdminPanel />}

        {(activeSection !== 'home' && activeSection !== 'support' && !currentUser) && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold gold-text mb-4">Войдите, чтобы играть</h2>
            <button 
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 gold-gradient text-black font-bold rounded-lg"
            >
              Войти или зарегистрироваться
            </button>
          </div>
        )}
      </main>

      <WinsFooter recentWins={recentWins} />

      {showAuth && (
        <AuthDialog 
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
