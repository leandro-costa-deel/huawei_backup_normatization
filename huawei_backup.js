const fs = require("fs");

const inputFile = process.argv[2];
const outputFile = inputFile + ".out";

if(!fs.existsSync(`./${inputFile}`)){
    console.log("## FILE NOT FOUND:", inputFile);
    process.exit(-1);
}
const backup = fs.readFileSync(`./${inputFile}`).toString().split("\n");

console.log("## BACKUP:", inputFile, backup.length);

let lineProfileMapping = {};
let output = [];

backup.forEach( line => {
    if(line.indexOf("---- More")!==-1){
        line = line.replace("---- More ( Press 'Q' to break ) ----[37D                                     [37D", "");
    }

    if(line.indexOf("ont-lineprofile gpon profile-id")!==-1){
        const gponProfileId = line.split("profile-id")[1].trim().split(" ")[0]
        const gponProfileName = line.split("profile-name")[1].trim().split(" ")[0].replace(/"/g,'');
        lineProfileMapping[gponProfileId] = gponProfileName;
        line = line.replace(`ont-lineprofile gpon profile-id ${gponProfileId}`, "ont-lineprofile gpon ");
    }

    if(line.indexOf("ont-lineprofile-id")!== -1) {
        const gponProfileId = line.split("ont-lineprofile-id")[1].trim().split(" ")[0];
        const gponProfileName = lineProfileMapping[gponProfileId];
        if(!gponProfileName) {
            console.log("## NO PROFILE NAME FOR ID:", gponProfileId, line);
            process.exit(-1);
        }
        line = line.replace(`ont-lineprofile-id ${gponProfileId}`, `ont-lineprofile-name ${gponProfileName}`)
    }

    output.push(line);
})

fs.writeFileSync(outputFile, output.join("\n"));
console.log("## OUTPUT:", outputFile, output.length);
console.log("## DONE");