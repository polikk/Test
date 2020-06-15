window.addEventListener("DOMContentLoaded", function() {
let multiItemsSlider = (function(){
    return  function (selector,config) {
        let _mainElement = document.querySelector(selector);
        let _sliderWrapper = _mainElement.querySelector('.slider__wrapper');
        let _sliderItems= _mainElement.querySelectorAll('.slider__item');
        let _sliderControls = _mainElement.querySelectorAll('.slider__control');
        let  _sliderControlLeft = _mainElement.querySelector('.slider__control_left'); 
        let _sliderControlRight = _mainElement.querySelector('.slider__control_right');
        let _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
        let _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
        let _positionLeftItem = 0;
        let _transform = 0;
        let _step = _itemWidth / _wrapperWidth * 100;
        let  _items = [];
        let _interval = 0;
        let _config = {
            isCycling: false, 
            direction: 'right', 
            interval: 3000, 
            pause: false 
          };
          for (let key in config) {
            if (key in _config) {
              _config[key] = config[key];
            }
          }
          _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
          });
          let position = {
            getItemMin: function () {
              let indexItem = 0;
              _items.forEach(function (item, index) {
                if (item.position < _items[indexItem].position) {
                  indexItem = index;
                }
              });
              return indexItem;
            },
            getItemMax: function () {
              var indexItem = 0;
              _items.forEach(function (item, index) {
                if (item.position > _items[indexItem].position) {
                  indexItem = index;
                }
              });
              return indexItem;
            },
            getMin: function () {
              return _items[position.getItemMin()].position;
            },
            getMax: function () {
              return _items[position.getItemMax()].position;
            }
          }
          let _transformItem = function (direction) {
            let nextItem;
            if (direction === 'right') {
              _positionLeftItem++;
              if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                nextItem = position.getItemMin();
                _items[nextItem].position = position.getMax() + 1;
                _items[nextItem].transform += _items.length * 100;
                _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
              }
              _transform -= _step;
            }
            if (direction === 'left') {
              _positionLeftItem--;
              if (_positionLeftItem < position.getMin()) {
                nextItem = position.getItemMax();
                _items[nextItem].position = position.getMin() - 1;
                _items[nextItem].transform -= _items.length * 100;
                _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
              }
              _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
          }
  
          let _cycle = function (direction) {
            if (!_config.isCycling) {
              return;
            }
            _interval = setInterval(function () {
              _transformItem(direction);
            }, _config.interval);
          }
          let _controlClick = function (e) {
            if (e.target.classList.contains('slider__control')) {
              e.preventDefault();
              let direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
              _transformItem(direction);
              clearInterval(_interval);
              _cycle(_config.direction);
            }
          };
          let _setUpListeners = function () {
            _sliderControls.forEach(function (item) {
              item.addEventListener('click', _controlClick);
            });
            if (_config.pause && _config.isCycling) {
              _mainElement.addEventListener('mouseenter', function () {
                clearInterval(_interval);
              });
              _mainElement.addEventListener('mouseleave', function () {
                clearInterval(_interval);
                _cycle(_config.direction);
              });
            }
          }
          _setUpListeners();
          _cycle(_config.direction);
          return {
            right: function () { 
              _transformItem('right');
            },
            left: function () { 
              _transformItem('left');
            },
            stop: function () {
              _config.isCycling = false;
              clearInterval(_interval);
            },
            cycle: function () { 
              _config.isCycling = true;
              clearInterval(_interval);
              _cycle();
            }
          }
  
    }
}());
let slider = multiItemsSlider('.slider', {
    isCycling: true
  });

    $(".scroll").click(function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
        top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
    
    let getForm = document.querySelector('.pop-up');
    $('.pop-up-form__close').on('click', function(event){
      event.preventDefault();
      $(getForm).removeClass('active');
      
    });
    
    $('.btn-pop-up').on('click', function(event){
      event.preventDefault();
      $(getForm).addClass('active');
      
    });
    var changeBg = document.querySelector('.pop-up-container');
      var form = document.getElementById("my-form");
      var button = document.getElementById("my-form-button");
      var status = document.getElementById("my-form-status");
      var successMessage = document.getElementById("form__mesage");
      function success() {
        form.reset();
        $(form).addClass('hiden');
        $(successMessage).addClass('form__mesage-active');
        $(changeBg).addClass('bg');

      }
  
      function error() {
        status.innerHTML = "Oops! There was a problem.";
      }
      form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        var data = new FormData(form);
        ajax(form.method, form.action, data, success, error);
      });
});
    
  
    function ajax(method, url, data, success, error) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
          success(xhr.response, xhr.responseType);
        } else {
          error(xhr.status, xhr.response, xhr.responseType);
        }
      };
      xhr.send(data);
    }