import User from "../models/User.js";

export const signup = async (req, res) => {

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
  });

  res.json(user);
};

export const login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
};