$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var atr_state = '已发布';

    initCate();
    initEditor();

    //文章封面
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //渲染文章类别下拉框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('数据获取失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //为选择封面按钮绑定点击事件
    $('#btnSelectImg').on('click', function () {
        $('#fileSel').click();
    })
    //监听封面提交事件
    $('#fileSel').on('change', function (e) {
        var file = e.target.files;
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //为储存按钮绑定事件
    $('#btnSave').on('click', function () {
        atr_state = '草稿';
    })
    //为文章发布表单绑定提交事件
    $('#formPub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', atr_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publishArt(fd);
            })
    })
    //构建提交函数
    function publishArt(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //不对 FormData 中的数据进行 url 编码，将 FormData 数据原样发送到服务器
            processData: false,
            //不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
            contentType: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章添加失败！')
                }
                layer.msg('文章添加成功！');
                location.href = '/article/art_list.html';
            }
        })
    }
})