const { gql } = require('@apollo/server');

const typeDefs = `#graphql
type Article {
id: String!
nom: String!
description: String!
prix: Float!
qte: Int!
}

input NewArticleInput {
    nom: String!
    description: String!
    prix: Float!
    qte: Int!
}

input NewClientInput {
    nom: String!
    adresse: String!
}

type Client {
id: String!
nom: String!
adresse: String!
}
type Query {
article(id: String!): Article
articles: [Article]
client(id: String!): Client
clients: [Client]
}

type Mutation {
    createArticle(input: NewArticleInput!): Article
    createClient(input: NewClientInput!): Client
}
`;
module.exports = typeDefs