-- expenses-schema.sql

-- Drop the table if it exists to ensure a clean slate. CASCADE drops dependent objects like policies.
DROP TABLE IF EXISTS expenses CASCADE;

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  category TEXT,
  description TEXT,
  amount NUMERIC NOT NULL,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own expenses" ON expenses
  FOR ALL
  USING (auth.uid() = user_id);