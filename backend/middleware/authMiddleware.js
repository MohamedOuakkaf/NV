const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protéger les routes (vérification du JWT)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.',
    });
  }
};

// Restreindre l'accès aux admins uniquement
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
    });
  }
};

// Autoriser admin ou le propriétaire de la ressource
const adminOrOwner = (req, res, next) => {
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé.',
    });
  }
};

module.exports = { protect, adminOnly, adminOrOwner };
