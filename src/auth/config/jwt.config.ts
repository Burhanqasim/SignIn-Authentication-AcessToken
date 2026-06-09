import { registerAs } from "@nestjs/config";




// @ts-ignore
export default registerAs("jwtConfig", ()=> ({
    secret :  process.env.JWT_SECRET,
    audience :  process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUANCE,
    accessTokenTTL : parseInt(process.env.JWT_TOKEN_TIME_TTL ?? '3600'),
    accessRefreshTTL: parseInt(process.env.JWT_TOKEN_TIME_TTL ?? '86400'),
}))