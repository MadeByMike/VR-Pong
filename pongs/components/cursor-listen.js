AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('click', function () {
      var elms = document.querySelectorAll('.laser-on')
      for (var i = 0, len = elms.length; i < len; i++) {
          elms[i].setAttribute("visible", "true");
      }
    });
  }
});
