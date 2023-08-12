const Jimp = require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");
const cloudinary = require("../util/cloudinaryConfig");

class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;

    let imagePath;
    if (avatar) {
      let imagesnew = "";
      if (typeof avatar === "string") {
        imagesnew = avatar;
      }

      let imagesLink = "";
      const result = await cloudinary.uploader.upload(imagesnew, {
        folder: "InternetRadio",
      });
      imagesLink = result.secure_url;
      imagePath = imagesLink;
    }   else {
      imagePath = `${process.env.BASE_URL}/storage/monkey-img.png`;
    }

    if (!name) {
      res.status(400).json({ message: "All fields are required" });
    }
    
    const userId = req.user._id;

    try {
      const user = await userService.findUser({ _id: userId });

      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      user.activated = true;
      user.name = name;
      user.avatar = imagePath;
      user.save();
      res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

module.exports = new ActivateController();
