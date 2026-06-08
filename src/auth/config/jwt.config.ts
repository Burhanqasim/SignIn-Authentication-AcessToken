import { registerAs } from "@nestjs/config";




export default registerAs("jwtConfig", ()=> ({
    secret :  process.env.JWT_SECRET,
    audience :  process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUANCE,
    accessTokenTTL : process.env.JWT_TOKEN_TIME_TTL ?? 3600,
    // accessRefreshTTL: ,
}))