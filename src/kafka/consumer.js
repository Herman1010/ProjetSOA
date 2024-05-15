const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'article-group' });

const consumeMessages = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Message reçu : ${message.value.toString()}`);
            // Traitez le message ici
        },
    });

    console.log(`Consommateur connecté et abonné au sujet ${topic}`);
};

const gracefulShutdown = async () => {
    try {
        await consumer.disconnect();
        console.log('Consommateur déconnecté avec succès');
    } catch (err) {
        console.error('Échec de la déconnexion du consommateur', err);
    } finally {
        process.exit();
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = consumeMessages;
