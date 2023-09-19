export default function() {
    return `
        <html>
            <head>
                <script>
                    const baseURL = window.location.href.split("?")[0]
                    const search = new URLSearchParams(window.location.search)
                    search.set("redirect_uri", window.location.href)
                    window.location.href = baseURL + search.toString()
                </script>
            </head>
        </html>
    `
}