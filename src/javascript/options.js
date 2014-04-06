({
  init: function() {
  var self = this;
  $(function() {
    self.loadOption();
    self.saveOption();
   });
  },

  loadOption: function() {
    // Load Service
    $("#api_key").val(localStorage["api_key"]);
    if (localStorage.getItem("service")) {
      var service = localStorage['service'].split(",");
      for (var i = 0; i < service.length; i++) {
        $("input[value="+service[i]+"]").attr("checked", true);
      }
    }
    if(localStorage['allow_notice'] == "off") {
      $("#allowed_notice").attr("checked", true);
    }
  },

  saveOption: function() {
  $("#save").click(function(){
    // Set Api key
    var api_key = $("#api_key").val();
    if (api_key != "") {
      localStorage['api_key'] = api_key.toString();
    }
    // Set Service
    var service=[];
    $('[name="service"]:checked').each(function(){
      service.push($(this).val());
    });
    localStorage['service'] = service.join(",");
    // Set is_allowed Notice
    if($("#allowed_notice").prop('checked')) {
      localStorage['allow_notice'] = "off";
    } else {
      localStorage['allow_notice'] = "on";
    }
  });
  }
}).init()
