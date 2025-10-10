const logOutController = {};

logOutController.logOut = async (req, res) => {
   res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Sesión cerrada" });
};

export default logOutController;