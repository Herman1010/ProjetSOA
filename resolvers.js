// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const articleProtoPath = 'src/proto/article.proto';
const clientProtoPath = 'src/proto/client.proto';
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
// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
Query: {
article: (_, { id }) => {
// Effectuer un appel gRPC au microservice de films
const client = new articleProto.ArticleService('localhost:50051',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.getArticle({ id: id }, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.article);
}
});
});
},
articles: () => {
// Effectuer un appel gRPC au microservice de films
const client = new articleProto.ArticleService('localhost:50051',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.searchArticles({}, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.articles);
}
});
});
},

client: (_, { id }) => {
// Effectuer un appel gRPC au microservice de séries TV
const client = new clientProto.ClientService('localhost:50052',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.getClient({ id: id }, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.client);
}
});
});
},
clients: () => {
// Effectuer un appel gRPC au microservice de séries TV
const client = new clientProto.ClientService('localhost:50052',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.searchClients({}, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.clients);
}
});
});
},
},


Mutation: {
    createArticle: (_, { input }) => {
        const { nom, description, prix, qte } = input;
        const client = new articleProto.ArticleService('localhost:50051', grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.createArticle({ nom, description, prix, qte }, (err, response) => {
                if (err) {
                    console.error('Erreur lors de la création de l\'article via gRPC :', err);
                    reject(err);
                } else {
                    resolve(response.article);
                }
            });
        });
    },

    createClient: (_, { input }) => {
        const { nom, adresse } = input;
        const client = new clientProto.ClientService('localhost:50052', grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.createClient({ nom, adresse }, (err, response) => {
                if (err) {
                    console.error('Erreur lors de la création du client via gRPC :', err);
                    reject(err);
                } else {
                    resolve(response.client);
                }
            });
        });
    },
},





};
module.exports = resolvers;