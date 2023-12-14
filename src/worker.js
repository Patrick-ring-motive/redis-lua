// @ts-nocheck
import util from 'node:util';



export default {
  fetch(request, env, ctx) {
    let response = onRequest(request,env,ctx);
    ctx.waitUntil(response)
    return response
  }
};





let luascriptRequest=`
return string.gsub(ARGV[1],"WORKERHOST","redis.io")
`;
let luascriptResponse=`
return string.gsub(ARGV[1],"redis.io","WORKERHOST")
`;

let luascriptBody=`
return string.gsub(string.gsub(ARGV[1],"</head>","<script src=https://redis-lua.vercel.app/framework.js></script><script src=https://redis-lua.vercel.app/redis-lua-scripts.js></script><link href=https://redis-lua.vercel.app/redis-lua-styles.css rel=stylesheet /></head>"),"<html","<html workerhost=WORKERHOST ")
`;


async function onRequest(request, env, ctx) {
  
if(!(globalThis.UPSTASH_REDIS_REST_URL)){
  globalThis.UPSTASH_REDIS_REST_TOKEN=env.UPSTASH_REDIS_REST_TOKEN;
  globalThis.UPSTASH_REDIS_REST_URL=env.UPSTASH_REDIS_REST_URL;
}
  const workerHost = request.headers.get('host');

  let luaRequest = JSON.parse(await evalLua(luascriptRequest.replace("WORKERHOST",workerHost),JSON.stringify(serializeHTTP(request))));

  let resp=await fetch(luaRequest.url,luaRequest);
  let respBody=resp.body;

  let requ = evalLua(luascriptResponse.replace("WORKERHOST",workerHost),JSON.stringify(serializeHTTP(resp)));
  //console.log(util.inspect(requ)=="Promise { <pending> }")
  if((resp.headers.has('content-type'))
    &&((resp.headers.get('content-type').includes('text'))
     ||(resp.headers.get('content-type').includes('script'))
     ||(resp.headers.get('content-type').includes('xml')))){
      respBody = await resp.text();
      respBody = evalLua(luascriptBody.replace("WORKERHOST",workerHost),respBody);
    }

  requ = JSON.parse(await requ);
  respBody = await respBody;
  console.log(requ);

  let respOut=new Response(respBody,requ);
  console.log(respOut)
  return respOut;
}


async function evalLua(script,input){

  const payload = JSON.stringify(["EVAL", script, 0, input]);
  const init = {method:"POST", headers: {"Authorization": "Bearer "+globalThis.UPSTASH_REDIS_REST_TOKEN}, body:payload}
  const requ = await fetch(globalThis.UPSTASH_REDIS_REST_URL+"",init);
  return (await requ.json()).result;

}


function serializeHTTP(re){
    let reDTO=Object.create(null);
    reDTO.headers={};
    for(let a in re){
      if((re[a]===null)||(a=='headers')||(a=='fetcher')||(a=='signal')){continue;}

      reDTO[a]=re[a];
      reDTO.headers[a]=re[a];
    }
    let reHeaders=(new Map(re.headers));
    for(const h of reHeaders){
      reDTO.headers[h]=reHeaders[h];
    }
    re.headers.forEach((value, key) => {
        reDTO.headers[key]=value;
    });

return reDTO;
}