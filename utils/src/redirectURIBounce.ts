export default function() {
    return `
        <html>
            <head>
                <script>
                    let redirect = '/api/hellocoop'

                    if (window.location.search) {
                        redirect += window.location.search
                    } else if (window.location.hash) {
                        redirect += window.location.hash.substring(1) // Remove hash character
                    }

                    window.location.href = redirect
                </script>
            </head>
        </html>
    `
}