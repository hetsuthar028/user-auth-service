const bcrypt = require('bcrypt')
let saltRounds = 7;

const encryptPassword = (password) =>{
    bcrypt.hash(password, saltRounds).then((hashedPass)=>{
        return hashedPass
    }).catch((err)=>{
        return err
    })
}

module.exports = encryptPassword;