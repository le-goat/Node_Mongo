import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        // token du header
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); // Vérifier la validité du token

        // On ajoute les infos de l'utilisateur à la requête
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next(); // On va au prochain traitement
    } catch (error) {
        return res.status(401).json({ message: 'Authentification requise.' });
    }
};
