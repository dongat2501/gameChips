$(document).ready(function () {
    $('.btn-router').click(function (e) {
        console.log(e)
        var url = $(this).attr('url');
        window.location.pathname = '/' + url;
        

    })
});