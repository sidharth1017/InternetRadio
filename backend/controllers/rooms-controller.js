const roomService = require("../services/room-service");
const RoomDto = require("../dtos/room-dto");

class RoomsController {
  async create(req, res) {
    const { topic, roomType } = req.body;

    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id,
    });

    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const rooms = await roomService.getAllRooms(["open", "social"]);
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json(allRooms);
  }

  async show(req, res) {
    const room = await roomService.getRoom(req.params.roomId);
    if (!room) {
      return res.status(408).json({ message: "Room not found" });
    } else {
      return res.json(room);
    }
  }

  async delete(req, res) {
    try {
      const room = await roomService.getRoom(req.params.roomId);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      await room.deleteOne();

      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

module.exports = new RoomsController();
