(function () {

    'use strict';

    var time = 0;
    var url = '';
    var number = 0;

    $('#start').click(function () {
        url = $('#url').val();
        number = + $('#number').val();
        if (url && number) {
            work();
        }
        else {
            alert('请填入链接地址和要增加的访问次数');
        }
    });

    function work() {
        var iframe = $('<iframe>').appendTo('body');
        var element = iframe.get(0);

        element.onload = function () {
            setTimeout(function () {
                iframe.remove();
            }, 1000);
        }

        setUrl(element);
        time ++;

        $('.red').html(time);

        if (time < number) {
            setTimeout(function () {
                work();
            }, 1000);
        }
    }

    function setUrl(element) {
        if (url.indexOf('?') == -1) {
            element.src = url + '?' + Math.random() + (new Date());
        }
        else {
            element.src = url + '&' + Math.random + (new Date());
        }
    }
})();