/* global h337 */

var demo = demo? demo : {};
demo.heatmap = (function () {

    var hCoordinates = [];
    var hControlSelector= 'heatmap-controls';
    var hSelector= 'heatmap-canvas';
    var heatmap;

    function renderHeatmap() {
        if(heatmap) {
            heatmap.setData({
              max: 10,
              data: hCoordinates
            });
        }
    }

    function renderControls() {
        var elm = document.createElement('div');
        elm.classList.add(hControlSelector);
        elm.innerHTML = '<div class="control"><button class="button is-warning js-heatmap-exit">Exit Heatmap</button></div>';
        document.body.appendChild(elm);
    }

    function setControlListeners() {
        document.querySelector('.js-heatmap-exit').addEventListener('click', function() {
            destroy();
        });
    }

    function destroy() {
        if(heatmap) {
            var hcanvas = document.getElementsByClassName(hSelector);
            while(hcanvas.length > 0){
                hcanvas[0].parentNode.removeChild(hcanvas[0]);
            }
            var hControl = document.getElementsByClassName(hControlSelector);
            while(hControl.length > 0){
                hControl[0].parentNode.removeChild(hControl[0]);
            }
            heatmap = undefined;
        }
    }

    function setData(coordinatesSet) {
        hCoordinates = hCoordinates.concat(coordinatesSet);
        renderHeatmap();
    }

    function create(options) {
        heatmap = h337.create(options);
        renderHeatmap();
        renderControls();
        setControlListeners();
    }


    return {
        create: create,
        setData: setData,
        destroy: destroy
    };

})();
