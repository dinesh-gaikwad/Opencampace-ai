CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  level VARCHAR(40) NOT NULL,
  description TEXT NOT NULL,
  duration_label VARCHAR(60) NOT NULL,
  lessons_count INTEGER NOT NULL DEFAULT 0 CHECK (lessons_count >= 0),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_featured ON courses(featured);

INSERT INTO courses (slug, title, category, level, description, duration_label, lessons_count, featured) VALUES
('java-foundations', 'Java Foundations', 'Programming', 'Beginner', 'Learn variables, types, operators, conditions, loops, methods, and object-oriented programming through short lessons and practice.', '4 weeks', 28, TRUE),
('full-stack-java', 'Full Stack Java Developer', 'Career Path', 'Beginner to Intermediate', 'Build web applications with Java, Spring Boot, REST APIs, PostgreSQL, React, testing, and deployment.', '12 weeks', 64, TRUE),
('sql-essentials', 'SQL Essentials', 'Database', 'Beginner', 'Learn relational data, SELECT, filtering, joins, grouping, constraints, and practical database design.', '2 weeks', 18, TRUE),
('web-basics', 'Web Development Basics', 'Web Development', 'Beginner', 'Understand HTML, CSS, JavaScript, responsive design, accessibility, and how the web works.', '3 weeks', 22, FALSE),
('ai-for-learners', 'AI Study Skills', 'Artificial Intelligence', 'Beginner', 'Learn how to ask better questions, verify AI output, practise with AI, and study responsibly.', '1 week', 10, FALSE);
