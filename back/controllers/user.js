// Importation du package bcrypt ainsi que du json web token, puis du model d'utilisateur initialisé dans le fichier models/User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Exportation de la fonction permettant d'initialiser un nouvel utilisateur (en cryptant son mot de passe)
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, process.env.rounds)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur initialisé !' }))
                .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}

// Exportation de la fonction permettant d'accéder au site avec un utilisateur déjà existant
exports.login = (req, res) => {
    // Recherche de l'email entré par le client
    User.findOne({email: req.body.email})
        .then(user => {
            // S'il n'est pas bon on envoie un message neutre inidiquant l'erreur et on arrête la fonction
            if (!user) {
                return res.status(401).json({message: 'Paire login/mot de passe incorrecte'})
            }
            // S'il est correct on compare ensuite le mot de passe avec le mot de passe qui à été enregistré lors du signup de cet email
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // S'il est incorrect, on renvoie le même message neutre que pour l'email
                    if (!valid) {
                        return res.status(401).json({message: 'Paire login/mot de passe incorrecte'})
                    }
                    // Si tout est correct, on assigne un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user.id},
                            process.env.secretToken,
                            {expiresIn: '24h'}
                        )
                    })
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
}