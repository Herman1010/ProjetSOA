module.exports = mongoose => {
    const Schema = mongoose.Schema;
    let ClientSchema = new Schema({
        nom: { type: String, required: true},
        adresse: {type: String, required: true},
       
    }, {
        timestamps: true
    });
    ClientSchema.method('toJSON', function(){
        const{__v, _id, ...object}= this.toObject();
        object.id = _id;
        return object;

    })
    const Client = mongoose.model('Client', ClientSchema);
    return Client;
}