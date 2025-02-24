// user apis

const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../routes/userAuth");

// sign up functionality

// Step 1: Validate email & username
router.post("/validate-step1", async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email and username are required." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    return res.status(200).json({ message: "validation successful..." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Step 2: Final Signup Process
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, age, genre, fullname, phone, image } =
      req.body;
    if (username.length <= 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 4." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password length should be greater than 5." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      genre,
      fullname,
      phone,
      image,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// login or sign in  functionality
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (!existingEmail) {
      return res
        .status(400)
        .json({ message: "incorrect username or password" });
    }

    await bcrypt.compare(password, existingEmail.password, (err, data) => {
      if (data) {
        const authClaims = [
          {
            name: existingEmail.username,
          },
          {
            role: existingEmail.role,
          },
        ];
        const token = jwt.sign({ authClaims }, "BookMosaic017", {
          expiresIn: "30d",
        });
        res
          .status(200)
          .json({
            id: existingEmail._id,
            role: existingEmail.role,
            token: token,
          });
      } else {
        res.status(400).json({ message: "incorrect username or password" });
      }
    });
  } catch (error) {
    // 200=> success , 400=> user erro , 500=> server error
    res.status(500).json({ message: "internal server error" });
  }
});

// get user information
router.get("/user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

//  update genre
router.put("/update", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { genre } = req.body;
    await User.findByIdAndUpdate(id, { genre: genre });
    return res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;
