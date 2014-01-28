window.onload = function() {
  $("#save").click(function(){
    var api_key = $("#api_key").val();
    if (api_key != "") {
      localStorage['api_key'] = api_key.toString();
    }
    var service=[];
    $('[name="service"]:checked').each(function(){
      service.push($(this).val());
    });
    localStorage['service'] = service.join(","); 
  });
}
