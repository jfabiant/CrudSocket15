var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var user = require('./models/user');
var Swal = require('sweetalert2')


app.set('view engine', 'jade');
app.use('/static', express.static('public'));

io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        console.log('Usuario desconectado');
    });

    user.show(function (data) {
        io.emit('listar', data);
    });

    socket.on('crear', function (data) {
        user.create(data, function (rpta) {
            io.emit('nuevo', rpta);
        });
    });
    socket.on('actualizar', function (data) {
        user.actualizar(data, function (rpta) {
            io.emit('nuevo', rpta);
        });
    });
    socket.on('eliminar', function (data) {
        swal('success', 'Un Elemento fue Elimado', 7000);
        user.delete(data, function (rpta) {
            io.emit('borrado', rpta);
        });

    });
});


function swal(type, message, time) {
    Swal.fire({
        toast: true,
        icon: `${type}`,
        title: `${message}`,
        position: 'top-end',
        showConfirmButton: false,
        timer: `${time}`,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
}

app.get('/', function (req, res) {
    res.render('main');
});

http.listen(port, function () {
    console.log(`Server connected in *: ${port}`);
});
