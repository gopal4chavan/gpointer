'use strict';

const Room = require('../models/rooms'); // Import the Room model

/**
 * Create a new room
 * @param {String} name - The name of the room
 * @returns {Promise} - Promise representing the created room
 */
const createRoom = async (name) => {
    const room = new Room({ name });
    return await room.save();
};

/**
 * Get all rooms
 * @returns {Promise} - Promise representing the list of rooms
 */
const getAllRooms = async () => {
    return await Room.find();
};

/**
 * Get a room by ID
 * @param {String} roomId - The ID of the room to retrieve
 * @returns {Promise} - Promise representing the room object
 */
const getRoomById = async (roomId) => {
    return await Room.findById(roomId);
};

/**
 * Update a room
 * @param {String} roomId - The ID of the room to update
 * @param {Object} updateData - The data to update
 * @returns {Promise} - Promise representing the updated room
 */
const updateRoom = async (roomId, updateData) => {
    return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
};

/**
 * Delete a room
 * @param {String} roomId - The ID of the room to delete
 * @returns {Promise} - Promise representing the deletion result
 */
const deleteRoom = async (roomId) => {
    return await Room.findByIdAndDelete(roomId);
};

/**
 * Add a participant to a room
 * @param {String} roomId - The ID of the room
 * @param {String} participant - The participant to add
 * @returns {Promise} - Promise representing the updated room
 */
const addParticipant = async (roomId, participant) => {
    return await Room.findByIdAndUpdate(
        roomId,
        { $addToSet: { participants: participant } }, // Add participant only if not already in the array
        { new: true }
    );
};

/**
 * Remove a participant from a room
 * @param {String} roomId - The ID of the room
 * @param {String} participant - The participant to remove
 * @returns {Promise} - Promise representing the updated room
 */
const removeParticipant = async (roomId, participant) => {
    return await Room.findByIdAndUpdate(
        roomId,
        { $pull: { participants: participant } }, // Remove participant from the array
        { new: true }
    );
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    addParticipant,
    removeParticipant,
};
