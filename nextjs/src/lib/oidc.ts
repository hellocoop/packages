import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export type OIDC = {
    code_verifier: string,
    nonce: string,
    redirect_uri: string,
    target_uri: string
}

export const getOidc = async ( req: NextApiRequest): Promise<OIDC> => {

    return {
        code_verifier: '',
        nonce: '',
        redirect_uri:'',
        target_uri: ''
    }
 
}

export const saveOidc = async ( res: NextApiResponse, oidc: OIDC) => {

}

export const deleteOidc = ( res: NextApiResponse) => {
    return
}