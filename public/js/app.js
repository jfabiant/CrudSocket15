$(document).ready(function () {
    var socket = io();
    $('#formulario').submit(function (e) {
        e.preventDefault();
        var data = {
            _id: $('#_id').val(),
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            timezone: $('#timezone').val(),
            locale: $('#locale').val(),
            profile_pic: $('#profile_pic').val(),
            baseDatos: $('#baseDatos').val()
        };

        if (data._id == '') {
            $("#_id").focus();
            return swal('info', 'Debe ingresar un ID', 7000);;
        }
        if (data.first_name == '') {
            $("#first_name").focus();
            return swal('info', 'Debe ingreser un nombre', 7000);
        }
        var accion = 'crear';
        if ($('.warning').length > 0) accion = 'actualizar';
        $('.warning').removeClass('warning');
        socket.emit(accion, data);
        $('#formulario').trigger('reset');
        return true;
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


    socket.on('listar', (data) => {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            fill(data[i]);
        }
    });

    socket.on('nuevo', function (data) {
        swal('success', 'Se Ingreso un nuevo Usuario', 7000);
        fill(data);
    });

    socket.on('actualizar', function (data) {
        swal('success', 'Se Actualizo los datos del Usuario', 7000);
        fill(data);
    });

    socket.on('borrado', (data) => {
        $("#" + data).remove();
    });

    var fill = function (data) {
        if ($('#' + data._id).length == 0) {
            var $row = $('<tr id="' + data._id + '" >');
            $row.append('<td>' + data._id + '</td>');
            $row.append('<td>' + data.first_name + '</td>');
            $row.append('<td>' + data.last_name + '</td>');
            $row.append('<td>' + data.timezone + '</td>');
            $row.append('<td>' + data.locale + '</td>');
            $row.append('<td>' + data.profile_pic + '</td>');
            $row.append('<td><button class="btn btn-success btn-sm" name="btnAct">Actualizar</button></td>');
            $row.append('<td><button class="btn btn-danger btn-sm" name="btnEli">Eliminar</button></td>');
            $row.data('data', data);
            $row.find('[name=btnAct]').click(function () {
                var data = $(this).closest('tr').data('data');
                $('#_id').val(data._id);
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#timezone').val(data.timezone);
                $('#locale').val(data.locale);
                $('#profile_pic').val(data.profile_pic);
                $('.warning').removeClass('warning');
                $(this).closest('tr').addClass('warning');
            });
            $row.find('[name=btnEli]').click(function () {
                var _id = $(this).closest('tr').attr('id');
                Swal.fire({
                    title: 'Eliminar',
                    text: "¿Seguro que desea continuar?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí'
                }).then((result) => {
                    if (result.value) {
                        socket.emit('eliminar', _id);
                        swal('success', 'Un Elemento fue Elimado', 7000);
                    }
                })
            });


            $('table tbody').append($row);

        } else {
            var $row = $('#' + data._id);
            $row.find('td:eq(1)').html(data.first_name);
            $row.find('td:eq(2)').html(data.last_name);
            $row.find('td:eq(3)').html(data.timezone);
            $row.find('td:eq(4)').html(data.locale);
            $row.find('td:eq(5)').html(data.profile_pic);

        }
    };



});