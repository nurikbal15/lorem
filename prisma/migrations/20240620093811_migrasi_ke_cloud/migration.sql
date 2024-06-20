-- CreateTable
CREATE TABLE `JadwalMakan` (
    `jadwalId` INTEGER NOT NULL AUTO_INCREMENT,
    `tahap` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `jenisMakanan` VARCHAR(191) NOT NULL,
    `peliharaanId` INTEGER NOT NULL,

    PRIMARY KEY (`jadwalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalVitamin` (
    `jadwalId` INTEGER NOT NULL AUTO_INCREMENT,
    `jenisVitamin` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `peliharaanId` INTEGER NOT NULL,

    PRIMARY KEY (`jadwalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalAktifitas` (
    `jadwalId` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwalAktifitas` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `peliharaanId` INTEGER NOT NULL,

    PRIMARY KEY (`jadwalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalTemu` (
    `jadwalId` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwalTemu` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `peliharaanId` INTEGER NOT NULL,

    PRIMARY KEY (`jadwalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peliharaan` (
    `peliharaanId` INTEGER NOT NULL AUTO_INCREMENT,
    `jenisPeliharaan` ENUM('KUCING', 'ANJING') NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `ras` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `jenisKelamin` ENUM('JANTAN', 'BETINA') NOT NULL,
    `fotoPeliharaan` VARCHAR(800) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`peliharaanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userUID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JadwalMakan` ADD CONSTRAINT `JadwalMakan_peliharaanId_fkey` FOREIGN KEY (`peliharaanId`) REFERENCES `Peliharaan`(`peliharaanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalVitamin` ADD CONSTRAINT `JadwalVitamin_peliharaanId_fkey` FOREIGN KEY (`peliharaanId`) REFERENCES `Peliharaan`(`peliharaanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalAktifitas` ADD CONSTRAINT `JadwalAktifitas_peliharaanId_fkey` FOREIGN KEY (`peliharaanId`) REFERENCES `Peliharaan`(`peliharaanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalTemu` ADD CONSTRAINT `JadwalTemu_peliharaanId_fkey` FOREIGN KEY (`peliharaanId`) REFERENCES `Peliharaan`(`peliharaanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peliharaan` ADD CONSTRAINT `Peliharaan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userUID`) ON DELETE RESTRICT ON UPDATE CASCADE;
