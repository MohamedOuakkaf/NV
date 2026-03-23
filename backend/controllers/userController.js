const User = require('../models/User');

// @desc    Obtenir tous les utilisateurs (admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir un utilisateur par ID (admin)
// @route   GET /api/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Modifier son propre profil
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profil mis à jour.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Changer son mot de passe
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Mot de passe modifié avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer un utilisateur (admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Impossible de supprimer un admin.' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'Utilisateur supprimé.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Changer le rôle d'un utilisateur (admin)
// @route   PUT /api/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'client'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Rôle invalide.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    res.json({ success: true, message: 'Rôle mis à jour.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateProfile, changePassword, deleteUser, updateUserRole };
