


function swapRedisText(el,txt){

  if(!el){return;}
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()){
  a.push(n);
    let ntext=n.textContent;

  ntext=ntext.replace(/redis/gi,txt);

  if(ntext!=n.textContent){
    n.textContent=ntext;
  }

  };
  if(document.title.toLowerCase().includes('redis')){
    document.title=document.title
      .replace(/redis/gi,txt);
     }
  return a;
  }


if(window.location.href.toLowerCase().includes('rainbowis')){
declare(()=>{

swapRedisText(document.body,'Rainbowis');

});

}

void async function(){
  
await import('https://www.unpkg.com/javaxscript@1.1.31/framework.js');
  
  declare(()=>{
  
    queryApplyAll('a.z-50',(el)=>{
    
      el.updateAttribute('redis',window.location.hostname.split('.')[0]);
  
    });
  
  });

}();
