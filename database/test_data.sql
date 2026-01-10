
-- Questions
INSERT INTO Question (ID_Question, Question_Text, Question_Points, Question_Category) VALUES
(1, 'What does CPU stand for?', 10, 'Computer Basics'),
(2, 'Which language is primarily used for web development?', 10, 'Programming'),
(3, 'What is the main purpose of RAM?', 10, 'Hardware'),
(4, 'Which protocol is used to transfer web pages?', 10, 'Networking'),
(5, 'What does SQL stand for?', 10, 'Databases');

-- Answers

INSERT INTO Answers (ID_Question, ID_Answer, Answer_Text, Is_Correct) VALUES
-- Question 1
(1, 1, 'Central Processing Unit', 1),
(1, 2, 'Computer Personal Unit', 0),
(1, 3, 'Central Program Utility', 0),
(1, 4, 'Control Processing Unit', 0),

-- Question 2
(2, 1, 'JavaScript', 1),
(2, 2, 'Assembly', 0),
(2, 3, 'C', 0),
(2, 4, 'Fortran', 0),

-- Question 3
(3, 1, 'To temporarily store data for quick access', 1),
(3, 2, 'To permanently store files', 0),
(3, 3, 'To cool down the processor', 0),
(3, 4, 'To power the computer', 0),

-- Question 4
(4, 1, 'HTTP', 1),
(4, 2, 'FTP', 0),
(4, 3, 'SMTP', 0),
(4, 4, 'SSH', 0),

-- Question 5
(5, 1, 'Structured Query Language', 1),
(5, 2, 'Simple Question Language', 0),
(5, 3, 'Sequential Query Logic', 0),
(5, 4, 'Standard Question List', 0);
