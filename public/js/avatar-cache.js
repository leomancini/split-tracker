document.addEventListener('touchstart',function(){},false);

// Prevent iOS viewport shift when keyboard opens
document.addEventListener('focusin', function(e){
  if(e.target.matches('input,textarea') && !e.target.closest('#add-expense-form')){
    setTimeout(function(){ window.scrollTo(0,0); }, 50);
  }
});

// Cache avatars to avoid Google rate limits
var avatarCache = {};
(function(){
  // Load all cached avatars from sessionStorage
  for(var i=0;i<sessionStorage.length;i++){
    var k = sessionStorage.key(i);
    if(k.indexOf('avc_')===0) avatarCache[k.slice(4)] = sessionStorage.getItem(k);
  }
  // Set nav avatar
  var navImg = document.querySelector('.user-info img[data-avatar-url]');
  if(navImg){
    var url = navImg.getAttribute('data-avatar-url');
    if(avatarCache[url]) navImg.src = avatarCache[url];
    else cacheAvatar(url, function(data){ navImg.src = data; });
  }
})();
function cacheAvatar(url, cb){
  if(!url || avatarCache[url]) return;
  avatarCache[url] = url; // mark in-flight
  fetch(url).then(function(r){ return r.blob(); }).then(function(blob){
    var reader = new FileReader();
    reader.onloadend = function(){
      avatarCache[url] = reader.result;
      try{ sessionStorage.setItem('avc_'+url, reader.result); }catch(e){}
      if(cb) cb(reader.result);
    };
    reader.readAsDataURL(blob);
  }).catch(function(){});
}
function getCachedAvatar(url){ return avatarCache[url] || url; }
