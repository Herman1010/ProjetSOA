// articleMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
//const db = require('../database/db.config');
//const Article = db.articles;
const articleModel = require('../models/article.model')(mongoose); // Supposons que vous avez un modèle mongoose pour les articles

// Charger le fichier article.proto
const articleProtoPath = '../proto/article.proto'; // Assurez-vous d'avoir le bon chemin vers votre fichier proto
const articleProtoDefinition = protoLoader.loadSync(articleProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const articleProto = grpc.loadPackageDefinition(articleProtoDefinition).article;

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/projetsoa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à la base de données MongoDB');
});

// Implémenter le service d'article
const articleService = {



    getArticle: (call, callback) => {
        const articleId = call.request.id;
        
        // Rechercher l'article par son ID
        articleModel.findById(articleId)
            .then(article => {
                if (!article) {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Article not found."
                    }, null);
                } else {
                    callback(null, { article });
                }
            })
            .catch(err => {
                console.error('Error finding article in the database:', err);
                callback({
                    code: grpc.status.INTERNAL,
                    details: "Internal server error."
                }, null);
            });
    },
    



  /*getArticle: (call, callback) => {
    const articleId = call.request.id;
    // Récupérer l'article depuis la base de données MongoDB
    articleModel.findById(articleId, (err, article) => {
      if (err) {
        console.error('Erreur lors de la recherche de l\'article dans la base de données :', err);
        callback(err, null);
      } else {
        callback(null, { article });
      }
    });
  },*/
  /*SearchArticles: (call, callback) => {
    const query = call.request.query;
    // Effectuer une recherche d'articles en fonction de la requête
    articleModel.find({$text: { $search: query }}, (err, articles) => {
      if (err) {
        console.error('Erreur lors de la recherche des articles dans la base de données :', err);
        callback(err, null);
      } else {
        callback(null, { articles });
      }
    });
  },*/
  // Ajouter d'autres méthodes au besoin

  searchArticles: (call, callback) => {
    // Effectuer une recherche d'articles pour obtenir tous les articles
    articleModel.find({})
        .then(articles => {
            callback(null, { articles });
        })
        .catch(err => {
            console.error('Erreur lors de la recherche des articles dans la base de données :', err);
            callback(err, null);
        });
},


createArticle: (call, callback) => {
    const { nom, description, prix, qte } = call.request;
    const newArticle = new articleModel({ nom, description, prix, qte });

    newArticle.save()
        .then(savedArticle => {
            callback(null, { id: savedArticle._id });
        })
        .catch(err => {
            console.error('Erreur lors de la création de l\'article dans la base de données :', err);
            callback(err, null);
        });
},



};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(articleProto.ArticleService.service, articleService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur :', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});
console.log(`Microservice d'articles en cours d'exécution sur le port ${port}`);
