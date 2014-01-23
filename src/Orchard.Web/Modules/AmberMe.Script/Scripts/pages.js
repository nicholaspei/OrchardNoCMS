var viewModel = {
    Selected: {
        Item: ko.observable({}),
        Template: ko.observable("")
    },
    Page: {
        Number: ko.observable(-1),
        SelectedCount: ko.observable(-1),
        Size: ko.observable(0),
        List: ko.observableArray([]),
        Show: function (page) {
            var currentPage = viewModel.Page.Number();

            return ((viewModel.Page.List().length <= 10)
                    || (currentPage < 5 && page < 10)
                    || page == currentPage
                    || (currentPage >= 5 && (
                        ((currentPage > page) && (currentPage - page) <= 5)
                        || ((page > currentPage) && (page - currentPage) <= 5))));
        }
    },
    Typeahead: {
        Url: "",
        Data: [],
        Options: []
    }
};

viewModel.Page.SelectedCount.subscribe(function (newValue) {
    if (newValue == 1) {
        $("#btnEdit").attr("disabled", false);
        $("#btnUp").attr("disabled", false);
        $("#btnDown").attr("disabled", false);
    }
    else {
        $("#btnEdit").attr("disabled", true);
        $("#btnUp").attr("disabled", true);
        $("#btnDown").attr("disabled", true);
    }

    $("#btnDelete").attr("disabled", newValue < 1);
});

// subscribe to the view model's page number
viewModel.Page.Number.subscribe(function (newValue) {
    // get a reference to the "body" node
    var body = $('#koContainer');
    // retrieve the value of the "data-controller" attribute
    var controller = body.data('controller');
    // retrieve the value of the "data-url" attribute
    var apiUrl = body.data('url');

    var pageNumber = newValue;
    var pageSize = viewModel.Page.Size();

    if (pageNumber > 0 && pageSize > 0) {
        apiUrl += '&skip=' + (pageNumber * pageSize) + '&take=' + pageSize;
    }
    else if (pageSize > 0) {
        apiUrl += '&skip=0&take=' + pageSize;
    }

    // make the call
    $.get(apiUrl, function (data) {
        // update the view model
        if (controller && controller != null && controller != '') {
            if (viewModel[controller]) {
                ko.mapping.fromJS(data, {}, viewModel[controller]);
            }
            else {
                viewModel[controller] = ko.mapping.fromJS(data);
                // render the UI
                ko.applyBindings(viewModel);
            }
        }
    });
});

