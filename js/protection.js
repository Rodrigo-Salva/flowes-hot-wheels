(function(){
try{
var allowed=["rodrigo-salva.github.io"];
var h=location.hostname;
if(allowed.indexOf(h)===-1&&h!=='localhost'&&h!=='127.0.0.1'){
document.documentElement.innerHTML='<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#fbf3ec;color:#2b1b1e;text-align:center;padding:24px"><div><p style="font-size:1.05rem;margin:0 0 .5rem">Esta dedicatoria solo funciona en su sitio original.</p><p style="font-size:.85rem;opacity:.7;margin:0">Parece que este archivo fue copiado o abierto desde otro lugar.</p></div></body>';
return;
}
}catch(e){}
try{
document.addEventListener('contextmenu',function(e){e.preventDefault();});
document.addEventListener('dragstart',function(e){e.preventDefault();});
document.addEventListener('keydown',function(e){
var k=e.key;
var blocked=k==='F12'
||(e.ctrlKey&&e.shiftKey&&['I','i','J','j','C','c','K','k'].indexOf(k)!==-1)
||(e.ctrlKey&&(k==='u'||k==='U'||k==='s'||k==='S'))
||(e.metaKey&&e.altKey&&['I','i','J','j'].indexOf(k)!==-1);
if(blocked)e.preventDefault();
});
}catch(e){}
})();
