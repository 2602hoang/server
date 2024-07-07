import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuration
cloudinary.config({ 
    cloud_name: 'dzldyflpv', 
    api_key: '714246474463461', 
    api_secret: 'SFLpPmS2IdC13XMNcZesFdIO3m4'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ["jpg", "png"],
    params: {
        folder: "fullstack",
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    }
});

const upload = multer({ storage: storage });

export { upload, cloudinary };
