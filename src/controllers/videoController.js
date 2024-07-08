export const home = (req, res) => {
  return res.send("Home");
};

export const watch = (req, res) => {
  let { id } = req.params;
  return res.send(`Watch Video #${id}`);
};

export const upload = (req, res) => res.send("Upload Video");

export const edit = (req, res) => {
  return res.send("Edit Video");
};

export const remove = (req, res) => res.send("Remove Video");

export const search = (req, res) => res.send("Search");
