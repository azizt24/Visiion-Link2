import Rooms from "../models/Rooms.js";
import User from "../models/User.js";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";

const roomHandler = (socket) => {
  socket.on(
    "create-room",
    async ({ userId, roomName, newMeetType, newMeetDate, newMeetTime }) => {
      try {
        const newRoom = new Rooms({
          roomName: roomName,
          host: userId,
          meetType: newMeetType,
          meetDate: newMeetDate,
          meetTime: newMeetTime,
          participants: [],
          currentParticipants: [],
        });
        const room = await newRoom.save();
        await socket.emit("room-created", {
          roomId: room._id,
          meetType: newMeetType,
        });
      } catch (error) {
        console.error("Error in create-room event:", error);
        socket.emit("error", { message: "Error creating room" });
      }
    }
  );

  socket.on("user-code-join", async ({ roomId }) => {
    const room = await Rooms.findOne({ _id: roomId });
    if (room) {
      await socket.emit("room-exists", { roomId });
    } else {
      socket.emit("room-not-exist");
    }
  });

  socket.on("request-to-join-room", async ({ roomId, userId }) => {
    const room = await Rooms.findOne({ _id: roomId });

    if (!room) {
      socket.emit("room-not-exist");
      return;
    }

    if (userId === room.host) {
      socket.emit("join-room", { roomId, userId });
    } else {
      socket.emit("requesting-host", { userId });
      socket.broadcast.to(roomId).emit("user-requested-to-join", {
        participantId: userId,
        hostId: room.host,
      });
    }
  });

  socket.on("join-room", async ({ roomId, userId }) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        console.error(`Invalid ObjectId for user: ${userId}`);
        socket.emit("error", { message: "Invalid user ID" });
        return;
      }

      const objectIdUserId = Types.ObjectId(userId);

      await Rooms.updateOne(
        { _id: roomId },
        { $addToSet: { participants: objectIdUserId } }
      );
      await Rooms.updateOne(
        { _id: roomId },
        { $addToSet: { currentParticipants: objectIdUserId } }
      );
      await socket.join(roomId);

      console.log(`User: ${user.username} joined room: ${roomId}`);
      await socket.broadcast.to(roomId).emit("user-joined", { userId });
    } catch (error) {
      console.error("Error in join-room event:", error);
      socket.emit("error", { message: "Error joining room" });
    }
  });

  socket.on("get-participants", async ({ roomId }) => {
    const room = await Rooms.findOne({ _id: roomId });

    if (!room) {
      socket.emit("room-not-found", { roomId });
      return;
    }

    const roomName = room.roomName;
    const participants = room.currentParticipants;

    const usernames = {};
    const users = await User.find(
      { _id: { $in: participants } },
      { _id: 1, username: 1 }
    ).exec();

    users.forEach((user) => {
      const { _id, username } = user;
      usernames[_id.valueOf()] = username;
    });

    socket.emit("participants-list", { usernames, roomName });
  });

  socket.on("fetch-my-meets", async ({ userId }) => {
    const meets = await Rooms.find(
      { host: userId },
      {
        _id: 1,
        roomName: 1,
        meetType: 1,
        meetDate: 1,
        meetTime: 1,
        createdAt: 1,
      }
    ).exec();
    await socket.emit("meets-fetched", { myMeets: meets });
  });

  socket.on("delete-meet", async ({ roomId }) => {
    try {
      await Rooms.deleteOne({ _id: roomId });
      socket.emit("room-deleted", { roomId });
      socket.broadcast.emit("room-deleted", { roomId });
    } catch (error) {
      console.error("Error deleting meet:", error);
      socket.emit("error", { message: "Error deleting meet" });
    }
  });

  socket.on(
    "update-meet-details",
    async ({ roomId, roomName, newMeetDate, newMeetTime }) => {
      try {
        await Rooms.updateOne(
          { _id: roomId },
          {
            $set: {
              roomName: roomName,
              meetDate: newMeetDate,
              meetTime: newMeetTime,
            },
          }
        );
        socket.emit("meet-details-updated", { roomId });
        socket.broadcast.emit("meet-details-updated", { roomId });
      } catch (error) {
        console.error("Error updating meet details:", error);
        socket.emit("error", { message: "Error updating meet details" });
      }
    }
  );

  socket.on("user-left-room", async ({ userId, roomId }) => {
    await Rooms.updateOne(
      { _id: roomId },
      { $pull: { currentParticipants: userId } }
    );
    await socket.leave(roomId);
  });

  socket.on("user-disconnected", async ({ userId, roomId }) => {
    console.log(`user: ${userId} left room ${roomId}`);
  });

  socket.on("new-chat", async ({ msg, roomId }) => {
    await socket.broadcast.emit("new-chat-arrived", { msg, room: roomId });
    console.log("recieved");
  });
};

export default roomHandler;
