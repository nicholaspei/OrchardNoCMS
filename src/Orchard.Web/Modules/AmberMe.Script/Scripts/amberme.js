; (function ($, window, document, undefined) {

    var pluginName = 'amberme',
        version = '1.0.0';


    function Plugin(element, options) {
        var that = this;
        that.element = element;
        that.$element = $(element);

        that.viewModel = {
            Url: ko.observable(""),
            Data: null,
            Total: 0,
            Selected: {
                Title: ko.observable(""),
                ReadOnly: ko.observable(false),
                Template: ko.observable(""),
                Item: ko.observable({}),
                Items: ko.observableArray([]),
                Count: ko.observable(-1)
            },
            Page: {
                Number: ko.observable(-1),
                Size: ko.observable(0),
                MaxNumber: ko.observable(0),
                List: ko.observableArray([]),
                Show: function (page) {
                    var currentPage = that.viewModel.Page.Number();
                    return ((that.viewModel.Page.List().length <= 10)
                            || (currentPage < 5 && page < 10)
                            || page == currentPage
                            || (currentPage >= 5 && (
                                ((currentPage > page) && (currentPage - page) <= 5)
                                || ((page > currentPage) && (page - currentPage) <= 5))));
                }
            }
        };
        //button or link that trigger action
        var _currbtn = null;

        var defaults = {
            pk: 'Id',
            modal: 'modal',
            data: null,
            //是否启用行模式(行模式为点击行选中checkbox.若设为true,页面的自定义事件应该绑定到tr上,绑到checkbox上也不会触发:-D)
            rowMode: false,
            init: function () {
                //初始化操作,如有ajax请求，设置为同步模式
            },
            onLoaded: function (data) {
                //加载完成的操作
            },
            onPreShowModal: function () {
                //显示弹出框前的操作,函数内this表示触发弹出框的按钮或链接
            },
            onShowModal: function () {
                //显示弹出框后的操作
            },
            onPreHideModal: function () {
                //关闭弹出框前的操作
            },
            onHideModal: function () {
                //关闭弹出框后的操作
            },
            callback: {
                //操作成功回调操作
                //btnAdd:function(){
                //    ...
                //}
            },
            valid: {
                //表单验证
                //valid:{btnAdd:function(){return true;},...}
            }
        };

        that.options = $.extend({}, defaults, options);
        if (that.options.modal == null || that.options.modal == undefined || that.options.modal == '')
            that.options.modal = 'nosuchmodal';
        that.options.init.apply();
        that.load = function (url, page) {
            var pageNumber = page || 0;
            var pageSize = parseInt(that.$element.data('page-size') || 0);
            if (that.options.data) {
                if (pageNumber > 0 && ((pageNumber * pageSize) >= that.options.data.length)) {
                    that.viewModel.Page.Number(pageNumber - 1);
                }
                else {
                    localBinding(that.options.data, pageNumber, pageSize);
                }

                return;
            }

            var paramTag = function (url) {
                return url.indexOf('?') > 0 ? '&' : '?'
            };

            var all = that.$element.data('all');
            if (all == null || all == undefined || all == '') {
                if (pageNumber > 0 && pageSize > 0) {
                    url += paramTag(url) + 'skip=' + (pageNumber * pageSize);
                }
                if (pageSize > 0) {
                    url += paramTag(url) + 'take=' + pageSize
                }
            }

            if (url && url.length > 0) {
                $.get(url, function (data) {
                    if (data.Result == 1) {
                        remoteBinding(data, pageSize);
                    }
                });
            }


        };

        var localBinding = function (data, pageIndex, pageSize) {
            //pages
            var count = data.length;
            that.viewModel.Total = count;
            that.viewModel.Page.List.removeAll();
            if (count > 0 && pageSize > 0) {
                that.viewModel.Page.Size(pageSize);
                var pages = Math.ceil(count / pageSize);
                for (var i = 0; i < pages; i++) {
                    that.viewModel.Page.List.push(i);
                }
            }
            //data
            var start = pageIndex * pageSize,
                end = (pageIndex + 1) * pageSize;
            //if (start > (count - 1)) start = count - 1;
            //if (end > (count - 1)) end = count;
            var pageData = data.slice(start, end);

            if (that.viewModel.Data) {
                ko.mapping.fromJS(pageData, {}, that.viewModel.Data);
            }
            else {
                that.viewModel.Data = ko.mapping.fromJS(pageData);
                ko.applyBindings(that.viewModel, that.element);
            }
            setSelected();
            that.options.onLoaded(data);
        };

        var remoteBinding = function (data, pageSize) {
            //pages
            var count = parseInt((data.RecordCount || that.$element.data('count')) || 0);
            var pageIndex = that.viewModel.Page.Number();
            if (pageIndex > 0 && ((pageIndex * pageSize) >= count)) {
                that.viewModel.Page.Number(pageIndex - 1);
                return;
            }

            that.viewModel.Total = count;
            that.viewModel.Page.List.removeAll();
            if (count > 0 && pageSize > 0) {
                that.viewModel.Page.Size(pageSize);
                var pages = Math.ceil(count / pageSize);
                var counter = 0;
                that.viewModel.Page.MaxNumber(pages);
                for (i = pageIndex; i > pageIndex - 5; i--) {
                    if (i >= 0) {
                        counter++;
                        that.viewModel.Page.List.push(i);
                    }
                }
                that.viewModel.Page.List.reverse();
                var decounter = pageIndex + 10 - counter;
                for (i = pageIndex + 1; i < decounter; i++) {
                    if (i < pages)
                        that.viewModel.Page.List.push(i);
                }

            }
            //data                   
            if (that.viewModel.Data) {
                ko.mapping.fromJS(data.Data, {}, that.viewModel.Data);
            }
            else {
                that.viewModel.Data = ko.mapping.fromJS(data.Data);
                ko.applyBindings(that.viewModel, that.element);
            }
            setSelected();
            that.options.onLoaded(data);
        };

        //private methods
        var continuous = function () {
            var chks = that.$element.find(':checkbox[id!="selAll"]');
            var started = false, ended = false;

            for (var i = 0 ; i < chks.length ; i++) {
                var checked = $(chks[i]).is(':checked');
                if (!started && checked)
                    started = true;
                if (started && !checked)
                    ended = true;

                if (started && ended && checked)
                    return false;
            }
            return started;
        };

        var disableMoveUp = function () {
            if (that.viewModel.Selected.Count() < 1)
                return true;

            if (that.viewModel.Page.Number() == 0 && $(that.$element.find(':checkbox[id!="selAll"]:first')).is(':checked'))
                return true;

            return !continuous();
        };

        var disableMoveDown = function () {
            if (that.viewModel.Selected.Count() < 1)
                return true;
            if (that.viewModel.Page.Number() == that.viewModel.Page.List().length - 1 && $(that.$element.find(':checkbox[id!="selAll"]:last')).is(':checked'))
                return true;
            return !continuous();
        };
        var setSelected = function () {
            that.viewModel.Selected.Items.removeAll();




            if (that.$element.find(':checkbox[id="selAll"]').length > 0) {
                var el = that.$element.find(':checkbox[id!="selAll"][checked]');
                if (el && el.length > 0) {
                    for (var i = 0; i < el.length; i++) {
                        var _item = ko.dataFor(el[i]);
                        if (i == 0) {
                            that.viewModel.Selected.Item(_item);
                        }
                        that.viewModel.Selected.Items.push(_item);
                    }
                }

                that.viewModel.Selected.Count(that.$element.find(':checkbox[id!="selAll"][checked]').length);
                that.$element.find(':checkbox[id="selAll"]').attr("checked", that.$element.find(':checkbox:not(:checked)[id!="selAll"]').length == 0 && that.$element.find(':checkbox[id!="selAll"]').length > 0);
            }
            else {
                that.viewModel.Selected.Item(that.viewModel.Data);

            }

            //var orgIds = $("#organizationIDs").val();
            //var currentOrgID = $("#currentOrganizationID").val();
            ////alert(currentOrgID);
            //var el = that.$element.find(':checkbox[id!="selAll"]').each(function (i, o) {
            //    var row = that.viewModel.Data()[i];

            //    if (row.OrganizationID
            //        && currentOrgID != '' && orgIds.indexOf(row.OrganizationID()) < 0) {
            //        o.remove();
            //    }
            //});

            that.$element.find(':checkbox[id="selAll"]').each(function (i, o) {
                $(o).css('display', that.$element.find(':checkbox[id!="selAll"]').length == 0 ? 'none' : 'block');
            });
            //that.$element.find("#btnAdd").each(function (i, o) {
            //    $(o).attr("disabled", $(o).attr("disabled") || (currentOrgID != '' && orgIds.indexOf(currentOrgID) < 0));
            //});


        };



        //subscribe
        that.viewModel.Page.Number.subscribe(function (newValue) {
            var apiUrl = that.$element.data('url');
            that.load(apiUrl, newValue);
        });
        that.viewModel.Url.subscribe(function (newValue) {
            that.$element.data('url', newValue);
            that.load(newValue, 0);
        });
        that.viewModel.Selected.Count.subscribe(function (newValue) {
            that.$element.find("#btnRelate").attr("disabled", newValue != 1);
            that.$element.find("#btnEdit").attr("disabled", newValue != 1);
            that.$element.find("#btnDelete").attr("disabled", newValue < 1);
            that.$element.find("#btnUp").attr("disabled", disableMoveUp());
            that.$element.find("#btnDown").attr("disabled", disableMoveDown());
            that.$element.find("#btnEnable").attr("disabled", newValue < 1);
            that.$element.find("#btnDisable").attr("disabled", newValue < 1);
            that.$element.find("#btnPublish").attr("disabled", newValue != 1);
            that.$element.find("#btnPublishData").attr("disabled", newValue < 1);
            that.$element.find("#btnCancelPublish").attr("disabled", newValue < 1);
            that.$element.find("#btnRelateMultCar").attr("disabled", newValue < 1);
            that.$element.find("#btnDetail").attr("disabled", newValue != 1);
            that.$element.find("#btnRelateCar").attr("disabled", newValue != 1);
            that.$element.find("#btnPublishTrue").attr("disabled", newValue < 1);
            that.$element.find("#btnPublishFalse").attr("disabled", newValue < 1);
        });
        //that.viewModel
        //load
        that.viewModel.Page.Number(0);
        that.viewModel.Selected.Count(0);

        //that.$element.find(':checkbox[data-bind]').each

        //bindings
        that.$element.on('click', 'button[data-template-url],a[data-template-url]', function (e) {
            if ($(this).data("multimodal")) {
                var $this = $(this),
                    target = $this.data('target'),
                    $target = $(target);

                e.preventDefault();
                $target
                    .modal({ width: $target.width(), left: 0, focusOn: "input:first", toggle: "modal" })
                    .one('hide', function () {
                        $this.focus();
                    });
            }
            _currbtn = e.currentTarget;
            that.options.onPreShowModal.apply(_currbtn);

            var self = $(_currbtn);
            var tmpurl = self.data('template-url');
            var modal = $("#" + that.options.modal);
            if (self.attr("id") == "btnAdd") {
                that.$element.find(':checkbox').attr('checked', false);
            }
            setSelected();

            that.viewModel.Selected.Title(self.data('title') || '');
            that.viewModel.Selected.ReadOnly(self.data('readonly') ? true : false);
            ko.applyBindings(that.viewModel.Selected, modal.find(".modal-header")[0]);
            ko.applyBindings(that.viewModel.Selected, modal.find(".modal-footer")[0]);

            if (tmpurl && tmpurl != '' && tmpurl != undefined) {
                modal.find(".modal-body").html("").css("scrollTop", 0).load(tmpurl, function () {
                    var nobind = self.data("nobind");
                    if (nobind == null || nobind == undefined || nobind == '') {
                        ko.applyBindings(that.viewModel.Selected.Item, modal.find(".modal-body")[0]);
                    }

                    that.options.onShowModal.apply(_currbtn);
                });
            }
            //弃用
            //else {
            //    modal.find(".modal-body").attr("data-bind", "template: { name: Selected.Template(), data: Selected.Item() }");
            //    var _template = self.data('template');
            //    that.viewModel.Selected.Template(_template);

            //    that.options.onShowModal.apply(_currbtn);
            //}
        });

        that.$element.find("#selAll").bind("click", function () {
            that.$element.find(':checkbox').attr('checked', this.checked);
            that.viewModel.Selected.Count(that.$element.find(':checkbox[id!="selAll"][checked]').length);
            setSelected();
        });

        if (that.options.rowMode) {
            that.$element.find('tbody tr').live("hover", function () {
                $(this).css("cursor", "pointer");
            });

            that.$element.find('tbody tr').live("click", function () {
                var chk = $(this).find(':checkbox').first();
                $(chk).attr('checked', !$(chk).is(':checked'));
                that.$element.find(':checkbox[id="selAll"]').attr('checked', that.$element.find(':checkbox[id!="selAll"][checked]').length == that.$element.find(':checkbox[id!="selAll"]').length);
                that.viewModel.Selected.Count(that.$element.find(':checkbox[id!="selAll"][checked]').length);
                setSelected();
            });

            that.$element.find(':checkbox[id!="selAll"]').live("click", function (event) {
                that.$element.find(':checkbox[id="selAll"]').attr('checked', that.$element.find(':checkbox[id!="selAll"][checked]').length == that.$element.find(':checkbox[id!="selAll"]').length);
                that.viewModel.Selected.Count(that.$element.find(':checkbox[id!="selAll"][checked]').length);
                setSelected();

                event.stopPropagation();
            });
        }
        else {
            that.$element.find(':checkbox[id!="selAll"]').live("click", function () {
                that.$element.find(':checkbox[id="selAll"]').attr('checked', that.$element.find(':checkbox[id!="selAll"][checked]').length == that.$element.find(':checkbox[id!="selAll"]').length);
                that.viewModel.Selected.Count(that.$element.find(':checkbox[id!="selAll"][checked]').length);
                setSelected();
            });
        }

        that.$element.on('click', 'a[data-page]', function (e) {
            var target = $(e.currentTarget);
            var page = target.data('page');
            var currentPage = that.viewModel.Page.Number();
            var expression = /^\s*[+-]\d+\s*$/;

            if (expression.test(page)) {
                var newPage = eval('currentPage' + page);
                if (newPage >= 0 && newPage < that.viewModel.Page.MaxNumber()) {
                    that.viewModel.Page.Number(newPage);
                }
            }
            else if (page >= 0 && page < that.viewModel.Page.MaxNumber()) {
                that.viewModel.Page.Number(page);
            }

            setSelected();
        });

        that.$element.on('click', 'button[data-url],a[data-url]', function (e) {
            var target = $(e.currentTarget);
            _currbtn = e.currentTarget;
            var url = target.data('url');
            var _confirm = target.data('confirm') || '确认操作吗?';
            if (confirm(_confirm)) {
                var ids = new Array();
                that.$element.find(':checkbox[id!="selAll"][checked]').each(function () {
                    ids.push($(this).attr("value"));
                });

                $.ajax({
                    url: url,
                    type: 'post',
                    data: [{ name: "ids", value: ids }]
                })
                .done(function (data) {
                    if (data.Result == 1) {//succeed
                        var key = ($(_currbtn).attr("id") || '').length == 0 ? 'nosuchkey' : $(_currbtn).attr("id");
                        if (that.options.callback[key] && typeof that.options.callback[key] == 'function') {
                            that.options.callback[key].apply(_currbtn, data);
                        }
                        that.reload();
                    }

                    if (data.Message && data.Message.length > 0) {
                        alert(data.Message);
                    }

                })
                .fail(function (response, status) {
                    alert('操作失败');
                });

            }
        });

        var modal = that.options.modal;
        //$('#' + modal).on('show', function () {
        //    //that.options.onPreShowModal.apply();
        //});
        //$('#' + modal).on('shown', function () {
        //    //that.options.onShowModal.apply();
        //});
        $('#' + modal).off().on('hide', function () {
            that.options.onPreHideModal.apply(_currbtn);
        });
        $('#' + modal).off().on('hidden', function () {
            that.options.onHideModal.apply(_currbtn);
        });

        var succeed = function (data, hold) {
            if (data.Result == 1) {//succeed

                var key = ($(_currbtn).attr("id") || '').length == 0 ? 'nosuchkey' : $(_currbtn).attr("id");
                if (that.options.callback[key] && typeof that.options.callback[key] == 'function') {
                    that.options.callback[key](_currbtn, data);
                }

                if (data.Reload) {
                    that.reload();
                }
                else if (data.Data) {
                    if (typeof that.viewModel.Data == 'function') {
                        var pkField = that.options.pk;
                        var dataItem = ko.utils.arrayFirst(that.viewModel.Data(), function (item) {
                            return item[pkField]() == data.Data[pkField];
                        });
                        if (dataItem) {
                            ko.mapping.fromJS(data.Data, {}, dataItem);
                        }
                        else {
                            that.viewModel.Data.push(ko.mapping.fromJS(data.Data));
                        }
                    }
                    else {
                        ko.mapping.fromJS(data.Data, {}, that.viewModel.Data);
                    }

                    setSelected();
                }

                if (!hold) {
                    $('#' + that.options.modal).modal('hide');
                }
            }

            if (data.Message && data.Message.length > 0) {
                alert(data.Message);
            }
        };

        $('#' + modal + ' a.btn-primary').live('click', function (e) {
            var form = $('#' + modal + ' form:first');
            var hold = $(e.currentTarget).hasClass('hold');
            var validateresult = form.bootstrapValidate();
            if (!validateresult)
                return false;
            var url = form.attr('action');
            //var msg = '';
            //$('#' + modal + ' input[reg],select[reg]').each(function () {
            //    var reg = new RegExp($(this).attr('reg'), "ig");
            //    if (!reg.test($(this).attr('value'))) {
            //        msg += $(this).attr('msg') + '\n';
            //    }
            //});

            //if (msg.length > 0) {
            //    alert(msg);
            //    return false;
            //}
            var key = $(_currbtn).attr("id") || "nosuchkey";
            if (that.options.valid[key] && typeof that.options.valid[key] == 'function') {
                var re = that.options.valid[key].apply();
                if (!re) return false;
            }

            if ($(form).attr("enctype") == "multipart/form-data") {
                $(form).ajaxSubmit({
                    success: function (data) {
                        var json;
                        json = $.parseJSON(data);
                        if (json == null)
                            json = data;
                        succeed(data, hold);
                    },
                    error: function () {
                        alert('操作失败');
                    }
                });
            }
            else {
                $.ajax({
                    url: url,
                    type: form.attr('method'),
                    data: form.serializeArray()
                })
                .done(function (data) {
                    succeed(data, hold);
                })
                .fail(function (response, status) {
                    alert('操作失败');
                });
            }
        });

    }

    Plugin.prototype = {
        reload: function () {
            var that = this;
            var apiUrl = that.$element.data('url');
            this.load(apiUrl, that.viewModel.Page.Number());
            return that;
        },
        resetUrl: function (url) {
            this.viewModel.Url(url);
            this.viewModel.Page.Number(0);
            return this;
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName,
                   new Plugin(this, options));
            }
        });
    };

    // Format date strings using the dateformat prototype
    String.prototype.format = function (mask, utc) {
        try {
            var d = new Date(+this.replace(/\/Date\((\d+)\)\//, '$1'));
            return d.format(mask);
        }
        catch (err) {
            return '';
        }
    };

    Date.prototype.format = function (format) {
        //yyyy-MM-dd HH:mm:ss
        format = format.replace(/HH:mm/ig, (this.getHours() < 10 ? '0' : '') + this.getHours() + ':' + (this.getMinutes() < 10 ? '0' : '') + this.getMinutes());
        format = format.replace(/HH/ig, (this.getHours() < 10 ? '0' : '') + this.getHours());
        format = format.replace(/YYYY/ig, this.getFullYear());
        format = format.replace(/MM/ig, (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1));
        format = format.replace(/DD/ig, (this.getDate() < 10 ? '0' : '') + this.getDate());
        format = format.replace(/SS/ig, (this.getSeconds() < 10 ? '0' : '') + this.getSeconds());
        return format;
    };

    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };

    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
    };

})(jQuery, window, document);

