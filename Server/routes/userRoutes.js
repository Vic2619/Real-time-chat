const express = require("express");

const bcrypt = require("bcryptjs");

const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");

const router = express.Router();

const Message = require("../models/Message");

// GET PROFILE

router.get(
  "/profile",
  authMiddleware,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).select("-password");

      res.json(user);

    } catch (err) {

      res.status(500).json({
        message:
          "Server error",
      });

    }

  }
);

// UPDATE PROFILE

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {

        return res.status(404)
        .json({
          message:
            "User not found",
        });

      }

      if (
        req.body.username !==
        user.username
      ) {

        const exists =
          await User.findOne({
            username:
              req.body.username,
          });

        if (exists) {

          return res.status(400)
          .json({
            message:
              "Username already exists",
          });

        }

      }

      user.username =
        req.body.username ||
        user.username;

      user.avatar =
        req.body.avatar ||
        user.avatar;

      user.bio =
        req.body.bio ||
        user.bio;

      await user.save();

      await Message.updateMany(
        {
          userId: req.user.id,
        },
        {
          username:
            user.username,

          avatar:
            user.avatar,
        }
      );

      res.json({
        message:
          "Profile updated",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);

// CHANGE PASSWORD

router.put(
  "/password",
  authMiddleware,

  async (req, res) => {

    try {

      const {
        oldPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Old password incorrect",
        });

      }

      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(
          newPassword,
          salt
        );

      await user.save();

      res.json({
        message:
          "Password updated",
      });

    } catch (err) {

      res.status(500).json({
        message:
          "Server error",
      });

    }

  }
);

// VIEW OTHER USER PROFILE

router.get(
  "/:id",
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        ).select(
          "-password"
        );

      if (!user) {

        return res.status(404)
        .json({
          message:
            "User not found",
        });

      }

      res.json(user);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);

module.exports = router;