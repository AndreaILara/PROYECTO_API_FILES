const { checkForDuplicates } = require('../../utils/checkForDuplicates');
const deleteFileFromCloudinary = require('../../utils/deleteFile');
const { generateSign } = require('../../utils/jwt');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find()
      .select(['username', 'profilePic', 'playedGames', 'wantedGames', 'isAdmin'])
      .populate('playedGames', 'name')
      .populate('wantedGames', 'name');
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUserByName = async (req, res, next) => {
  try {
    const { username } = req.params;
    const requestedUser = await User.findOne({ username })
      .populate('playedGames', 'name')
      .populate('wantedGames', 'name');
    requestedUser
      ? res.status(200).json(requestedUser)
      : res.status(404).json('User not found');
  } catch (error) {
    return res.status(400).json(error);
  }
};

const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json('Username already exists');
    }
    const { username, password, profilePic, playedGames, wantedGames } =
      req.body;
    const newUser = new User({ username, password, profilePic, playedGames, wantedGames });

    if (req.file) {
      newUser.profilePic = req.file.path;
    }
    if (!newUser.profilePic) {
      newUser.profilePic =
        'https://cdn-icons-png.flaticon.com/512/6073/6073873.png';
    }

    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {

        const token = generateSign(user._id);

        return res.status(200).json({ user, token });
      } else {
        return res.status(400).json('Invalid username or password');
      }
    } else {
      return res.status(400).json('Invalid username or password');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === id || req.user.isAdmin) {

      const newUser = new User(req.body);
      const existingUser = await User.findById(id);
      newUser._id = id;
      newUser.role = req.user.role;
      newUser.playedGames = checkForDuplicates(
        existingUser.playedGames,
        newUser.playedGames
      );
      newUser.wantedGames = checkForDuplicates(
        existingUser.wantedGames,
        newUser.wantedGames
      );
      if (req.file) {
        newUser.profilePic = req.file.path;
        deleteFileFromCloudinary(existingUser.profilePic);
      }
      const updatedUser = await User.findByIdAndUpdate(id, newUser, {
        new: true
      });
      return res.status(200).json({
        message: 'User updated successfully',
        usuario: updatedUser
      });
    } else {
      return res
        .status(401)
        .json('Unauthorized user');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const manageAdmins = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isAdmin: req.body.isAdmin
      },
      { new: true }
    );
    return res.status(200).json({
      message: 'User updated successfully',
      usuario: updatedUser
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    deleteFileFromCloudinary(deletedUser.profilePic);
    deletedUser
      ? res.status(200).json({ mensaje: 'User deleted', deletedUser })
      : res.status(404).json('User not found');
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { register, login, editUser, deleteUser, getUsers, getUserByName, manageAdmins };