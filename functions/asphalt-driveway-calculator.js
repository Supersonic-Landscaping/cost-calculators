// /functions/asphalt-driveway-calculator.js
export async function onRequest() {
    const manifest = JSON.parse(await Deno.readTextFile('./dist/manifest.json'));
    const file     = manifest['asphalt-driveway'].file;
  
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${file}`,
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  }
  