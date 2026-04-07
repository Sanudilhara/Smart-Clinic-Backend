import jwt from "jsonwebtoken"; //Importing jsonwebtoken for token handling
import dotenv from "dotenv"; //Importing dotenv to manage environment variables
dotenv.config(); // Load environment variables from .env file

// Middleware to authenticate requests using JWT

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  // Check if the Authorization header is in the correct format (Bearer token)

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  // Verify the token and attach the decoded user information to the request object

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to optionally authenticate requests (if token is provided)

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  // If no token is provided, just continue without attaching user info
  if (type !== "Bearer" || !token) return next();

  // If token is provided, verify it and attach user info to the request object
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {}
  return next();
};

export default authenticate;