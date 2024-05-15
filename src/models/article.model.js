module.exports = mongoose => {
    const Schema = mongoose.Schema;
    let ArticleSchema = new Schema({
        nom: { type: String, required: true},
        description: {type: String, required: true},
        prix: {type: Number, required: true},
        qte: {type: Number, required: true},
    }, {
        timestamps: true
    });
    ArticleSchema.method('toJSON', function(){
        const{__v, _id, ...object}= this.toObject();
        object.id = _id;
        return object;

    })
    const Article = mongoose.model('Article', ArticleSchema);
    return Article;
}