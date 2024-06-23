const prisma = require("../configs/prismaClient");

// Function to retrieve all peliharaan from the database, optionally filtered by userId
const get = async (userId) => {
  try {
    if (userId) {
      return await prisma.peliharaan.findMany({
        where: {
          userId,
        },
      });
    } else {
      return await prisma.peliharaan.findMany();
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to retrieve a specific peliharaan by ID from the database
const getById = async (peliharaanId) => {
  try {
    return await prisma.peliharaan.findUnique({
      where: {
        peliharaanId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to create a new peliharaan in the database
const create = async (peliharaan) => {
  try {
    return await prisma.peliharaan.create({
      data: peliharaan,
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to update an existing peliharaan by ID in the database
// Function to update an existing peliharaan by ID in the database
const updateById = async (peliharaanId, peliharaan) => {
  try {
    return await prisma.peliharaan.update({
      where: {
        peliharaanId,
      },
      data: peliharaan,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchById = async (peliharaanId, peliharaan) => {
  try {
    return await prisma.peliharaan.update({
      where: {
        peliharaanId,
      },
      data: peliharaan,
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to delete a peliharaan by ID from the database
const deleteById = async (peliharaanId) => {
  try {
    await prisma.peliharaan.delete({
      where: {
        peliharaanId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to find a peliharaan by name and user ID
const findByNameAndUserId = async (name, userId) => {
  try {
    return await prisma.peliharaan.findFirst({
      where: {
        nama: name,
        userId: userId
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  get,
  getById,
  create,
  updateById,
  patchById,
  deleteById,
  findByNameAndUserId
};
