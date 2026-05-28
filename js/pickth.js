(function() {
  if (!window.jQuery) return;

  jQuery(function($) {
    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
        $('.jcm-top').show();
      } else {
        $('.jcm-top').hide();
      }
    });

    $('.jcm-top').click(function() {
      $('html, body').animate({ scrollTop: 0 }, 400);
      return false;
    });
  });
}());
