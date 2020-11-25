var bcrypt = require('bcryptjs');
const userModel = require('./models/userSchema');

var date = new Date();

const authenticate = async (name, pass) => {
  try {
    const user = await userModel.find({ username: name });

    if (user.length === 0) {
      return false;
    }

    console.log(date.toLocaleString() + ': Authenticating user ' + name);

    if (user[0].username === name) {
      const result = await bcrypt.compare(pass, user[0].password);
      if (result) {
        console.log(date.toLocaleString() + ': Authenticated user ' + name);
        return true;
      } else {
        console.log(date.toLocaleString() + ': Wrong passord for ' + name);
        return false;
      }
    }
  } catch (err) {
    console.log(err);
    console.log(date.toLocaleString() + ': User does not exists with name ' + name + '.');
    return false;
  }
};

exports.authenticate = authenticate;
