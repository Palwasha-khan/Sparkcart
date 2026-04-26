import cloudinary from "cloudinary";
import  dotenv from "dotenv";

dotenv.config({ path : 'backend/config/config.env'})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder,
      },
      (error, result) => {  
        if (error) {
          console.log("Cloudinary Error:", error);
          return reject(error);
        }
        resolve({
          public_id: result.public_id,
          url: result.url,
        });
      }
    );
  });
};

export const delete_file = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      public_id,
      (result) => {
        resolve(result);
      }
    );
  });
};
 


export default cloudinary;
