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
      imagePath = "http://localhost:5500/storage/monkey-img.png";
    }

    if (!name) {
      res.status(400).json({ message: "All fields are required" });
    }

    // let imagePath;
    // if (avatar) {
    //   const buffer = Buffer.from(
    //     avatar.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, ""),
    //     "base64"
    //   );
    //   imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    //   try {
    //     const jimResp = await Jimp.read(buffer);
    //     jimResp
    //       .resize(150, Jimp.AUTO)
    //       .write(path.resolve(__dirname, `../storage/${imagePath}`));
    //   } catch (err) {
    //     res.status(500).json({ message: "Could not process the image" });
    //   }
    // } else {
    //     imagePath = "monkey-img.png";
    // }

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
