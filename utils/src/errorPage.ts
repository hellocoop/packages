export interface ErrorPageParams {
    target_uri: string
    error: string
    error_description?: string
    error_uri?: string
}

export function ErrorPage( { error, error_description, error_uri, target_uri }: ErrorPageParams ) {
    return `
        <html> 
        //TBD
        </html>
    `
}