const jwt = require("jsonwebtoken");

const generateToken = (res, id) => {
	const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		sameSite: "strict",
		maxAge: 24 * 60 * 60 * 1000,
	});
};

module.exports = generateToken;
