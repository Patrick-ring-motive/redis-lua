


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
  if(document.title.toLowerCase().includes('ruby')){
    document.title=document.title
      .replace(/ruby/gi,'Sapphire')
     }
  return a;
  }


if(window.location.href.toLowerCase().includes('rainbowis')){
declare(()=>{

swapRedisText(document.body,'Rainbowis');

});

}



