import homepage from 'index.html';

async function handleRequest(request, env) {
  const Url = new URL(request.url);
  const path = Url.pathname;
  if (path === '/') {
    return new Response(homepage, { 
      headers: { 'Content-Type': 'text/html' }
    })
  } else if (path === '/api/search') {
        let res = await fetch('https://tomp3.cc/api/ajax/search', {
            method: 'POST',
            body: request.body,
            headers: {
                "accept": "*/*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            }
        })
        return new Response(res.body, {
            headers: { "content-type": "application/json" }
        })
  } else if (path === '/download') {
        let res = await fetch('https://tomp3.cc/api/ajax/convert', {
            method: 'POST',
            body: new URLSearchParams({vid: Url.searchParams.get("vid"), k: Url.searchParams.get("file")}).toString(),
            headers: {
                "accept": "*/*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            }
        })
        let body = await res.json();
        res = await fetch(body.dlink)
        return new Response(res.body, { 
            headers: { 
                'content-length': res.headers['content-length'],
                'content-type': res.headers['content-type'],
                'content-disposition': `attachment; filename=${body.title}.${body.ftype}`,
            }
        })
    
  }
}

export default {
  async fetch(request, env, ctx) {
    return await handleRequest(request, env)
  },
};