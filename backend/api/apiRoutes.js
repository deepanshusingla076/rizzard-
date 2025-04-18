const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const checkUserCredentials = (username, password) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../db/users.json'), 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      
      try {
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);
        resolve(user || null);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).render('login', { 
        error: 'Username and password are required',
        username: username || '' 
      });
    }
    
    const user = await checkUserCredentials(username, password);
    
    if (user) {
      return res.status(302).redirect('/dashboard');
    } else {
      return res.status(401).render('login', { 
        error: 'Invalid username or password', 
        username: username 
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  const newUser = { username, password };
  fs.readFile(path.join(__dirname, '../db/users.json'), 'utf-8', (err, data) => {
    if (err) return next(err);
    let users = [];
    if (data) {
      users = JSON.parse(data);
    }
    users.push(newUser);
    fs.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2), (err) => {
      if (err) return next(err);
      res.status(302).redirect('/');
    });
  });
});

router.post('/submit-event-registration', (req, res, next) => {
  const { name, email, phone, college, event } = req.body;
  
  if (!name || !email || !phone || !college || !event) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newRegistration = {
    name,
    email,
    phone,
    college,
    event,
    timestamp: new Date().toISOString(),
  };
  fs.readFile(path.join(__dirname, '../db/formData.json'), 'utf-8', (err, data) => {
    if (err) return next(err);

    let formData = [];
    if (data) {
      formData = JSON.parse(data);
    }

    formData.push(newRegistration);

    fs.writeFile(path.join(__dirname, '../db/formData.json'), JSON.stringify(formData, null, 2), (err) => {
      if (err) return next(err);
      res.status(200).redirect('/event');
    });
  }); 
});


router.post('/submit-course-application', (req, res, next) => {
  const { 
    courseId, 
    courseTitle, 
    fullName, 
    email, 
    phone, 
    qualification, 
    address, 
    whyJoin 
  } = req.body;
  
  if (!courseId || !courseTitle || !fullName || !email || !phone || !qualification || !address || !whyJoin) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newApplication = {
    courseId,
    courseTitle,
    fullName,
    email,
    phone,
    qualification,
    address,
    whyJoin,
    status: 'Under Review',
    applicationDate: new Date().toISOString(),
  };

  const courseApplicationsPath = path.join(__dirname, '../db/courseApplications.json');
  fs.readFile(courseApplicationsPath, 'utf-8', (err, data) => {
    let applications = [];
    

    if (err && err.code !== 'ENOENT') {
      return next(err);
    }
  
    if (!err && data) {
      try {
        applications = JSON.parse(data);
      } catch (parseErr) {
        applications = [];
      }
    }

    applications.push(newApplication);

    const dbDir = path.join(__dirname, '../db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir);
    }

    fs.writeFile(courseApplicationsPath, JSON.stringify(applications, null, 2), (writeErr) => {
      if (writeErr) return next(writeErr);
      res.redirect(`/course-details/${courseId}?success=true`);
    });
  });
});

module.exports = router;