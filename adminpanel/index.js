require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT;

// Middleware to serve static files from 'assets' folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Middleware for body parsing
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Login Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bioscope Admin Panel</title>
      <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
      <link rel="icon" href="assets/logo.png">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #000;
          color: #fff;
          overflow: hidden;
        }
        #particles-js {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .login-container {
          text-align: center;
          background: rgba(0, 0, 0, 0.6);
          padding: 50px 30px;
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
          max-width: 500px;
          width: 95%;
          animation: slideIn 1s ease-out forwards;
          transition: transform 0.3s ease;
        }
        .login-container:hover {
          transform: scale(1.05);
        }
        .logo {
          width: 120px;
          height: 120px;
          margin-bottom: 20px;
          border-radius: 50%;
          border: 3px solid #fff;
          animation: pulse 1.5s infinite;
        }
        h1 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #fff;
          text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
        }
        input {
          width: 85%;
          padding: 12px 15px;
          margin: 15px 0;
          border: 2px solid #fff;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        input:focus {
          border-color: #4CAF50;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
        }
        button {
          width: 90%;
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
        }
        button:hover {
          background-color: #45a049;
        }
        @keyframes slideIn {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @media (max-width: 768px) {
          .login-container {
            padding: 40px 20px;
          }
          h1 {
            font-size: 28px;
          }
          input {
            width: 90%;
          }
          button {
            width: 95%;
          }
        }
      </style>
    </head>
    <body>
      <script>
        // Check if user is already logged in
        if (localStorage.getItem('loggedIn') === 'true') {
          window.location.href = '/home'; // Redirect to home if logged in
        }
      </script>
      <div id="particles-js"></div>
      <div class="login-container">
        <img src="/assets/logo.png" alt="App Logo" class="logo">
        <h1>Admin Login</h1>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
      </div>
      <script>
        particlesJS("particles-js", {
          particles: {
            number: { value: 150, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
              polygon: { nb_sides: 5 }
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: { enable: false }
            },
            size: {
              value: 5,
              random: true,
              anim: { enable: false }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 4,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: { enable: false }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
              resize: true
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
              repulse: { distance: 200, duration: 0.4 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 }
            }
          },
          retina_detect: true
        });
      </script>
    </body>
    </html>
  `);
});


// Handle Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Save login data to localStorage (in the browser context)
    res.send(`
      <script>
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', '${username}');
        window.location.href = '/home';
      </script>
    `);
  } else {
    res.send(`
      <script>
        alert('Invalid Username or Password');
        window.location.href = '/'; // Redirect back to login page
      </script>
    `);
  }
});


// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/home', async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home Page</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          background: #f0f0f0;
          margin: 0;
          padding: 0;
        }
        h1 {
          color: #333;
          margin-top: 20px;
        }
        a {
          text-decoration: none;
          color: #007BFF;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to the Home Page</h1>
      <p><a href="/logout">Logout</a></p>
    </body>
    </html>
  `);
});





// Logout Route
app.get('/logout', (req, res) => {
  res.send(`
    <script>
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        window.location.href = '/';
      } else {
        window.location.href = '/home';  // Redirect back to the home page if canceled
      }
    </script>
  `);
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