//封装ajax方法，当请求成功后，返回状态码
// 200->请求成功
// 201->添加记录成功 202->更新记录成功
// 204->删除记录成功 401->没有授权

var Ajax = {}
Ajax.Post = function (formid, url, data, refreshFunc, comfirmFunc) {
    var validatable, isDataPost = false, postdata = {};
    if (formid != null) {
        validatable = validatable = $("#" + formid).bootstrapValidate();
        var arrData = $("#" + formid).serializeArray();
        for (var i in arrData) {
            postdata[arrData[i].name] = decodeURIComponent(arrData[i].value);
        }

        isDataPost = validatable;
    }
    else {
        isDataPost = true;
        postdata = data;
    }

    //如果isDataPost为true,执行ajax请求
    if (isDataPost) {
        var _doRefresh = true;
        $.ajax({
            type: "POST",
            traditional: true,
            dataType: "json",
            data: postdata,
            url: url,
            success: function (data, textStatus, xhr) {
                var status = xhr.status;
                switch (status) {
                    case 201:
                        //Layout.Message("提示信息框", "添加记录成功");
                        alert("添加记录成功");
                        break;
                    case 202:
                        //Layout.Message("提示信息框", "更新记录成功");
                        alert("更新记录成功");
                        break;
                    case 204:
                        alert("提示信息框", "删除记录成功");
                        break;
                    case 401:
                        //跳转到登录页面
                        break;
                    default:
                        break;
                }
                if (xhr.responseText) {//由于下面那个破if里，获取不到值
                    switch (xhr.responseText) {
                        case "4": //repeat  
                            _doRefresh = false;
                            alert("提示信息框", "当前选择的车款已被关联，不能重复关联！");
                            break;
                    }
                }
                if (data != undefined)
                    if (data.OperateStatus) {
                        switch (data.OperateStatus) {
                            case 1: //success
                                _doRefresh = true;
                                break;
                            case 2: //fail
                                _doRefresh = false;
                                alert("提示信息框", data.Message);
                                break;
                            case 3: //repeat
                                _doRefresh = false;
                                if (confirm(data.Message)) {
                                    comfirmFunc();
                                }
                                break;
                        }
                    }
            }
        });
        if (_doRefresh) {
            refreshFunc();
            return true;
        }

        return false;
    }
    else {
        return false;
    }
}