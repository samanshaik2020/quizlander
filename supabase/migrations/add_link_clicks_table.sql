-- Create link_clicks table for tracking completion page button clicks
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  button_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_link_clicks_quiz_id ON link_clicks(quiz_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_created_at ON link_clicks(created_at);

-- Enable RLS
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for tracking clicks from public quiz pages)
CREATE POLICY "Anyone can insert link clicks" ON link_clicks
  FOR INSERT
  WITH CHECK (true);

-- Allow quiz authors to read their own quiz's clicks
CREATE POLICY "Quiz authors can read their quiz clicks" ON link_clicks
  FOR SELECT
  USING (
    quiz_id IN (
      SELECT id FROM quizzes WHERE author_id = auth.uid()
    )
  );
