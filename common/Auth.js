import jwt from 'jsonwebtoken';
const newSessionRoutes = [{ path: '/user/login', method: 'POST' }];
const authRoutes = [{ path: '/user/password', method: 'PUT' }];
const SECRET_KEY = "JWT_SECRET";