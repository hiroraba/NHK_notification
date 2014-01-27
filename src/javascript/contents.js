({

  base_url_now : 'http://api.nhk.or.jp/v1/pg/now',
  base_url_list : 'http://api.nhk.or.jp/v1/pg/list',
  area : '130', //Tokyo
  service : 'g1',
  program: [],

  init : function(){
    var self = this;
    $(function() {
      self.getNowOnair();
      self.getNHKprogram();
      self.pollingProgram();
    });
  },

  pollingProgram: function() {
    var self = this;
    setInterval(function(){ self.noticeProgram(); }, 1000 * 60);
  },

  getNowOnair: function() {
    var self = this;
    var url_now = this.base_url_now + "/" + this.area + "/" + this.service + ".json";
    $("#nhk").click(function(){
      self.callApi(url_now);
    });
  },

  getNHKprogram: function() {
    var self = this;
    var today = self.getToday();
    var list_url = this.base_url_list + "/" + this.area + "/" + this.service + "/" + today + ".json";
    var program = self.callApi(list_url);
  },

  saveNHKprogram: function(program) {
    var program_array = program.list.g1;
    for (var i = 0 ; i < program_array.length; i++) {
      this.program[i] = {};
      this.program[i]["title"] = program_array[i].title;
      this.program[i]["subtitle"] = program_array[i].subtitle;
      this.program[i]["icon"] = program_array[i].service.logo_m.url;
      this.program[i]["start_time"] = Date.parse(program_array[i].start_time);
      this.program[i]["notice"] = 0;
    }
  },

  noticeProgram: function() {
    var self = this;
    var now = new Date();
    for (var i = 0 ; i < this.program.length; i++) {
      var diff = Math.abs(now - this.program[i]["start_time"]);
      if (diff < 1000 * 60 && this.program[i]["notice"] == 0) {
        this.program[i]["notice"] == 1;
        self.sendNotification(this.program[i]["icon"], this.program[i]["title"], this.program[i]["subtitle"]);
      }
    }
  },

  getToday: function() {
    var self = this;
    var date = new Date();
    var hour = date.getHours();
    if (hour < 4) {
      date.setDate(date.getDate()-1); 
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHour;
    month = ('0' + month).slice(-2);
    day = ('0' + day).slice(-2);
    return year + "-" + month + "-" + day;
  },

  callApi: function(api_url) {
    var self = this;
    var api_key = localStorage["api_key"];
    var url = api_url + "?key=" + api_key;
    $.ajax ({
      type: "GET",
      url : url.replace(/\s+/g, ""),
      datatype: 'json',
      success: function(msg) {
       for(var key in msg) {
         if (key == "list") {
           self.saveNHKprogram(msg);
         } else if (key == "nowonair_list") {
           var title = msg.nowonair_list.g1.present.title;
           var icon = msg.nowonair_list.g1.present.service.logo_s.url;
           var subtitle = msg.nowonair_list.g1.present.subtitle;
           self.sendNotification(icon, title, subtitle);
         }
       }
      },
      failure: function() {
        console.log("Fairure");
      }
    });
  },

  sendNotification: function(icon, title, subtitle) {
    window.webkitNotifications.createNotification(icon, title, subtitle);
    if ( webkitNotifications.checkPermission() == 0 ) {
      var popup = webkitNotifications.createNotification(icon, title, subtitle);
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
