var bcrypt = require("bcrypt");
var config = require("config");

function hash_password(password){
    var saltRounds = config.get("salt");

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

function compare_password(myPlaintextPassword,hash){

    return bcrypt.compare(myPlaintextPassword, hash);
    
}

// const compare_password = (plainPassword, hashPassword) => {
//     return bcrypt
//       .compareSync(plainPassword, hashPassword)
//       .then(valid => {
//         if (valid) {
//           return Promise.resolve(valid)
//         }
//         return Promise.reject(new Error('Invalid Password'))
//       })
//   }

module.exports = {
    hash_password : hash_password,
    compare_password : compare_password
}