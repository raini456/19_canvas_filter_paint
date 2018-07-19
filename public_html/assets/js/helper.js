(function () {

    window.helper = {};
    
    helper.css = function (elem, prop) {
        return window.getComputedStyle(elem, null).getPropertyValue(prop);
    };
    helper.q = function (selector) {
        return document.querySelector(selector);
    };
    helper.qa = function (selector) {
        return document.querySelectorAll(selector);
    };
    helper.addEv = function (selector, event, fx) {
        var el = this.qa(selector);
        for (var i = 0, max = el.length; i < max; i++) {
            el[i].addEventListener(event, fx);
        }
        return el;
    };
})(); 