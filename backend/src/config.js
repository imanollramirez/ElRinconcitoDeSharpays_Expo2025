import dotenv from "dotenv";
dotenv.config();

export const config = {
  db: {
    URI: process.env.DB_URI,
  },
  server: {
    port: process.env.PORT,
  },
  JWT: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
  ADMIN: {
    emailAdmin: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  email: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS
  },
  cloudinary: {
    cloudinary_name: process.env.CLAUDINARY_NAME,
    cloudinary_api_key: process.env.CLAUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLAUDINARY_API_SECRET
  },
  wompi: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: process.env.GRANT_TYPE,
    audience: process.env.AUDIENCE,
  }


}