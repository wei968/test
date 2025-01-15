const express = require('express');
const db = require('./database');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// 获取所有学生信息
app.get('/api/students', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM StudentInfo');
    res.json(results);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve student data' });
  }
});

// 添加学生信息
app.post('/api/students', async (req, res) => {
  const { studentID, name, gender, birthdate, address, contact } = req.body;

  if (!studentID || !name || !gender || !birthdate || !address || !contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = 'INSERT INTO StudentInfo (StudentID, Name, Gender, Birthdate, Address, Contact) VALUES (?, ?, ?, ?, ?, ?)';
    await db.promise().query(query, [studentID, name, gender, birthdate, address, contact]);
    res.status(201).json({ message: 'Student added successfully!' });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'Failed to add student data' });
  }
});

// 删除学生信息
app.delete('/api/students/:id', async (req, res) => {
  const studentID = req.params.id;

  if (!studentID) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    const [result] = await db.promise().query('DELETE FROM StudentInfo WHERE StudentID = ?', [studentID]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully!' });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'Failed to delete student data' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
