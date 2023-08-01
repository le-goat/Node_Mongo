import User from "../models/user.js";
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

// CREATE
export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
        // On vérifie si l'utilisateur existe
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({message: 'L\'utilisateur existe déjà.'});
        }

        // On hache le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // On crée un nouvel utilisateur
        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: 'Inscription réussie.'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// GET
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        const usersDTO = users.map(user => {
            return {name: user.name, email: user.email};
        });
        res.status(200).json(usersDTO);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// GET
export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }

        const userDTO = {name: existingUser.name, email: existingUser.email};
        res.status(200).json(userDTO);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// UPDATE
export const updateUser = async (req, res) => {
    const {name, email} = req.body;
    const userId = req.params.id;

    try {
        // On vérifie si l'utilisateur existe
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }

        existingUser.name = name;
        existingUser.email = email;
        await existingUser.save();

        res.status(200).json({
            message: 'Mise à jour de l\'utilisateur réussie.',
            user: {
                name: existingUser.name,
                email: existingUser.email
            }
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// DELETE
export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // On vérifie si l'utilisateur existe
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }

        // On supprime l'utilisateur
        await existingUser.deleteOne();

        res.status(200).json({message: 'Utilisateur supprimé avec succès.'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
