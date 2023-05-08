const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { prisma } = require("../prismaClient");

async function register(req, res) {
  const { email, password, name } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    try {
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) console.log(err);
        else {
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
              provider: "EMAIL",
            },
          });
          res
            .status(201)
            .json({ message: "User registered successfully", name });
        }
      });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  } else {
    res.status(400).json({ error: "User already exists! Login" });
  }
}

const createToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Not registered yet, please register first!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      userId:user.id,
      token,
      expiresIn:3600,
      name: user.name,
      image: user.image,
    });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
}

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid or expired" });
  }
};

const googleCallback = async (req, res) => {
  const user = req.user;
  const token = createToken(user);
  res.redirect(`/auth/success?token=${token}&user=${JSON.stringify(user)}`);
};

const facebookCallback = async (req, res) => {
  const user = req.user;
  const token = createToken(user);
  res.redirect(`/auth/success?token=${token}&user=${JSON.stringify(user)}`);
};

module.exports.register = register;
module.exports.login = login;
module.exports.googleCallback = googleCallback;
module.exports.facebookCallback = facebookCallback;
module.exports.protect = protect;
