$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //昵称长度验证
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6长度之间'
            }
        }
    })
    initUserInfo();
    //重置按钮
    $('#reSet').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //监听表单提交
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息更新失败！')
                }
                window.parent.getUserInfo();
                return layer.msg('用户信息更新成功！')
            }
        })
    })
    //表单赋值函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                form.val('formChange', res.data);
            }
        })
    }
})

