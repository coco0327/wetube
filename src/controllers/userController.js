import { User } from "../models/User";
import { Video } from "../models/Video";
import bcrypt from "bcrypt";

export const getRegister = (req, res) => {
  return res.render("register", { pageTitle: "Register" });
};

export const postRegister = async (req, res) => {
  const { name, email, password, password2, username, location } = req.body;
  const pageTitle = "Register";
  // const exists = await User.exists({$or: [{email}, {username}]}) *duplicated of email or username in once
  const emailExists = await User.exists({ email });
  const usernameExists = await User.exists({ username });
  if (emailExists) {
    return res.status(400).render("Register", {
      pageTitle,
      errorMessage: "This Email is already taken.",
    });
  } else if (usernameExists) {
    return res.status(400).render("Register", {
      pageTitle,
      errorMessage: "This username is already taken.",
    });
  } else if (password !== password2) {
    return res.status(400).render("Register", {
      pageTitle,
      errorMessage: "Password Confirmation Does Not Match",
    });
  }
  try {
    await User.create({
      name,
      email,
      password,
      username,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Log In" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Log In";
  const user = await User.findOne({ username, socialOnly: false });
  const passCheck = await bcrypt.compare(password, user.password);
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An Account With This Username Doesn't Exist",
    });
  }
  if (!passCheck) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize?";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token?";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}${params}`;

  const tokenResponse = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const tokenData = await tokenResponse.json();
  if ("access_token" in tokenData) {
    const { access_token } = tokenData;
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const userData = await userResponse.json();
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const emailData = await emailResponse.json();
    const primaryVerifiedEmail = await emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!primaryVerifiedEmail) {
      return res.redirect("/login");
    }
    let user = await User.findOne({
      email: primaryVerifiedEmail.email,
    });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        email: primaryVerifiedEmail.email,
        password: "",
        username: userData.login,
        location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = async (req, res) => {
  const {
    session: {
      user: { name },
    },
  } = req;
  return res.render("edit-profile", {
    pageTitle: `Edit ${name}'s Profile`,
  });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const userCheck = await User.findById(_id);
  if (email !== userCheck.email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: _id } });
    if (existingEmail) {
      return res.status(400).render("Edit", {
        pageTitle: "Edit Profile",
        errorMessage: "This email is already taken.",
      });
    }
  }
  if (username !== userCheck.username) {
    const existingUsername = await User.findOne({
      username,
      _id: { $ne: _id },
    });
    if (existingUsername) {
      return res.status(400).render("Edit", {
        pageTitle: "Edit Profile",
        errorMessage: "This username is already taken.",
      });
    }
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  const {
    session: {
      user: { socialOnly },
    },
  } = req;
  if (socialOnly) {
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id: loggedInId },
    },
    body: { currentPassword, newPassword, newPassword2 },
  } = req;
  const pageTitle = "Change Password";
  const user = await User.findById(loggedInId);
  const passCheck = await bcrypt.compare(currentPassword, user.password);

  if (!passCheck) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "Your Current Password Is Wrong.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "Password Confirmation Does Not Match",
    });
  }

  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const remove = (req, res) => {
  return res.send("Delete User");
};

export const see = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found" });
  }
  return res.render("profile", { pageTitle: user.name, user });
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
