CREATE TABLE IF NOT EXISTS wage_gap (
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  session_data JSONB,
  participants JSONB,
  PRIMARY KEY (session_id, created_at)
);
