$(document).ready(function () {
    $('.btn-router').click(function (e) {
        var url = $(this).attr('url');
        window.location.pathname = '/' + url;


    })
    $('#btn-back').click(function (e) {
        history.go(-1); return false;
    })
    $('#btn-home').click(function (e) {
        window.location.pathname = 'index.html'
    })
});