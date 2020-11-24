
// ██████ Integrations █████████████████████████████████████████████████████████ */

// —— File system
const fs        = require("fs-extra");
// —— Terminal string styling done right
const chalk     = require("chalk");
// —— Beautiful color gradients in terminal output
const gradients = require("gradient-string");

// ██████ dapta.ack decryption key █████████████████████████████████████████████

const master = Buffer.from([
    0x21, 0x0c, 0xed, 0x10, 0xd8, 0x81, 0xd7, 0xa3, 0xfa, 0x9b, 0xc9, 0x7a,
    0xd3, 0xae, 0xeb, 0x6d, 0x98, 0x89, 0x31, 0x34, 0x2d, 0x39, 0x1e, 0x1f,
    0xe1, 0xc4, 0x7c, 0xdd, 0x2d, 0xef, 0x26, 0x37, 0x7a, 0xfa, 0xbf, 0xd2,
    0xd9, 0x60, 0x79, 0xf1, 0xca, 0x99, 0xd0, 0x32, 0xf7, 0xd8, 0x4d, 0x4e,
    0xf6, 0xce, 0x45, 0xda, 0x0c, 0x67, 0x99, 0x09, 0xe6, 0x89, 0x75, 0x69,
    0x5f, 0xd9, 0x12, 0xa2, 0x3e, 0x77, 0x74, 0x3c, 0xf5, 0xbe, 0x2e, 0x57,
    0x64, 0x05, 0x1a, 0x71, 0x96, 0x62, 0x23, 0x25, 0x80, 0x63, 0xfc, 0xe7,
    0xc6, 0xd4, 0xe7, 0xca, 0x76, 0x7d, 0x70, 0x3c, 0xcb, 0xe2, 0x31, 0xc5,
    0xed, 0x03, 0x8d, 0xcc, 0xad, 0x1a, 0x75, 0x53, 0x4a, 0x61, 0x27, 0xb8,
    0x30, 0xca, 0xeb, 0x73, 0xb4, 0xc6, 0xd6, 0xdb, 0xda, 0x00, 0x88, 0xe2,
    0x11, 0x21, 0xef, 0xd5, 0xf3, 0x8a, 0x02, 0x1f, 0x06
]);

// ██████ Files signatures ██████████████████████████████████████████████████████

const png = [
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    Buffer.from([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82])
];

const jpg = [
    Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]),
    Buffer.from([0xff, 0xd9])
];

// —————— Header ———————————————————————————————————————————————————————————————

// —— Cleaning the console 💨
Stylconsole.clear();

// —— Just an ascii header because I like it.
console.log(
    chalk.bold(
        gradients("#8EA6DB", "#7354F6")([
            "   ____     _       ____                ",
            "  / __/__  (_)___  / __/__ _  _____ ___ ",
            " / _// _ \\/ / __/ _\\ \\/ -_) |/ / -_) _ \\",
            "/___/ .__/_/\\__/ /___/\\__/|___/\\__/_//_/",
            "   /_/           › Assets extractor",
            "\n"
        ].join("\n"))
    )
    + "————— Importing and decrypting data.pack ...\n\n"
    + chalk.italic.grey( "—— This action may take some time and depends on the performance of your computer.\n" )
);

// —————————————————————————————————————————————————————————————————————————————

let start;

const timerStart = () => start = +new Date(),
      timerEnd   = () => +new Date() - start;

timerStart();

// —— Importing the "data.pack" file
fs.readFile("./data.pack", async (err, dataPack) => {

    if (err) {
        err.code === "ENOENT"
            ? console.error(chalk.red("✗ ——— No 'data.pack' file found."))
            : console.error(chalk.red(`✗ ——— ${err}`));
        process.exit(1);
    } else
        console.log(chalk.green(`\n✓ ——— Data.pack imported ( ${chalk.italic(timerEnd())}ms ) \n`));

    let KeyIndex = 0;

    /* —— Performs the XOR (exclusive OR) operation on each pair
          of bits. a XOR b gives 1 if a and b are different. */

    for (let i = 0; i < dataPack.length; i++) {

        dataPack[i] = dataPack[i] ^ master[KeyIndex]

        KeyIndex === master.length -1
            ? KeyIndex = 0
            : KeyIndex++;

    }

    /* —— dataPack.slice(0, 5) : <Buffer 50 4c 50 63 4b 01 26 00 00 00>
        = "PLPcK" */

    if (dataPack.slice(0, 6).equals(
        Buffer.from([80, 76, 80, 99, 75, 1])
    )) {
        console.log(chalk.green(`✓ ——— Decryption seems to be correct ( ${chalk.italic(timerEnd())}ms ) \n`));
    } else {
        console.log(
            chalk.red([
                "✗ ——— Decryption doesn't seem correct",
                "If you haven't made any changes to",
                "the code, it would appear that the",
                "decryption key is no longer valid.",
                "Please open a new issue to warn me:"
            ].join("\n      "))
        );
        process.exit(1);
    }

    // —— Generate a file with the decrypted data.pack if requested

    if (process.argv.includes("-e"))
        fs.outputFile("extract", dataPack)
            .then(console.log("extracted file"))
            .catch(err => { throw new Error(err); });

    let accumulator = [];

    function cleanPath(path, fileFormat) {

        if (path.includes(fileFormat[1])) {

            path = path
                .slice(path.lastIndexOf(fileFormat[1]) + 27, path.length)
                .toString()
                .split("/");

            while(path[0].length < 2 || undefined)
                path.shift();

            if (path[0].length > 15 && !accumulator.includes(path[0]))
                path[0] = accumulator.find((element) => path[0].includes(element));

            if (!accumulator.includes(path[0]) )
                accumulator.push(path[0]);

        } else {

            path = path
                .slice(path.lastIndexOf(0x00), path.length)
                .toString()
                .split("/");

            path[0] = path[0].replace(/[^a-z0-9.\/_]/g, "");

            if (path[0].length < 2)
                path.shift();

            if (!accumulator.includes(path[0]))
                path[0] = accumulator.find((element) => path[0].includes(element)) || path[0]

        }

        if(path.length === 1)
            path.unshift("output");

        return path.join("/");

    }


    async function read(fileFormat) {

        let i     = 0,
            total = 0,
            news  = [];

        timerStart();

        while ( (i = dataPack.indexOf(fileFormat[0], i + 1)) !== -1 ) {

            const fileName = cleanPath(dataPack.slice( i - 180, i ), fileFormat),
                  content = dataPack.slice( i, dataPack.indexOf(fileFormat[1], i + 1) );

            total++;;

            try {

                if (!await fs.pathExists(`Output/${fileName}`)) {
                    fs.outputFileSync(
                        `Output/${fileName}`, (content, err) => {
                        if (err) console.log(err);
                    });

                    news.push(fileName);

                }

            } catch (err) {
                console.error(err);
            }

        }

        console.log(chalk.green(
            `\n✓ ———  ${total} files found, ${
                news.length
                    ? `including ${news.length} new ones`
                    : "but no new data"
            } ( ${chalk.italic(timerEnd())}ms )\n`
        ));

        if (news.length) {

            const now       = new Date();
                  dateLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
                  str       = dateLocal.toISOString().slice(0, 19).replace(/-/g, "-").replace("T", "_");

            fs.outputFileSync(`Logs/${str}.log`, JSON.stringify(news, null, 2));

        }
    }

    console.log(`——— Extraction of PNG files`);
    await read(png)
    console.log(`——— Extraction of JPG files`);
    await read(jpg)

})
