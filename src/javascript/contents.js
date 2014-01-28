({

  base_url_now : 'http://api.nhk.or.jp/v1/pg/now',
  base_url_list : 'http://api.nhk.or.jp/v1/pg/list',
  area : '130', //Tokyo
  service: "g1",
  program: [],

  init : function(){
    var self = this;
    var service = localStorage["service"].split(",");
    $(function() {
      self.getNowOnair();
      self.pollingProgram();
      for (var i = 0; i < service.length; i++) {
        self.getNHKprogram(service[i]);
      }
    });
  },

  getNowOnair: function() {
    var self = this;
    var url_now = this.base_url_now + "/" + this.area + "/" + this.service + ".json";
    $("#nhk").click(function(){
      self.callApi(url_now);
    });
  },

  pollingProgram: function() {
    var self = this;
    setInterval(function(){ self.noticeProgram(); }, 1000 * 20);
  },

  getNHKprogram: function(service) {
    var self = this;
    var today = self.getToday();
    var list_url = this.base_url_list + "/" + this.area + "/" + service + "/" + today + ".json";
    self.callApi(list_url);
  },

  saveNHKprogram: function(program) {
    for (var i = 0 ; i < program.length; i++) {

      var new_program = {
        title: program[i].title,
        subtitle: program[i].subtitle,
        icon: program[i].service.logo_m.url,
        start_time: Date.parse(program[i].start_time),
        notice: 0
      }

      this.program.push(new_program);
    }
  },

  noticeProgram: function() {
    var self = this;
    var now = new Date();
    for (var i = 0 ; i < this.program.length; i++) {
      var diff = Math.abs(now - this.program[i]["start_time"]);
      if (diff < 1000 * 20 && this.program[i]["notice"] == 0) {
        this.program[i]["notice"] = 1;
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
            self.dispatchList(msg.list);
          } else if (key == "nowonair_list") {
            self.sendNotification(msg.nowonair_list.g1.present.service.logo_m.url
              , msg.nowonair_list.g1.present.title
              , msg.nowonair_list.g1.present.subtitle);
          }
        }
      },
      failure: function() {
        console.log("Fairure");
      }
    });
  },

  dispatchList: function(list) {
    var self = this;
    for (var key in list) {
      switch(key) {
        case "g1":
          service = list.g1;
        break;
        case "e1":
          service = list.e1;
        break;
        case "s1":
          service = list.s1;
        break;
        case "s3":
          service = list.s3;
        break;
        case "r3":
          servive = list.r3;
        break;
        default:
          break;
      }
    }
    self.saveNHKprogram(service);
  },

  sendNotification: function(icon,title,subtitle) {
    window.webkitNotifications.createNotification(icon, title, subtitle);
    if ( webkitNotifications.checkPermission() == 0 ) {
      var popup = webkitNotifications.createNotification(icon, title, subtitle);
      popup.ondisplay = function(){
        setTimeout(function(){
          popup.cancel();
        }, 1000 * 30);
      };
      popup.show();
    } else {
      webkitNotifications.requestPermission();
    }
  }
}).init();
