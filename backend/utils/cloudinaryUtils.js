const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

exports.generateSignature = (folder = 'capsules') => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET
    );

    return { timestamp, signature };
};
