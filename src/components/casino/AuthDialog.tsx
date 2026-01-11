import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type AuthDialogProps = {
  onClose: () => void;
  onLogin: (username: string, isAdmin?: boolean) => void;
};

export function AuthDialog({ onClose, onLogin }: AuthDialogProps) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLogin = () => {
    if (!loginUsername || !loginPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (loginUsername === 'admin' && loginPassword === 'admin') {
      onLogin('Администратор', true);
      toast.success('Вход в панель администратора');
      onClose();
      return;
    }

    onLogin(loginUsername);
    toast.success(`Добро пожаловать, ${loginUsername}!`);
    onClose();
  };

  const handleRegister = () => {
    if (!regUsername || !regEmail || !regPassword || !regConfirmPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (regPassword.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      toast.error('Неверный формат email');
      return;
    }

    onLogin(regUsername);
    toast.success(`Регистрация успешна! Добро пожаловать, ${regUsername}!`);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gold-text text-center">ROYAL CASINO</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a]">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Имя пользователя</label>
                <Input 
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Введите имя"
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Пароль</label>
                <Input 
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>

              <Button onClick={handleLogin} className="w-full gold-gradient text-black font-bold">
                Войти
              </Button>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>Тестовый доступ:</p>
                <p>Игрок: любое имя + пароль</p>
                <p>Админ: admin / admin</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Имя пользователя</label>
                <Input 
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Придумайте имя"
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                <Input 
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Пароль</label>
                <Input 
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Подтвердите пароль</label>
                <Input 
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  className="bg-[#1a1a1a] border-primary/30"
                />
              </div>

              <Button onClick={handleRegister} className="w-full gold-gradient text-black font-bold">
                Зарегистрироваться
              </Button>

              <div className="bg-[#1a1a1a] rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Icon name="Gift" size={24} className="text-primary flex-shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Бонус за регистрацию:</p>
                    <p className="text-muted-foreground">+5000 ₽ на счет</p>
                    <p className="text-muted-foreground">+50 фриспинов</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
