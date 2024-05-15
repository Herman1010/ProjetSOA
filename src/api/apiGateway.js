// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const articleProtoPath = 'src/proto/article.proto';
const clientProtoPath = 'src/proto/client.proto';
const resolvers = require('../../resolvers');
const typeDefs = require('../../schema');
// Créer une nouvelle application Express
const app = express();
const articleProtoDefinition = protoLoader.loadSync(articleProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const clientProtoDefinition = protoLoader.loadSync(clientProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const articleProto = grpc.loadPackageDefinition(articleProtoDefinition).article;
const clientProto = grpc.loadPackageDefinition(clientProtoDefinition).client;
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });
// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
app.use(cors(), bodyParser.json(),expressMiddleware(server),);
});


app.get('/articles', (req, res) => {
    const client = new articleProto.ArticleService('localhost:50051',
    grpc.credentials.createInsecure());
    client.searchArticles({}, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.articles);
    }
    });
    });
    app.get('/articles/:id', (req, res) => {
    const client = new articleProto.ArticleService('localhost:50051',
    grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getArticle({ id: id }, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.article);
    }
    });
    });
    app.get('/clients', (req, res) => {
    const client = new clientProto.ClientService('localhost:50052',
    grpc.credentials.createInsecure());
    client.searchClients({}, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.clients);
    }
    });
    });
    app.get('/clients/:id', (req, res) => {
    const client = new clientProto.ClientService('localhost:50052',
    grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getClient({ id: id }, (err, response) => {
    if (err) {
    res.status(500).send(err);
    } else {
    res.json(response.client);
    }
    });
    });


    // Créer un client gRPC pour le microservice d'articles
const articleClient = new articleProto.ArticleService('localhost:50051', grpc.credentials.createInsecure());

// Route POST pour créer un nouvel article
/*app.post('/articles', (req, res) => {
    const { nom, description, prix, qte } = req.body;

    // Créer une demande gRPC pour créer un nouvel article
    const request = { nom, description, prix, qte };

    articleClient.createArticle(request, (err, response) => {
        if (err) {
            console.error('Erreur lors de la création de l\'article via gRPC :', err);
            res.status(500).send(err);
        } else {
            res.status(201).json({ id: response.id });
        }
    });
});*/





app.post('/articles', async (req, res) => {
    const { nom, description, prix, qte } = req.body;

    // Créer une demande gRPC pour créer un nouvel article
    const request = { nom, description, prix, qte };

    articleClient.createArticle(request, async (err, response) => {
        if (err) {
            console.error('Erreur lors de la création de l\'article via gRPC :', err);
            res.status(500).send(err);
        } else {
            // Envoyer un message Kafka indiquant qu'un nouvel article a été créé
            const message = {
                event: 'Nouvel article créé',
                article: {
                    id: response.id,
                    nom,
                    description,
                    prix,
                    qte
                },
                timestamp: new Date().toISOString()
            };

            try {
                await sendMessage('article-events', message);
                console.log('Message Kafka envoyé: ', message);
            } catch (sendError) {
                console.error('Erreur lors de l\'envoi du message Kafka :', sendError);
            }

            res.status(201).json({ id: response.id });
        }
    });
});


  // Créer un client gRPC pour le microservice de client
  const clientClient = new clientProto.ClientService('localhost:50052', grpc.credentials.createInsecure());

  // Route POST pour créer un nouveau client
  app.post('/clients', (req, res) => {
      const { nom, adresse } = req.body;
  
      // Créer une demande gRPC pour créer un nouveau client
      const request = { nom, adresse };
  
      clientClient.createClient(request, (err, response) => {
          if (err) {
              console.error('Erreur lors de la création du client via gRPC :', err);
              res.status(500).send(err);
          } else {
              res.status(201).json({ id: response.id });
          }
      });
  });


    // Démarrer l'application Express
    const port = 3000;
    app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
    });