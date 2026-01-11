export type User = {
  id: string;
  username: string;
  balance: number;
  isAdmin: boolean;
};

export type WinRecord = {
  username: string;
  game: string;
  amount: number;
  time: string;
};
