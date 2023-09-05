export default function (client_id) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hellō Client ID</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                border: none;
                box-sizing: border-box;
            }
            a {
                color: inherit;
                text-decoration: none;
            }
            a::after {
                content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" style="margin-left: 4px; margin-top: 4px; opacity: 0.8;" fill="none" viewBox="0 0 28 28" stroke="%23303030"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>')
            }
            a:hover, a:focus {
                text-decoration: underline;
            }
            html, body {
                height: 100%;
            }
            body {
                font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
                text-align: center;
                color: #303030;
            }
            header {
                color: white;
            }
            #client-id {
                padding: 0.5rem 0;
                height: auto;
                margin-top: 0.25rem;
                text-align: left;
                border-radius: 0.375rem;
                padding-left: 0.75rem;
                padding-right: 0.75rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: #CBCFD5;
                color: #303030;
                font-size: 1.28rem;
                cursor: pointer;
            }
            .flash {
                animation: flash-animation 0.5s ease-in-out;
            }
    
            @keyframes flash-animation {
                0% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    opacity: 1;
                }
            }
            @media (prefers-color-scheme: dark) {
                body {
                    background-color: #151515;
                    color: #d4d4d4;
                }
                header {
                    color: #d4d4d4;
                }
                #client-id {
                    background-color: #303030;
                    color: #d4d4d4;
                }
                a::after {
                    content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" style="margin-left: 4px; margin-top: 4px; opacity: 0.8;" fill="none" viewBox="0 0 28 28" stroke="%23d4d4d4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>')
                }
            }
        </style>
        <script defer="" src="https://cdn.hello.coop/js/hello-dev-wc-footer.js"></script>
        <script>
            async function copyClientId() {
                await navigator.clipboard.writeText("${client_id}")
                
                //copied flash animation
                document.querySelector("#client-id").classList.add("flash")
                setTimeout(() => {
                    document.querySelector("#client-id").classList.remove("flash")
                }, 500)
            }
        </script>
      </head>
      <body style="display: flex; flex-direction: column;">
        <header style="background-color: #303030; height: 48px; display: flex; justify-content: center; align-items: center; font-size: 1.25rem; font-weight: 600;">
            Hellō
        </header>
        <main style="flex: 1; padding: 24px;">
            <div id="client-id-container" style="padding: 0 1rem; display: inline-flex; flex-direction: column; margin-top: 1rem;">
                <label for="client-id" style="font-size: 0.92rem; font-weight: 500; text-align: left;">Client ID</label>
                <button id="client-id" onclick="copyClientId()">
                    <span style="margin-right: 0.5rem;">${client_id}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" style="height: 1.25rem; width: 1.25rem" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px; margin-top: 24px;">
                <p><a href="https://console.hello.coop/?client_id=${client_id}">Update your application at Hellō Developer Console</a></p>
                <p style="display: flex; justify-content: center; align-items: center; gap: 20px;">
                    <a href="https://www.hello.coop/">Learn more about Hellō</a>
                    <a href="https://www.hello.dev/">Hellō Developer Docs</a>
                </p>
            </div>
            <p style="opacity: 0.8; margin-top: 44px;">You can now close this window.</p>
        </main>
        <wc-footer/>
      </body>
    </html>`
}