import { registerAs } from "@nestjs/config";

export default registerAs("profileConfig", ()=> ({
   profile_key :  process.env.PROFILE_KEY
}))