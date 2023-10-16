export default function (client_id) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hellō Quickstart Result</title>
        <style>
            * { padding: 0; margin: 0; border: none; box-sizing: border-box; }
            html, body { height: 100%; }
            a { color: inherit;text-decoration: none; }
            a:hover, a:focus { text-decoration: underline; }
            a::after {
                content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" style="margin-left: 4px; margin-top: 4px; opacity: 0.8;" fill="none" viewBox="0 0 28 28" stroke="%23303030"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>')
            }
            .flash { animation: flash-animation 0.5s ease-in-out; }
            @keyframes flash-animation {
                0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }
            }
            @media (prefers-color-scheme: dark) {
                body { background-color: #151515; }
                body, header, #client-id { color: #d4d4d4 !important; }
                #client-id { background-color: #303030 !important; }
                a::after { filter: invert(1); }
            }
        </style>
        <script>
            async function copyClientId() {
                await navigator.clipboard.writeText("${client_id}")
                //copy flash animation
                document.querySelector("#client-id").classList.add("flash")
                setTimeout(() => {
                    document.querySelector("#client-id").classList.remove("flash")
                }, 500)
            }
        </script>
      </head>
      <body style="display: flex; flex-direction: column; color: #303030; font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;">
        <header style="background-color: #303030; color: white; height: 48px; display: flex; justify-content: center; align-items: center; font-size: 1.25rem; font-weight: 600;">Hellō Quickstart Result</header>
        <main style="flex: 1; padding: 24px; display: flex; flex-direction: column; align-items: center;">
            <div id="client-id-container" style="padding: 0 1rem; display: inline-flex; flex-direction: column; margin-top: 1rem;">
                <label for="client-id" style="font-size: 14px; font-weight: 500; text-align: left;">Client ID</label>
                <button id="client-id" onclick="copyClientId()" style="padding: 8px 0; height: auto; margin-top: 4px; text-align: left; border-radius: 6px; padding-left: 12px; padding-right: 12px; display: inline-flex; align-items: center; justify-content: center; background-color: #CBCFD5; color: #303030; font-size: 20px; cursor: pointer;">
                    <span style="margin-right: 8px; font-family: monospace;">${client_id}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" style="height: 1.25rem; width: 1.25rem" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>
            </div>
            <div style="margin-top: 24px; display: flex; flex-direction: column; align-items: flex-start;">
                You can update the:
                <ul style="margin: 10px 0; list-style-position: inside;">
                    <li>Application Logo</li>
                    <li>Application Name</li>
                    <li>Terms of Service URL</li>
                    <li>Privacy Policy URL</li>
                    <li>Redirect URIs</li>
                </ul>
                <a href="https://console.hello.coop/?client_id=${client_id}" style="font-weight: 500;">at the Hellō Developer Console</a>
            </div>
            <p style="margin: 48px 0; font-size: 26px;">You may now close this window.</p>
        </main>
      </body>
    </html>`
}