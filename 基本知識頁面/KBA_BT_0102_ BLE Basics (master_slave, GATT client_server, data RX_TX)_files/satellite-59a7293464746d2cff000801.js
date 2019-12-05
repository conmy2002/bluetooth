_satellite.pushAsyncScript(function(event, target, $variables){
  function initMunchkin() {
  var munchkinId = "634-SLU-379";
  if (window.sl.currentRunMode === "dev" || window.sl.currentRunMode === "qa" || window.sl.currentRunMode === "stage") {
      munchkinId = "183-SCJ-412";
  }
  if (window.sl.currentRunMode === "prod") {
      munchkinId = "634-SLU-379";
  }
   Munchkin.init(munchkinId);
   marketoTags();
}
function marketoTags() {
   if ( typeof Munchkin !== 'undefined' && typeof window.munchkinTags !== 'undefined' && window.munchkinTags ) {
        var currentUrl = document.location.href.replace(window.location.search, '');
        Munchkin.munchkinFunction('visitWebPage', {
            url: currentUrl,
            params: window.munchkinTags
        });
    }
    else {
        if ( typeof window.munchkinTags !== 'undefined' ) {
            setTimeout(function () { marketoTags(); }, 10);
        }
    }
}
var s = document.createElement('script');
s.type = 'text/javascript';
s.async = true;
s.src = document.location.protocol + '//munchkin.marketo.net/munchkin.js';
s.onreadystatechange = function () {
    if (this.readyState == 'complete' || this.readyState == 'loaded') {
        initMunchkin;
    };
    s.onload = initMunchkin;
    document.getElementsByTagName('body')[0].appendChild(s);
}();
});
