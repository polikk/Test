"use strict";

window.addEventListener("DOMContentLoaded", function () {
  var multiItemsSlider = function () {
    return function (selector, config) {
      var _mainElement = document.querySelector(selector);

      var _sliderWrapper = _mainElement.querySelector('.slider__wrapper');

      var _sliderItems = _mainElement.querySelectorAll('.slider__item');

      var _sliderControls = _mainElement.querySelectorAll('.slider__control');

      var _sliderControlLeft = _mainElement.querySelector('.slider__control_left');

      var _sliderControlRight = _mainElement.querySelector('.slider__control_right');

      var _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);

      var _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);

      var _positionLeftItem = 0;
      var _transform = 0;

      var _step = _itemWidth / _wrapperWidth * 100;

      var _items = [];
      var _interval = 0;
      var _config = {
        isCycling: false,
        direction: 'right',
        interval: 3000,
        pause: false
      };

      for (var key in config) {
        if (key in _config) {
          _config[key] = config[key];
        }
      }

      _sliderItems.forEach(function (item, index) {
        _items.push({
          item: item,
          position: index,
          transform: 0
        });
      });

      var position = {
        getItemMin: function getItemMin() {
          var indexItem = 0;

          _items.forEach(function (item, index) {
            if (item.position < _items[indexItem].position) {
              indexItem = index;
            }
          });

          return indexItem;
        },
        getItemMax: function getItemMax() {
          var indexItem = 0;

          _items.forEach(function (item, index) {
            if (item.position > _items[indexItem].position) {
              indexItem = index;
            }
          });

          return indexItem;
        },
        getMin: function getMin() {
          return _items[position.getItemMin()].position;
        },
        getMax: function getMax() {
          return _items[position.getItemMax()].position;
        }
      };

      var _transformItem = function _transformItem(direction) {
        var nextItem;

        if (direction === 'right') {
          _positionLeftItem++;

          if (_positionLeftItem + _wrapperWidth / _itemWidth - 1 > position.getMax()) {
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
      };

      var _cycle = function _cycle(direction) {
        if (!_config.isCycling) {
          return;
        }

        _interval = setInterval(function () {
          _transformItem(direction);
        }, _config.interval);
      };

      var _controlClick = function _controlClick(e) {
        if (e.target.classList.contains('slider__control')) {
          e.preventDefault();
          var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';

          _transformItem(direction);

          clearInterval(_interval);

          _cycle(_config.direction);
        }
      };

      var _setUpListeners = function _setUpListeners() {
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
      };

      _setUpListeners();

      _cycle(_config.direction);

      return {
        right: function right() {
          _transformItem('right');
        },
        left: function left() {
          _transformItem('left');
        },
        stop: function stop() {
          _config.isCycling = false;
          clearInterval(_interval);
        },
        cycle: function cycle() {
          _config.isCycling = true;
          clearInterval(_interval);

          _cycle();
        }
      };
    };
  }();

  var slider = multiItemsSlider('.slider', {
    isCycling: true
  });
  $(".scroll").click(function (event) {
    event.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top;
    $('body,html').animate({
      scrollTop: top
    }, 1000);
  });
  var getForm = document.querySelector('.pop-up');
  $('.pop-up-form__close').on('click', function (event) {
    event.preventDefault();
    $(getForm).removeClass('active');
  });
  $('.btn-pop-up').on('click', function (event) {
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

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var data = new FormData(form);
    ajax(form.method, form.action, data, success, error);
  });
});

function ajax(method, url, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;

    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };

  xhr.send(data);
}