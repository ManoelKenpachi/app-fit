import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer " do token

  if (!token) {
    return res.status(401).json({ error: "Token inválido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    req.userId = decoded.userId; // 🔥 Define req.userId corretamente
    next();
  });
};
