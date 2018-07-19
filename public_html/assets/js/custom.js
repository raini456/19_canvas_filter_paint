(function () {


    canvasFilter.init({
        canvas: 'canvas',
        width: 600,
        height: 400
    });

    canvasFilter.setImage('assets/images/bild3.jpg', 0, 0);
    helper.addEv('[data-filter]','click',canvasFilter.setFx);
    

})();