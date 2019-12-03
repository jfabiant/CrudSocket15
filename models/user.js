var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/chat');

var user_schema = new Schema({
    _id: String,
    first_name: String,
    last_name: String,
    timezone: String,
    locale: String,
    profile_pic: String
});

let user_model = mongoose.model('user', user_schema, 'users');

module.exports = {
    create: function (data, callback) {
        var item = {
            _id: data._id,
            first_name: data.first_name,
            last_name: data.last_name,
            timezone: data.timezone,
            locale: data.locale,
            profile_pic: data.profile_pic
        };
        let _savedb = data.baseDatos;
        console.log("***********************************");
        console.log("USER");
        console.log(_savedb);
        if (_savedb == "0") {
            var nuevo = new user_model(item).save();
        }
        callback(item);
    },
    show: function (callback) {
        user_model.find({}, (err, items) => {
            if (!err) {
                callback(JSON.stringify(items));
            } else {
                return console.log(er);
            }
        })
    },
    actualizar: (data, callback) => {
        console.log("___________________________")
        console.log("ARCHIVO USER.JS")
        console.log(data);
        console.log("___________________________")
        user_model.findOne({ _id: data._id }, (err, item) => {
            item.first_name = data.first_name;
            item.last_name = data.last_name;
            item.timezone = data.timezone;
            item.locale = data.locale;
            item.profile_pic = data.profile_pic;
            item.save();
            callback(item);
        });
    },
    delete: (_id, callback) => {
        console.log("Id in funciton delete");
        console.log(_id);

        user_model.findOne({ _id: _id }, (err, post) => {
            if (err) throw err;
            post.remove();
            callback(_id);
        });
    }
};