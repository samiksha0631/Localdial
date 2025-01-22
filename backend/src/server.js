const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

const port = 4000;

const mongoUrl = "mongodb+srv://vaishnavipawaskar89:vaishu%40123@cluster0.wjy0e.mongodb.net/";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error in database connection:", error);
  });

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// 1. Create (Register user)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// 2. Read (Get all users)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// 3. Read (Get user by ID)
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// 4. Update (Update user by ID)
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// 5. Delete (Delete user by ID)
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// 6. Home Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
  console.log('Server running at http://localhost:${port}');
});