({
  init : function(){
    var self = this;
    $(function() {
      self.bindClick();
      self.bindWait();
    });
  },

  bindClick: function() {
    var self = this;
    $("#nhk").click(function(){
      self.callApi();
    });
  },

  bindWait: function() {
    var self = this;
    setInterval(function(){ self.callApi() }, 1000 * 60 * 60);
  },

  callApi: function() {
    var self = this;
    var url = "http://api.nhk.or.jp/v1/pg/now/130/g1.json";
    var api_key = localStorage["api_key"];
    $.ajax ({
      type: "GET",
      url : url + "?key=" +api_key,
      success: function(msg) {
        self.sendNotification(msg);
      },
      failure: function() {
        console.log("Fairure");
      }
    });
  },

  sendNotification: function(msg){
    var title = msg.nowonair_list.g1.present.title;
    var icon = msg.nowonair_list.g1.present.service.logo_s.url;
    var message = msg.nowonair_list.g1.present.subtitle;
    window.webkitNotifications.createNotification(icon, title, message);
    if ( webkitNotifications.checkPermission() == 0 ) {
      var popup = webkitNotifications.createNotification(icon, title, message);
      popup.ondisplay = function(){
        setTimeout(function(){
          popup.cancel();
        }, 5000);
      };
      popup.show();
    } else {
      webkitNotifications.requestPermission();
    }
  }
}).init();
