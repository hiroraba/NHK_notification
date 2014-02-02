({

  base_url_now : 'http://api.nhk.or.jp/v1/pg/now',
  base_url_list : 'http://api.nhk.or.jp/v1/pg/list',
  area : '130', //Tokyo
  program: [],

  init : function(){
    var self = this;
    var service = localStorage["service"].split(",");
    $(function() {
      self.getNowOnair(service);
      self.pollingProgram();
      for (var i = 0; i < service.length; i++) {
        self.getNHKprogram(service[i]);
      }
    });
  },

  getNowOnair: function() {
    var self = this;
    var url_now = this.base_url_now + "/" + this.area + "/";
    $("[name=now_service]").click(function(){
       var service = $(this).attr("value");
       self.callApi(url_now + service + ".json");
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
    var title = JSONSelect.match('.title', program);
    var subtitle = JSONSelect.match('.subtitle', program);
    var icon = JSONSelect.match('.service .logo_m .url', program);
    var start_time = JSONSelect.match('.start_time', program);
    
    for (var i = 0 ; i < title.length; i++) {

      var new_program = {
        title: title[i],
        subtitle: subtitle[i],
        icon: icon[i],
        start_time: Date.parse(start_time[i]),
        notice: 0
      }

      this.program.push(new_program);
    }
    console.log(this.program);
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
          self.dispatch(msg, key)
        }
      },
      failure: function() {
        console.log("Fairure");
      }
    });
  },

  dispatch: function(msg, key) {
    var self = this;
    
    switch(key){
      case "list":
        self.saveNHKprogram(msg);
        break;
      case "nowonair_list":
        var title = JSONSelect.match('.present .title', msg);
        var subtitle = JSONSelect.match('.present .subtitle', msg);
        var icon = JSONSelect.match('.present .service .logo_m .url', msg);
        self.sendNotification(icon, title, subtitle);
        break;
      default:
      break;
    }
  },

  sendNotification: function(icon,title,subtitle) {
    console.log(icon);
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
