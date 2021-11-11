const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type: String,
        required: true,
        unique:[true,'user is already been used']
    },
    password:{
        type:String,
        require:true
    }
});

UserSchema.statics.findAndValidate = async function (id, password) {
    const founduser = await this.findOne({ id });
    const isValid = await bcrypt.compare(password, founduser.password);
    return isValid ? founduser : false;
}

UserSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,12);
    next();
})

module.exports =  mongoose.model('User',UserSchema);
