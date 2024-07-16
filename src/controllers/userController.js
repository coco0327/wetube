import { User } from "../models/User";

export const getRegister = (req, res) => {
  return res.render("register", { pageTitle: "Register" });
};

export const postRegister = async (req, res) => {
  const { name, email, password, username, location } = req.body;
  await User.create({
    name,
    email,
    password,
    username,
    location,
  });
  res.redirect("/login");
};

export const edit = (req, res) => {
  return res.send("Edit User");
};

export const remove = (req, res) => {
  return res.send("Delete User");
};

export const see = (req, res) => res.send("See User");

export const login = (req, res) => res.send("login");

export const logout = (req, res) => res.send("Log out");
