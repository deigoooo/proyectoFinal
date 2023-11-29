export const getMessageController = (req, res) => {
  res.render("chat", { user: req.session.user.email });
};
