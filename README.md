# Yuna Unpack

#### An asset extractor for Epic Seven.

## Installation
**[Download](https://github.com/Asgarrrr/Yuna-Unpack/archive/master.zip)** the latest version of Yuna Unpack.

##### Utilisation

1. First, you need to install Epic Seven on an emulator, which must allow you to access the file and transfer it to your computer. For the example, I would use Nox player.

2. Open Nox, install Epic Seven, then launch the resource installation, and a file manager.

3. Switch to root mode in the settings.

4. Once the resource installation is done, go to `~/sdcard/com.stove.epic7.google/files/` and copy the `data.pack` file to `~/mnt/shared/Other/`.

5. Go to the Nox document sharing folder on your computer, and place the data.pack in the Yuna Unpack folder.

6. Now you just have to execute the command `node yuna.js`.

*All assets will be added to an `Output` folder, sorted by category. In the `Logs` folder will be generated at each runtime (if new items are detected in the data.pack) a file listing the different new items found.*

## How it works
The data.pack file contains the assets used in the game, such as images, animations, music, etc... It is initially encrypted with an XOR key of 129 byte long. This key will be applied to approximately 1073741824 byte of the data.pack.

The program will then search for all occurrences of file signatures in order to extract them.

Both files and databases have a layer of encryption that I have not yet managed to.