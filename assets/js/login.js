$(function () {
    // 登录与注册界面切换
    $('#link-reg').on('click', function () {
        $('.login-box').hide().siblings('.reg-box').show()
    })
    $('#link-login').on('click', function () {
        $('.reg-box').hide().siblings('.login-box').show()
    })
    //表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        //密码验证
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            if ($('.reg-box [name = password]').val() !== value) {
                return '两次密码不一致'
            }
        }
    })
    //注册Ajax请求
    $('#reg-form').on('submit', function (e) {
        e.preventDefault();
        var data = {
            username: $('#reg-form [name=username]').val(),
            password: $('#reg-form [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $('#link-login').click();
        })

    })
    //登录Ajax请求
    $('#log-form').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/login', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg('登录失败!');
            }
            layer.msg('登陆成功！');
            localStorage.setItem('token', res.token);
            location.href = '/index.html';
        })
    })
})