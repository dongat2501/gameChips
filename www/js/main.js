$(document).ready(function () {
    $('.btn-router').click(function (e) {
        var url = $(this).attr('url');
        window.location.pathname = '/' + url;


    })
    $('#btn-back').click(function (e) {
        window.history.back();
    })
});