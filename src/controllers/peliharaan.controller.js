const { validationResult } = require('express-validator');
const { get, getById, create, updateById, patchById, deleteById, findByNameAndUserId } = require('../models/peliharaan.model');
const { uploadImage, deleteImage } = require('../utils/uploadImage'); // Import fungsi uploadImage dan deleteImage

// Controller function to get all peliharaan
const getAllPeliharaan = async (req, res) => {
  try {
    const peliharaan = await get();
    res.json(peliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to get a peliharaan by ID
const getPeliharaanById = async (req, res) => {
  const { peliharaanId } = req.params;
  try {
    const peliharaan = await getById(parseInt(peliharaanId));
    if (!peliharaan) {
      return res.status(404).json({ error: 'Peliharaan not found' });
    }
    res.json(peliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to create a new peliharaan
const createPeliharaan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { file } = req; // Assume file is sent through form-data with the field 'file'
  const userId = req.user.userUID; // Assume user ID is stored in req.user.userUID

  const { nama } = req.body;

  try {
    // Check if the pet name already exists for the user
    const existingPeliharaan = await findByNameAndUserId(nama, userId);
    if (existingPeliharaan) {
      return res.status(400).json({ error: 'Peliharaan dengan nama yang sama sudah ada' });
    }

    let fotoPeliharaanUrl = '';
    if (file) {
      // Upload image only if file is provided
      fotoPeliharaanUrl = await uploadImage(file);
    }

    const peliharaanData = {
      ...req.body,
      fotoPeliharaan: fotoPeliharaanUrl,
      userId: userId,
    };

    const createdPeliharaan = await create(peliharaanData);
    res.status(201).json(createdPeliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to update a peliharaan by ID
const updatePeliharaanById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { peliharaanId } = req.params;
  const { nama, umur, jenisKelamin, jenisPeliharaan, ras, fotoPeliharaan  } = req.body;
  const file = req.file; // Assume file is sent through form-data with the field 'file'
  const userId = req.user.userUID;

  try {
    const existingPeliharaan = await getById(parseInt(peliharaanId));
    if (!existingPeliharaan) {
      return res.status(404).json({ error: 'Peliharaan not found' });
    }

    // Check if the pet name already exists for the user, excluding the current peliharaan
    if (nama !== existingPeliharaan.nama) {
      const duplicatePeliharaan = await findByNameAndUserId(nama, userId);
      if (duplicatePeliharaan) {
        return res.status(400).json({ error: 'Peliharaan dengan nama yang sama sudah ada' });
      }
    }

    let fotoPeliharaanURL = existingPeliharaan.fotoPeliharaan;
    if (file) {
      // Upload new image and delete the old one
      const newImageURL = await uploadImage(file);
      await deleteImage(fotoPeliharaanURL);
      fotoPeliharaanURL = newImageURL;
    }

    const updatedPeliharaan = await updateById(parseInt(peliharaanId), {
      nama,
      umur,
      jenisKelamin,
      jenisPeliharaan,
      ras,
      fotoPeliharaan: fotoPeliharaanURL,
      userId: userId,
    });

    res.json(updatedPeliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const patchPeliharaanById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { peliharaanId } = req.params;
  const peliharaanData = {
    ...req.body,
    userId: req.user.userUID, // Assume user ID is stored in req.user.userUID
  };

  try {
    const updatedPeliharaan = await patchById(parseInt(peliharaanId), peliharaanData);
    if (!updatedPeliharaan) {
      return res.status(404).json({ error: 'Peliharaan not found' });
    }
    res.json(updatedPeliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to delete a peliharaan by ID
const deletePeliharaanById = async (req, res) => {
  const { peliharaanId } = req.params;
  try {
    const existingPeliharaan = await getById(parseInt(peliharaanId));
    if (!existingPeliharaan) {
      return res.status(404).json({ error: 'Peliharaan not found' });
    }

    await deleteImage(existingPeliharaan.fotoPeliharaan);
    await deleteById(parseInt(peliharaanId));

    res.status(204).send(); // No content in response
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllPeliharaan,
  getPeliharaanById,
  createPeliharaan,
  updatePeliharaanById,
  patchPeliharaanById,
  deletePeliharaanById,
};
