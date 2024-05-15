<h1 align="center">Gestionnaire de Clients et d'Articles</h1>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

---

<h2 align="center">Description</h2>

Le Gestionnaire de Clients et d'Articles est une application backend développée pour la gestion efficace des clients et des articles, basée sur les microservices. Les technologies principales utilisées incluent gRPC, GraphQL, Kafka, Express.js et MongoDB. L'application comporte deux microservices distincts : un pour la gestion des clients et un autre pour la gestion des articles. Ces microservices communiquent avec l'API Gateway via gRPC, permettant aux clients d'émettre des requêtes via GraphQL.

---

<h2 align="center">Fonctionnalités</h2>

- **Microservices** : Deux microservices distincts sont implémentés pour la gestion des clients et des articles.
- **gRPC Communication** : Les microservices communiquent avec l'API Gateway via gRPC pour une communication efficace.
- **GraphQL API** : Les clients peuvent émettre des requêtes via GraphQL pour interagir avec les microservices.
- **Gestion des Clients** : Ajout, suppression, mise à jour et récupération des informations sur les clients.
- **Gestion des Articles** : Ajout, suppression, mise à jour et récupération des informations sur les articles.
- **Kafka Integration** : Kafka est utilisé pour envoyer des alertes au microservice client lorsqu'un nouvel article est ajouté à la base de données.
- **Schémas Proto** : Des schémas proto ont été définis pour chaque microservice, facilitant la définition des interfaces de communication.

---

<h2 align="center">Technologies Utilisées</h2>

- **gRPC** : Pour la communication entre les microservices et l'API Gateway.
- **GraphQL** : Pour fournir une API flexible et puissante aux clients.
- **Kafka** : Pour la gestion des événements et l'envoi d'alertes aux clients.
- **Express.js** : Pour la création d'API RESTful et l'intégration avec GraphQL.
- **MongoDB** : Pour le stockage persistant des données clients et articles.

---

<h2 align="center">Installation</h2>

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js et npm installés sur votre machine.
3. Installez les dépendances en exécutant la commande suivante :
  </br> **npm install express @apollo/server @grpc/grpc-js @grpc/proto-loader body-parser cors kafkajs**
4. Configurez les variables d'environnement nécessaires, telles que les URL de connexion à MongoDB et Kafka.

---

<h2 align="center">Utilisation</h2>

1. Démarrez les microservices en exécutant les commandes suivantes :
    </br>**node articleMicroservice.js**
    </br>**node clientMicroservice.js**
2. Démarrez l'API Gateway en exécutant la commande suivante :
  </br> **node apiGateway.js**
3. L'API est maintenant accessible à l'adresse suivante : `http://localhost:3000`. Vous pouvez utiliser un outil comme GraphiQL Postman pour interagir avec l'API GraphQL.

---

<h2 align="center">Contribuer</h2>

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez ouvrir une issue pour discuter des changements que vous souhaitez apporter. Assurez-vous de suivre les bonnes pratiques de développement et de respecter le code de conduite.

---

<h2 align="center">Licence</h2>

Ce projet est sous licence MIT. Veuillez consulter le fichier [LICENSE](LICENSE) pour plus de détails.

---

