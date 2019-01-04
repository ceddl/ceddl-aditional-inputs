/* global ceddl, JsonViewer*/

var demo = demo? demo : {};

(function() {

    var Jview = new JsonViewer(document.getElementById('json-container'));

    function setListeners() {
        document.querySelector('.js-clear-cart').addEventListener('click', function() {
            demo.cart.clearCart();
        }, false);

        document.querySelector('.js-show-heatmap').addEventListener('click', function() {
            demo.heatmap.create({
                container: document.body,
                radius: 60
            });
        }, false);
    }

    var rendering = false;
    function renderdataObject(){
        if (!rendering) {
            rendering = true;
            setTimeout(function(){
                var allData = ceddl.getModels();
                allData.events = ceddl.getEvents();
                Jview.set(allData);
                rendering = false;
            }, 150);
        }
    }

    function bindDataObject() {

        ceddl.eventbus.on('ceddl:models', function() {
            renderdataObject();
        });

        ceddl.eventbus.on('ceddl:events', function() {
            renderdataObject();
        });

        ceddl.eventbus.on('heatmap:update', function(data) {
            demo.heatmap.setData(data.coordinates);
        });

    }


    function init() {
        bindDataObject();
        demo.products.renderRandomProduct();
        demo.products.renderRandomProduct();
        demo.products.renderRandomProduct();
        demo.cart.renderCart();
        setListeners();
    }

    init();

})();





