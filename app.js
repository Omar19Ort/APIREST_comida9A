const express = require("express");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');

const app = express();
const port = 3500;
const comidaRouter = require('./routes/comidarouter');

const secretKey = 'your-very-secret-key';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// Ruta para loguearse y obtener un token
app.post('/API/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'password') {
    const payload = { username: username, role: 'user' };
    const token = jwt.sign(payload, secretKey, { expiresIn: '10m' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// Middleware para verificar el token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Ruta protegida
app.get('/API/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Este es un contenido protegido', user: req.user });
});

// Rutas existentes
app.use('/API',authenticateJWT ,comidaRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Conectar con el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
