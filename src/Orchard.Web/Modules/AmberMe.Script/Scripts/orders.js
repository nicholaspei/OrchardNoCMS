/// <reference path="jquery-1.8.3.js" />
/// <reference path="bootstrap.js" />
/// <reference path="knockout-2.2.0.js" />
/// <reference path="knockout.mapping-latest.js" />
/// <reference path="pages.js" />

// pre-define the order details array
// because we need to create a dependent observable
viewModel.OrderDetails = ko.observableArray([]);

// dependent observable to calculate the total of order details
viewModel.OrderTotal = ko.computed(function () {
    var total = 0;

    ko.utils.arrayForEach(this.OrderDetails(), function (item) {
        total += ((item.UnitPrice() * item.Quantity()) * (1 - item.Discount()));
    });

    return total;
}, viewModel);

$(function () {
    // attach a click event to hyperlinks with attribute "data-template"
    $('body').on('click', 'a[data-template]', function (e) {
        // get the object that was clicked
        var self = $(e.currentTarget);

        // if we are setting a new item,
        // clear the order details array
        if (self.data('item')) {
            viewModel.OrderDetails.removeAll();
        }
    });
});
