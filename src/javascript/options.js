window.onload = function() {
  $("#save").click(function(){
    var api_key = $("#api_key").val();
    localStorage['api_key'] = api_key.toString();
  });
}
