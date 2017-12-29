'use strict';

var blogPostTemplate = (
    '<li class="js-blog-item">' +
    '<p><span class="blog-item js-blog-item-title"></span></p>' +
    '<div class="blog-item-controls">' +
    '<button class="js-blog-item-toggle">' +
    '<span class="button-label">check</span>' +
    '</button>' +
    '<button class="js-blog-item-delete">' +
    '<span class="button-label">delete</span>' +
    '</button>' +
    '</div>' +
    '</li>'
);



var serverBase = '//localhost:8080/';

var blog_LIST_URL = serverBase + 'Blog-posts';


function getAndDisplayblogList() {
    console.log('Retrieving blog list');
    $.getJSON(blog_LIST_URL, function(items) {
        console.log('Rendering blog list');
        var itemElements = items.map(function(item) {
            var element = $(blogPostTemplate);
            element.attr('id', item.id);
            var itemTitle = element.find('.js-blog-item-title');
            itemTitle.text(item.title);
            element.attr('data-checked', item.checked);
            if (item.checked) {
                itemName.addClass('blog-item__checked');
            }
            return element;
        });
        $('.js-blog-list').html(itemElements);
    });
}


function addblogItem(item) {
    console.log('Adding blog item: ' + item);
    $.ajax({
        method: 'POST',
        url: blog_LIST_URL,
        data: JSON.stringify(item),
        success: function(data) {
            getAndDisplayblogList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}


function deleteblogItem(itemId) {
    console.log('Deleting blog item `' + itemId + '`');
    $.ajax({
        url: blog_LIST_URL + '/' + itemId,
        method: 'DELETE',
        success: getAndDisplayblogList
    });
}


function updateblogListitem(item) {
    console.log('Updating blog list item `' + item.id + '`');
    $.ajax({
        url: blog_LIST_URL + '/' + item.id,
        method: 'PUT',
        data: JSON.stringify(item),
        success: function(data) {
            getAndDisplayblogList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}


function handleblogListAdd() {

    $('#js-blog-list-form').submit(function(e) {
        e.preventDefault();
        addblogItem({
            name: $(e.currentTarget).find('#js-new-item').val(),
            checked: false
        });
    });

}

function handleblogListDelete() {
    $('.js-blog-list').on('click', '.js-blog-item-delete', function(e) {
        e.preventDefault();
        deleteblogItem(
            $(e.currentTarget).closest('.js-blog-item').attr('id'));
    });
}


$(function() {
    getAndDisplayblogList();
    handleblogListAdd();
    handleblogListDelete();
    updateblogListitem();
});