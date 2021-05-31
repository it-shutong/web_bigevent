$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var indexAdd = null;
    var indexEdit = null;

    initArtCateList();
    //为添加按钮添加点击事件
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类'
            , content: $('#dialog-add').html(),
            type: 1,
            area: ['500px', '250px']
        });
    })
    //添加弹出框
    $('body').on('submit', '#formAdd', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败！')
                }
                layer.msg('添加成功！')
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })
    //修改按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            title: '修改文章分类'
            , content: $('#dialog-edit').html(),
            type: 1,
            area: ['500px', '250px']
        })
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('formEdit', res.data)
            }
        })
    })
    //修改弹出框
    $('body').on('submit', '#formEdit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改失败！')
                }
                layer.msg('修改成功！')
                initArtCateList();
                layer.close(indexEdit);
            }
        })
    })
    //删除弹出框
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    initArtCateList();
                }
            })

            layer.close(index);
        });

    })





    //定义初始化表格函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取表格数据失败！')
                }
                var htmlStr = template('tql-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
})