'use strict';

function Movel(elem) {
  // Animation
  function animate(options) {
    var start = performance.now();

    requestAnimationFrame(function animate(time) {
      // timeFraction от 0 до 1
      var timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1;

      // текущее состояние анимации
      var progress = options.timing(timeFraction);

      options.draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }

    });
  }

  // Get random interval min/max
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Get random top coords
  function getCoordsTop(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();
    var top = box.top + pageYOffset;
    return top;
  }

  // Get random left coords
  function getCoordsLeft(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();
    var left = box.left + pageXOffset;
    return left;
  }

  this.elem = document.querySelectorAll(elem.elem);

  if (elem.elem === undefined) {
    this.elem = document.querySelectorAll(".moving-element");
  }

  var elemsArr = this.elem;

  [].forEach.call(elemsArr, function (el) {
    // Moving
    var startMove = function () {
      var minDuration = elem.minDuration;
      var maxDuration = elem.maxDuration; // also min timeout
      var maxTimeout = elem.maxTimeout;

      if (minDuration === undefined) {
        minDuration = 300;
      }
      if (maxDuration === undefined) {
        maxDuration = 1000;
      }
      if (maxTimeout === undefined) {
        maxTimeout = 3000;
      }

      var randomIntDuration = getRandomArbitrary(minDuration, maxDuration);
      var randomIntTimeout = getRandomArbitrary(maxDuration, maxTimeout);

      var moveProcess = function () {
        this.zone = document.querySelector(elem.zone);
        var FULL_SIZE = 100; // 100%
        var topCords = el.getBoundingClientRect().top;
        var leftCords = el.getBoundingClientRect().left;
        var elWidth = el.getBoundingClientRect().width;
        var elHeight = el.getBoundingClientRect().height;
        var zoneWidth = document.documentElement.clientWidth;
        var zoneHeight = document.documentElement.clientHeight;
        var minRandomTop;
        var maxRandomTop;
        var minRandomLeft;
        var maxRandomLeft;
        var topMoving;
        var leftMoving;

        if (this.zone !== null) {
          zoneWidth = this.zone.clientWidth;
          zoneHeight = this.zone.clientHeight;
          var topCordsZone = getCoordsTop(this.zone);
          var leftCordsZone = getCoordsLeft(this.zone);
          topMoving = getCoordsTop(el) - topCordsZone;
          leftMoving = getCoordsLeft(el) - leftCordsZone;
          minRandomTop = topCordsZone;
          maxRandomTop = topCordsZone + zoneHeight;
          minRandomLeft = leftCordsZone;
          maxRandomLeft = leftCordsZone + zoneWidth;

          if (topMoving < maxRandomTop) {
            minRandomTop = -1 * topMoving;
          }

          if (leftMoving < maxRandomLeft) {
            minRandomLeft = -1 * leftMoving;
          }

          if (zoneHeight - topMoving < maxRandomTop) {
            maxRandomTop = zoneHeight - topMoving;
          }

          if (zoneWidth - leftMoving < maxRandomLeft) {
            maxRandomLeft = zoneWidth - leftMoving;
          }

          maxRandomTop = maxRandomTop - elHeight;
          maxRandomLeft = maxRandomLeft - elWidth;
        } else {
          minRandomTop = -1 * FULL_SIZE;
          maxRandomTop = FULL_SIZE;
          minRandomLeft = -1 * FULL_SIZE;
          maxRandomLeft = FULL_SIZE;

          elWidth = (elWidth / zoneWidth) * FULL_SIZE;
          elHeight = (elHeight / zoneHeight) * FULL_SIZE;

          topMoving = (topCords / zoneHeight) * FULL_SIZE;
          leftMoving = (leftCords / zoneWidth) * FULL_SIZE;

          if (topMoving < maxRandomTop) {
            minRandomTop = -1 * topMoving;
          }

          if (FULL_SIZE - topMoving < maxRandomTop) {
            maxRandomTop = FULL_SIZE - topMoving;
          }

          if (leftMoving < maxRandomLeft) {
            minRandomLeft = -1 * leftMoving;
          }

          if (FULL_SIZE - leftMoving < maxRandomLeft) {
            maxRandomLeft = FULL_SIZE - leftMoving;
          }

          maxRandomTop = maxRandomTop - elHeight;
          maxRandomLeft = maxRandomLeft - elWidth;
        }

        var randomIntTop = getRandomArbitrary(minRandomTop, maxRandomTop);
        var randomIntLeft = getRandomArbitrary(minRandomLeft, maxRandomLeft);

        animate({
          duration: randomIntDuration,
          timing: function (timeFraction) {
            return timeFraction;
          },
          draw: function (progress) {
            if (elem.zone) {
              el.style.top = topMoving + progress * randomIntTop + 'px';
              el.style.left = leftMoving + progress * randomIntLeft + 'px';
            } else {
              el.style.top = topMoving + progress * randomIntTop + '%';
              el.style.left = leftMoving + progress * randomIntLeft + '%';
            }
          }
        });

        startMove();
      };

      setTimeout(moveProcess, randomIntTimeout);
    };

    startMove();
  });
}
