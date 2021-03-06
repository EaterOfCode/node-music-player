// these functions handle selection of songs and drawing the (right click) context menu

var optionsVisible = false;
var selectedItems = [];
var lastSelection = '';
function createOptions(x, y){
  // calculate if the menu should 'drop up'
  var dropup = "";
  if(y+300 > $(window).height()){
    dropup = "dropup";
  }
  $(".options_container").html(render("#options_template", {
      playlists: player.playlist_collection.models,
      current_playlist: player.playlist,
      dropup: dropup
    }))
    .css({"top": y+"px", "left": x+"px"});
  $(".add_to_queue").click(function(ev){
    player.play_history.unshift(lastSelection);
    player.play_history_idx++;
    hideOptions();
  });
  $(".add_to_playlist").click(function(ev){
    id = $(ev.target).closest("li").attr('id');
    socket.emit("add_to_playlist", {add: selectedItems, playlist: id});
    hideOptions();
  });
  $(".remove_from_playlist").click(function(ev){
    id = $(ev.target).closest("li").attr('id');
    for (var i = 0; i < selectedItems.length; i++) {
      $("#"+selectedItems[i]).remove();
    }
    socket.emit("remove_from_playlist", {remove: selectedItems, playlist: id});
    hideOptions();
  });
  $(".hard_rescan").click(function(ev){
    socket.emit("hard_rescan", {items: selectedItems});
    hideOptions();
  });
  $(".view_info").click(function(ev){
    shoInfoView(selectedItems);
    hideOptions();
  });
  optionsVisible = true;
}
function hideOptions(){
  $(".options_container").css({"top:": "-1000px", "left": "-1000px"});
  optionsVisible = false;
}
function addToSelection(id, clearIfIn){
  lastSelection = id;
  for (var i = 0; i < selectedItems.length; i++) {
    if(selectedItems[i] == id){
      if(clearIfIn){
        selectedItems.splice(i, 1);
        $("#"+id).removeClass("selected");
      }
      return;
    }
  }
  selectedItems.push(id);
  $("#"+id).addClass("selected");
}
function delFromSelection(id){
  for (var i = 0; i < selectedItems.length; i++) {
    if(selectedItems[i] == id){
      selectedItems.splice(i, 1);
      $("#"+id).removeClass("selected");
    }
  }
}
function selectBetween(id, id2){
  loc1 = indexInSongView(id);
  loc2 = indexInSongView(id2);
  // make sure loc1 is less than loc2
  if(loc1 > loc2){
    temp = loc1;
    loc1 = loc2;
    loc2 = temp;
  }
  for(var i = loc1; i <= loc2; i++){
    addToSelection(player.songs[i].attributes._id, false);
  }
}
function indexInSongView(id){
  for(var i = 0; i < player.songs.length; i++){
    if(player.songs[i].attributes._id == id){
      return i;
    }
  }
  return -1;
}
function clearSelection(){
  selectedItems = [];
  $("tr").removeClass("selected");
}