// this is the object that contains 
// all functions relating to the viewModel
// seperation of concerns
viewContext = {
    typeahead: function (selector) {
        // attach a "typeahead" plugin
        // to all elements matching selector
        $(selector).typeahead({
            // The minimum character length needed before triggering autocomplete suggestions
            minLength: 0,
            // the source function provides a list of options
            // to the typeahead plugin
            source: function (query, process) {
                var dataset = $(this)[0].$element[0].dataset;
                // get the value of the "data-items" attribute
                var items = dataset.items;

                if (items && items != '') {
                    return items.split(',');
                }

                // get the value of the "data-url" attribute
                var url = dataset.url;

                // check if the url matches the current url
                if (viewModel.Typeahead.Url == url) {
                    // if it does then use the existing list of options
                    return viewModel.Typeahead.Options;
                }

                // this is a new data source, so store it
                viewModel.Typeahead.Url = url;

                // try to figure out the property to use for display
                var target = dataset.target;
                var name = $($(this)[0].$element[0]).attr('name');

                // The name and the target usually share 
                // the first few characters
                target = target.replace('Id', '');
                name = name.replace(target, '');

                // make an AJAX call to the server to retrieve a list of options
                return $.get(viewModel.Typeahead.Url, { q: query }, function (data) {
                    // clear any previously stored values
                    viewModel.Typeahead.Data = data;

                    // the typeahead plugin expects an array of strings
                    viewModel.Typeahead.Options = ko.utils.arrayMap(data, function (item) {
                        return item[name] || item.Name;
                    });

                    // use the new list of options
                    return process(viewModel.Typeahead.Options);
                });
            },
            // the updater function is executed when a user makes a selection
            updater: function (item) {
                // get a reference to the element
                var element = $(this)[0].$element[0];
                // get the value of the "data-target" attribute
                var target = element.dataset.target;

                if (target && target != '') {
                    var name = $($(this)[0].$element[0]).attr('name');

                    // The name and the target usually share 
                    // the first few characters
                    var prefix = target.replace('Id', '');
                    name = name.replace(prefix, '');

                    // find the data item matching the selection
                    var dataItem = ko.utils.arrayFirst(viewModel.Typeahead.Data, function (obj) {
                        return item == obj[name] || item == obj.Name;
                    });

                    if (dataItem && dataItem.Id) {
                        // set the value in the viewModel
                        //viewModel.Selected.Item()[target](dataItem.Id);
                        var dataSource = ko.dataFor(element);
                        dataSource[target](dataItem.Id);

                        // if the item also has a 'UnitPrice' property,
                        // update it
                        if (dataItem.UnitPrice && typeof (dataSource.UnitPrice) === 'function') {
                            dataSource.UnitPrice(dataItem.UnitPrice);
                        }
                    }
                    else {
                        // update the data source
                        ko.dataFor(element)[target](0);
                    }
                }
                // return the selected item
                return item;
            }
        })
        // if the typeahead is cleared, reset the value on the target field
        .on('change', function (e) {
            var self = $(e.currentTarget);
            if (self.val() == '') {
                var target = self.data('target');
                if (target && target != '') {
                    // set the value in the viewModel
                    // viewModel.Selected.Item()[target](0);
                    ko.dataFor(e.currentTarget)[target](0);
                }
            }
        })
        // show options on focus
        .each(function () {
            var self = $(this);
            self.on('focus', self.typeahead.bind(self, 'lookup'));
        });
    },
    datepicker: function (selector) {
        $(selector).datepicker({
            format: 'yyyy-mm-dd'
        });
    }
};
// Format date strings using the dateformat prototype
String.prototype.format = function (mask, utc) {
    try {
        return eval('new ' + this.toString().replace(/\//g, '')).format(mask, utc)
    }
    catch (err) {
        return '';
    }
}
String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};
String.prototype.endsWith = function (str) {
    return this.slice(-str.length) == str;
};

// configure the cookie plugin to store raw values
$.cookie.raw = true;

// This block of code executes the first time the page is loaded
$(function () {

    // get a reference to the "body" node
    var body = $('#koContainer');

    // retrieve the page size setting
    var pageSize = parseInt(body.data('page-size') || 0);
    // retrieve the current item count
    var count = parseInt(body.data('count') || 0);

    // create the list of pages
    if (count > 0 && pageSize > 0) {
        // update the page size property of the view model
        viewModel.Page.Size(pageSize);

        // update the pages array
        var pages = Math.ceil(count / pageSize);
        for (var i = 0; i < pages; i++) {
            viewModel.Page.List.push(i);
        }
    }


    // attach a click event to hyperlinks with attribute "data-template"
    body.on('click', 'button[data-template]', function (e) {

        // get the object that was clicked
        var self = $(e.currentTarget);
        // get the corresponding data item
        var dataItem = null;
        // retrieve the value of the "data-template" attribute
        var template = self.data('template');
        // retrive the value of the 'data-url' attribute
        var url = self.data('url');
        if (self.data('item')) {
            dataItem = ko.mapping.fromJS(self.data('item'));
        }
        else {
            var el = $(':checkbox[id!="selAll"][checked]')[0];
            if (el)
                dataItem = ko.dataFor(el);
        }
        var selectItem = function () {
            // clear the template
            viewModel.Selected.Template('');
            // set the data item of this object as the selected item
            viewModel.Selected.Item(dataItem);
            // select the template
            viewModel.Selected.Template(template);
        }

        // check if we need to make an ajax call
        if (url) {
            if ((url.indexOf('/0', url.length - 2) !== -1) && self.data('id')) {
                // build the filtering url
                url = url.substring(0, url.length - 1) + self.data('id');
            }
            // make the call
            $.get(url, function (data) {
                // retrieve the value of the 'data-controller' attribute
                var controller = self.data('controller');
                // retrieve the value of the 'data-property' attribute
                var property = self.data('property');

                // if controller is specified,
                // then we're updating a property of the viewModel
                if (controller && controller != '') {
                    // check if property already exists on data item
                    if (viewModel[controller]) {
                        // update the property
                        ko.mapping.fromJS(data, {}, viewModel[controller]);
                    }
                    else {
                        // create a new property
                        viewModel[controller] = ko.mapping.fromJS(data);
                    }
                }
                    // if property is specified,
                    // then we're updating a property of the data item
                else if (property && property != '') {
                    // check if property already exists on data item
                    if (dataItem[property]) {
                        // update the property
                        ko.mapping.fromJS(data, {}, dataItem[property]);
                    }
                    else {
                        // create a new property
                        dataItem[property] = ko.mapping.fromJS(data);
                    }
                }
                    // otherwiser, we're updating the data item itself
                else {
                    ko.mapping.fromJS(data, {}, dataItem);
                }

                // select the item and template after ajax call
                selectItem();
            });
        }
        else {
            // select item and template
            selectItem();
        }      
        var a = viewModel.Selected.Template();

        var b = viewModel.Selected.Item();
    });
    // whenever a hyperlink with attribute "data-item" is clicked
    body.on('click', 'a[data-item]', function (e) {
        // get the object that was clicked
        var self = $(e.currentTarget);
        // get the corresponding data item
        var dataItem = self.data('item');
        // retrieve the value of the 'data-controller' attribute
        var controller = self.data('controller');
        // if controller is specified,
        // then we're updating a property of the viewModel
        if (controller && controller != '') {
            // check if property already exists on data item
            if (!viewModel[controller]) {
                // create a new property
                viewModel[controller] = ko.observableArray([]);
            }
            // update the property
            viewModel[controller].push(ko.mapping.fromJS(dataItem));
            // attach typeahead to any new controlls
            viewContext.typeahead('[data-type=typeahead]');
        }
    });
    // whenever a hyperlink with attribute "data-page" is clicked
    body.on('click', 'a[data-page]', function (e) {
        // get a reference to the clicked item
        var target = $(e.currentTarget)
        // get the specified page number
        var page = target.data('page');
        // get the current page number from the view model
        var currentPage = viewModel.Page.Number();
        // regular expression to match signed integers
        var expression = /^\s*[+-]\d+\s*$/;

        // update the page number 
        if (expression.test(page)) {
            // the page is a signed integer, 
            // so we calculate by adding/subtracting from the current page
            var newPage = eval('currentPage' + page);
            if (newPage >= 0 && newPage < viewModel.Page.List().length) {
                viewModel.Page.Number(newPage);
            }
        }
        else if (page >= 0 && page < viewModel.Page.List().length) {
            // the page is just a number
            // so assign it directly
            viewModel.Page.Number(page);
        }
    });

    // attach a "click" event to the primary button on the modal
    $('#modal a.btn-primary').on('click', function (e) {
        // get a reference to the modal's form element
        var form = $('#modal form:first');
        var url = form.attr('action');
        var msg = '';
        $('#modal input[reg],select[reg]').each(function () {
            var reg = new RegExp($(this).attr('reg'), "ig");
            if (!reg.test($(this).attr('value'))) {
                msg += $(this).attr('msg') + '\n';
            }
        });

        if (msg.length > 0) {
            alert(msg);
            return false;
        }

        // make a AJAX request to the server
        // the type of request depends on the "action" attribute of the form
        // and the data sent to the server is the viewModel's selected item
        $.ajax({
            url: url,
            type: form.attr('method'),
            data: form.serializeArray()
        })
        // when the AJAX request successfully completes
        .done(function (data) {           
            // retrieve the value of the "data-controller" attribute
            var controller = $('#koContainer').data('controller');
            // find the data item in the viewModel's list
            // with a matching "Id"
            var dataItem = ko.utils.arrayFirst(viewModel[controller](), function (item) {
                return item.Id() == data.Id;
            });

            // if the data item was found
            if (dataItem) {
                // update the data item in the list
                ko.mapping.fromJS(data, {}, dataItem);
            }
            else {
                // otherwise, add a new item to the list
                viewModel[controller].push(ko.mapping.fromJS(data));
            }

            // hide the modal
            $('#modal').modal('hide');
        })
        // when the AJAX request fails
        .fail(function (response, status) {
            // clear any alerts
            $('#modal .alert').remove();
            // create a new alert
            var message = $('<div class="alert alert-error fade in"><a class="close" data-dismiss="alert" href="#">&times;</a></div>');
            var json = JSON.parse(response.responseText);
            // add error message
            message.append('<strong>' + json.Message + '</strong> ');
            message.append(json.ExceptionMessage);

            // add a new alert to the modal
            $('#modal .modal-body:first')
                    .prepend(message);
            //$('#modal').modal('hide');
        });
    });

    // when the modal window is made visible
    $('#modal').on('shown', function () {
        viewContext.typeahead('#modal [data-type=typeahead]');
        viewContext.datepicker('#modal :input[type=datetime]');
    });

    // update the page number to trigger ajax call
    viewModel.Page.Number(0);

    var selAll = $("#selAll");
    selAll.bind("click", function () {
        body.find(':checkbox').attr('checked', this.checked);
        viewModel.Page.SelectedCount(body.find(':checkbox[id!="selAll"][checked]').length);
    });

    body.find(':checkbox[id!="selAll"]').live("click", function () {
        body.find(':checkbox[id="selAll"]').attr('checked', body.find(':checkbox[id!="selAll"][checked]').length == body.find(':checkbox[id!="selAll"]').length);
        viewModel.Page.SelectedCount(body.find(':checkbox[id!="selAll"][checked]').length);
    });

    // update the page number to trigger ajax call
    viewModel.Page.SelectedCount(0);
});