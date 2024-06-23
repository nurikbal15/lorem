// peliharaan.controller.js

const { validationResult } = require('express-validator');
const { get, getById, create, updateById, patchById, deleteById, findByNameAndUserId } = require('../models/peliharaan.model');
const { uploadImage, deleteImage } = require('../utils/uploadImage'); // Import fungsi uploadImage dan deleteImage
const { calculateAge } = require('../utils/dateHelper'); // Import dateHelper

// Controller function to get all peliharaan for a specific user
const getAllPeliharaan = async (req, res) => {
  const { userId } = req.query; // Ambil userId dari query parameter

  try {
    let peliharaan;
    if (userId) {
      peliharaan = await get(userId); // Memanggil fungsi get dengan userId sebagai parameter
    } else {
      peliharaan = await get(); // Memanggil fungsi get tanpa parameter untuk mengambil semua peliharaan
    }

    // Menghitung umur untuk setiap peliharaan
    peliharaan = peliharaan.map(p => ({
      ...p,
      umur: calculateAge(p.tanggalLahir) // Menggunakan fungsi calculateAge untuk menghitung umur
    }));

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
    // Menghitung umur berdasarkan tanggal lahir
    peliharaan.umur = calculateAge(peliharaan.tanggalLahir);
    res.json(peliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to create a new peliharaan
const createPeliharaan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { file } = req; // Assume file is sent through form-data with the field 'file'
  const userId = req.user.userUID; // Assume user ID is stored in req.user.userUID

  const { nama, tanggalLahir } = req.body;

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
    // Menghitung umur berdasarkan tanggal lahir
    createdPeliharaan.umur = calculateAge(createdPeliharaan.tanggalLahir);
    res.status(201).json(createdPeliharaan);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update a peliharaan by ID
const updatePeliharaanById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { peliharaanId } = req.params;
  const { nama, jenisKelamin, jenisPeliharaan, ras, fotoPeliharaan, tanggalLahir } = req.body;
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
      jenisKelamin,
      jenisPeliharaan,
      ras,
      fotoPeliharaan: fotoPeliharaanURL,
      tanggalLahir, // Menggunakan tanggalLahir yang diterima dari request
      userId: userId,
    });

    // Menghitung umur berdasarkan tanggal lahir
    updatedPeliharaan.umur = calculateAge(updatedPeliharaan.tanggalLahir);

    res.json(updatedPeliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to patch a peliharaan by ID
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
    
    // Menghitung umur berdasarkan tanggal lahir
    updatedPeliharaan.umur = calculateAge(updatedPeliharaan.tanggalLahir);

    res.json(updatedPeliharaan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a peliharaan by ID
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
