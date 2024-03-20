const cloudinary = require('cloudinary').v2;

const deleteFileFromCloudinary = (imgUrl) => {
  if (imgUrl.includes('cloudinary')) {
    const urlSplit = imgUrl.split('/');
    const folderName = urlSplit.at(-2);
    const fileName = urlSplit.at(-1).split('.')[0];

    const finalUrl = `${folderName}/${fileName}`;
    cloudinary.uploader.destroy(finalUrl, () => {
      console.log('Image deleted on Cloudinary');
    });
  }
};

module.exports = deleteFileFromCloudinary;