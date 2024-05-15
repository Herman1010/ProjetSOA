// articleMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const clientModel = require('../models/client.model')(mongoose); // Supposons que vous avez un modèle mongoose pour les articles

// Charger le fichier article.proto
const clientProtoPath = '../proto/client.proto'; // Assurez-vous d'avoir le bon chemin vers votre fichier proto
const clientProtoDefinition = protoLoader.loadSync(clientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const clientProto = grpc.loadPackageDefinition(clientProtoDefinition).client;

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




const consumeMessages = require('../kafka/consumer');

const topic = 'facture-topic';

// Démarrer la consommation des messages
consumeMessages(topic).catch(console.error);








// Implémenter le service de client
const clientService = {



    getClient: (call, callback) => {
        const clientId = call.request.id;
        
        // Rechercher l'article par son ID
        clientModel.findById(clientId)
            .then(client => {
                if (!client) {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Client not found."
                    }, null);
                } else {
                    callback(null, { client });
                }
            })
            .catch(err => {
                console.error('Error finding client in the database:', err);
                callback({
                    code: grpc.status.INTERNAL,
                    details: "Internal server error."
                }, null);
            });
    },


  /*getClient: (call, callback) => {
    const clientId = call.request.id;
    // Récupérer l'article depuis la base de données MongoDB
    clientModel.findById(clientId, (err, client) => {
      if (err) {
        console.error('Erreur lors de la recherche de l\'article dans la base de données :', err);
        callback(err, null);
      } else {
        callback(null, { client });
      }
    });
  },*/
 /* searchClients: (call, callback) => {
    const query = call.request.query;
    // Effectuer une recherche d'articles en fonction de la requête
    clientModel.find({ $text: { $search: query } }, (err, articles) => {
      if (err) {
        console.error('Erreur lors de la recherche des articles dans la base de données :', err);
        callback(err, null);
      } else {
        callback(null, { client });
      }
    });
  },*/
  // Ajouter d'autres méthodes au besoin

  searchClients: (call, callback) => {
    // Effectuer une recherche d'articles pour obtenir tous les articles
    clientModel.find({})
        .then(clients => {
            callback(null, { clients });
        })
        .catch(err => {
            console.error('Erreur lors de la recherche des clients dans la base de données :', err);
            callback(err, null);
        });
},



createClient: (call, callback) => {
    const { nom, adresse } = call.request;
    const newClient = new clientModel({ nom, adresse });

    newClient.save()
        .then(savedClient => {
            callback(null, { id: savedClient._id });
        })
        .catch(err => {
            console.error('Erreur lors de la création du client dans la base de données :', err);
            callback(err, null);
        });
},


};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(clientProto.ClientService.service, clientService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur :', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});
console.log(`Microservice de client en cours d'exécution sur le port ${port}`);
