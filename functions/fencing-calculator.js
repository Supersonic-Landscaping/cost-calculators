// functions/hedge-calculator.js
export async function onRequest() {
    const mf   = JSON.parse(await Deno.readTextFile('./dist/manifest.json'));
    const file = mf['fencing'].file;  // matches your Vite input key
  
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${file}`,                  // e.g. "/hedge-calculator.js"
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  }
  