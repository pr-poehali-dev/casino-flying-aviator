export type User = {
  id: string;
  username: string;
  balance: number;
  isAdmin: boolean;
  claimedBonuses: string[];
  totalWagered: number;
  vipLevel: number;
  registeredAt: string;
};

export type WinRecord = {
  username: string;
  game: string;
  amount: number;
  time: string;
};