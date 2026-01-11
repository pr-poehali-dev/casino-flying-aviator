-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  balance DECIMAL(12, 2) DEFAULT 0,
  total_wagered DECIMAL(12, 2) DEFAULT 0,
  total_won DECIMAL(12, 2) DEFAULT 0,
  vip_level INTEGER DEFAULT 1,
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  claimed_bonuses TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Таблица игр
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  min_bet DECIMAL(10, 2) DEFAULT 10,
  max_bet DECIMAL(10, 2) DEFAULT 100000,
  rtp DECIMAL(5, 2) DEFAULT 96.00,
  settings JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ставок
CREATE TABLE IF NOT EXISTS bets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  game_id INTEGER REFERENCES games(id),
  game_name VARCHAR(100),
  bet_amount DECIMAL(10, 2) NOT NULL,
  win_amount DECIMAL(10, 2) DEFAULT 0,
  multiplier DECIMAL(10, 2),
  is_win BOOLEAN DEFAULT FALSE,
  game_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица настроек казино
CREATE TABLE IF NOT EXISTS casino_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории балансов
CREATE TABLE IF NOT EXISTS balance_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(10, 2),
  balance_after DECIMAL(10, 2),
  transaction_type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_game_id ON bets(game_id);
CREATE INDEX IF NOT EXISTS idx_bets_created_at ON bets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_balance_history_user_id ON balance_history(user_id);

-- Вставка начальных настроек
INSERT INTO casino_settings (setting_key, setting_value, description) VALUES
('min_bet', '10', 'Минимальная ставка'),
('max_bet', '100000', 'Максимальная ставка'),
('jackpot_vip_slot', '125000', 'Джекпот VIP слота'),
('welcome_bonus', '500', 'Приветственный бонус')
ON CONFLICT (setting_key) DO NOTHING;

-- Вставка игр
INSERT INTO games (name, type, is_active, min_bet, max_bet, rtp, settings) VALUES
('Фрукты', 'slot', true, 10, 5000, 96.50, '{"symbols": 6, "reels": 3}'),
('Рыбка', 'slot', true, 10, 5000, 96.00, '{"symbols": 6, "reels": 3}'),
('Собачка', 'slot', true, 10, 5000, 95.80, '{"symbols": 6, "reels": 3}'),
('Сокровища', 'slot', true, 50, 10000, 97.00, '{"symbols": 6, "reels": 3}'),
('Космос', 'slot', true, 20, 8000, 95.50, '{"symbols": 6, "reels": 3}'),
('Драконы', 'slot', true, 50, 15000, 94.80, '{"symbols": 6, "reels": 3}'),
('Фрукты VIP', 'slot_vip', true, 50, 50000, 98.00, '{"symbols": 8, "reels": 5, "jackpot": true}'),
('Авиатор', 'aviator', true, 10, 10000, 97.00, '{"max_multiplier": 100, "crash_chance": 0.02}'),
('AviaMaster', 'aviamaster', true, 10, 5000, 96.00, '{"obstacles": true, "bonuses": true}'),
('Шахты', 'mines', true, 10, 5000, 96.50, '{"grid_size": 25, "bombs": 5}'),
('Башня', 'tower', true, 10, 5000, 95.80, '{"levels": 10, "cells_per_level": 3}'),
('Кейсы', 'cases', true, 100, 1000, 95.00, '{"price": 100, "items": 5}'),
('Спорт', 'sport', true, 10, 50000, 95.00, '{"sports": ["football", "hockey", "basketball"]}')
ON CONFLICT (name) DO NOTHING;

-- Создание админа
INSERT INTO users (username, email, password_hash, balance, is_admin, is_active) VALUES
('admin', 'admin@casino.com', 'admin_hash', 1000000, true, true)
ON CONFLICT (username) DO NOTHING;
