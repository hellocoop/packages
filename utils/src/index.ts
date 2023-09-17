

// validScopes - returns array of valid scopes

// isValidScope - checks if scope is valid

// pkce
//  returns { code_verifier, code_challenge }

// verifyChallenge ( code_verifier, expectedChallenge )

// generateChallenge ( code_verifier )
// returns a code challenge

// createAuthRequest
// required 
//      client_id
// optional
//      scope
//      response_type - id_token (default  code)
//      response_mode - fragment query (default form_post)
//      endpoint
//      nonce
//      state
//      provider_hint
//      
// returns 
//      { url, nonce, code_verifier }
// 

// export { default as createAuthRequest } from './createAuthRequest'
// export { default as validScopes } from './scopes'
// export { isValidScope } from './scopes'
export { default as pkce } from './pkce'
export { verifyChallenge, generateChallenge } from './pkce'
