$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义初始参数q
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }


    initTable();
    initCate();

    //为筛选按钮绑定提交事件
    $('#formSelect').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })
    //动态绑定删除按钮
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        var len = $('.btn-delete').length;

        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('文章删除失败！')
                    }
                    layer.msg('文章删除成功！');
                    if (len == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })

            layer.close(index);
        });

    })





    //定义表格渲染
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('数据获取失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })

    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义过滤器，格式化时间显示
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + '-' + mm + '-' + ss
    }
    //请求文章分类的列表
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
    //渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageList',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            }
        })
    }

})