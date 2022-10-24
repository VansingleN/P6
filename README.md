# HotTakes

## Pour exécuter l'API :

Cloner le repository,

Initialiser un fichier .env dans le dossier /back en y mettant les valeurs suivantes et en remplaçant les "*" par vos propres valeurs :

mongoUsername = *** 

mongoPassword = *** 

secretToken = *** 

rounds = *** 

PORT = ***

mongoUsername étant l'utilisateur de la base de données mongoPassword étant le mot de passe de l'utilisateur de la base de données secretToken étant la clé secrète utilisée pour générer les jsonwebtoken rounds étant le nombre de tours de salage qu'on veux appliquer au mots de passes "hashés" par bcrypt PORT étant le port sur lequel on veux faire tourner notre API, par défaut 3000

Ouvrez un terminal (Linux/Mac) ou une invite de commande/PowerShell (Windows)

Exécutez npm install à partir du répertoire du projet

Exécutez npm start
