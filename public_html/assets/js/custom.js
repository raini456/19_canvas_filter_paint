(function () {


    canvasFilter.init({
        canvas: 'canvas',
        width: 700,
        height: 500
    });

    canvasFilter.setImage('assets/images/bild3.jpg', 0, 0);
    helper.addEv('[data-filter]','click',canvasFilter.setFx);
    

})();