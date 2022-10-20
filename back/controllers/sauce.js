// Importation du modèle de la sauce
const Sauce = require('../models/Sauce');
// Importation du module "filesystem"
const fs = require('fs');

// Exportation de la fonction permettant d'ajouter une nouvelle sauce
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce)
  // On supprime l'id et l'userId assigné automatiquement afin de ne pas le confondre
  delete sauceObject._id
  delete sauceObject._userId
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })

  // Sauvegarde de la sauce dans la base de données MongoDB
  sauce.save()
  .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
  .catch(error => res.status(400).json({error}))
}

// Exportation de la fonction permettant de trouver une sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({error: error}))
}

// Exportation de la fonction permettant de modifier une sauce
exports.modifySauce = (req, res) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }

// On supprime l'userId assigné automatiquement afin de ne pas le confondre
  delete sauceObject._userId
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message : 'Non autorisé'})
          } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
              .catch(error => res.status(401).json({error}))
          }
      })
      .catch((error) => {
          res.status(400).json({ error })
      })
}

// Exportation de la fonction permettant de supprimer une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Non autorisé'})
          } 
          else {
              const filename = sauce.imageUrl.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                      .then(() =>  res.status(200).json({message: 'Sauce supprimée !'}))
                      .catch(error => res.status(401).json({error}))
              })
          }
      })
      .catch( error => {
          res.status(500).json({error});
      })
}

// Exportation de la fonction permettant de sélectionner toutes les sauces
exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({error: error}))
}

// Exportation de la fonction permettant d'aimer ou détester une sauce
exports.likeSauce = (req, res) => {
  // Si on ajoute un like sur la sauce
  if (req.body.like == 1) {
    // On trouve la sauce une première fois
      Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            // On vérifie si l'utilisateur est présent dans le tableau usersLiked
              if (!sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne(
                          // S'il n'y est pas, on trouve une nouvelle fois l'ID de la sauce
                          { _id: req.params.id }, {
                              // On ajoute un like
                              $inc: { likes: 1 },
                              // On push l'ID de l'utilisateur dans le tableau des usersLiked
                              $push: { usersLiked: req.body.userId }
                          }
                      )
                      .then(() => res.status(201).json({message: 'Sauce aimée !'}))
                      .catch((error) => res.status(400).json({error}))
              }
          })
          .catch((error) => res.status(400).json({error}))
  };

  // Si on ajoute un dislike sur la sauce
  if (req.body.like == -1) {
      // On trouve la sauce une première fois
      Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            // On vérifie si l'utilisateur est présent dans le tableau usersDisliked
              if (!sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne(
                    // S'il n'y est pas, on trouve une nouvelle fois l'ID de la sauce
                    { _id: req.params.id }, {
                          // On ajoute un dislike
                          $inc: { dislikes: 1 },
                          // On push l'ID de l'utilisateur dans le tableau des usersDisliked
                          $push: { usersDisliked: req.body.userId }
                      })
                      .then(() => res.status(201).json({message: 'Sauce dépréciée !'}))
                      .catch((error) => res.status(400).json({error}))
              }
          })
          .catch((error) => res.status(400).json({error}))
  }

  // Si on enlève un like ou un dislike
  if (req.body.like == 0) {
      // On trouve la sauce une première fois
      Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
              // On vérifie si l'utilisateur est présent dans le tableau usersLiked
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne(
                    // S'il y est, on trouve une nouvelle fois l'ID de la sauce
                    { _id: req.params.id }, {
                          // On retire le like
                          $inc: { likes: -1 },
                          // On pull l'ID de l'utilisateur du tableau des usersLiked
                          $pull: { usersLiked: req.body.userId }
                      })
                      .then(() => res.status(201).json({ message: 'Like supprimé !' }))
                      .catch((error) => res.status(400).json({error}));
              }

              // Puis, on vérifie si l'utilisateur est présent dans le tableau usersDisliked
              if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne(
                  // S'il y est, on trouve une nouvelle fois l'ID de la sauce
                  { _id: req.params.id }, {
                          // On retire le dislike
                          $inc: { dislikes: -1 },
                          // On pull l'ID de l'utilisateur du tableau des usersDisliked
                          $pull: { usersDisliked: req.body.userId }
                      })
                      .then(() => res.status(201).json({ message: 'Dislike supprimé !' }))
                      .catch((error) => res.status(400).json({error}));
              }
          })
          .catch((error) => res.status(400).json({error}));
  } 
}