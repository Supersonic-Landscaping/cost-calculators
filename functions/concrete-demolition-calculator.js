// File: /functions/concrete-demolition-calculator.js
export async function onRequest() {
    // Read the manifest to find the latest hashed file
    const manifest = JSON.parse(await Deno.readTextFile('./dist/manifest.json'));
    const file = manifest['concrete-demolition'].file;
  
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${file}`,
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  }