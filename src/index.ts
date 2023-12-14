/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

if(!globalThis.cache){
  globalThis.cache={};
}


export default {
  fetch(request,env,ctx) {
   
  let eventResponse = handleRequest(request,env,ctx);
  return eventResponse;
}
};



async function handleRequest(request,env,ctx) {
try{
 console.log(await env.KVCache.list());



let urlpat=request.url;


let url = new URL(urlpat);
let urlParams = url.searchParams;

const hostProxy = url.hostname;



url.hostname = 'www.geeksforgeeks.org';


let modifiedRequest = new Request(url, {

body: request.body,

headers: request.headers,

method: request.method

});

let response;

if(globalThis.cache[url.toString()]){
  let resDTO = globalThis.cache[url.toString()];
  response = new Response(resDTO.body,resDTO.options);

  return response;

}else{

response = await fetch(modifiedRequest);
let bodyBuffer=await response.arrayBuffer();
globalThis.cache[url.toString()] = {body:bodyBuffer,options:response};

let resDTO = globalThis.cache[url.toString()];
response = new Response(resDTO.body,resDTO.options);


return response;

}



}catch(e){

    return  new Response("500 "+e?.message, {status:500});
  
  }


}





async function streamBody(readable, writable) {


return readable.pipeTo(writable);

}



