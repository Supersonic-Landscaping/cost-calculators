// functions/mulching-calculator.js
export async function onRequest() {
    const mf   = JSON.parse(await Deno.readTextFile('./dist/manifest.json'));
    const file = mf['mulching'].file;
  
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${file}`,
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  }
  