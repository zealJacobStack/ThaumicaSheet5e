const addParentThaum = (msg, paramsThaum) => {
    var indexP = paramsThaum[1]; // Extract the index
    var nameP = paramsThaum[2]; // The remaining part is the name
    var baseUrl = paramsThaum[3];
    indexP = formatStringThaum(indexP);

    var repeatingBase = "repeating_aspect_" + indexP;
    //Name Input
    var aspectNameAttrP = repeatingBase + "_aspect_name";
    //Backround Image
    var backgroundP = repeatingBase + "_aspect_image_background";
    var backgroundUrl = baseUrl + indexP + "Color.png";
    //Aspect Symbol
    var aspectSymbol = repeatingBase + "_aspect_image";
    var symbolUrl = baseUrl + indexP + ".png";


    var characterP = findObjs({ type: 'character', name: nameP })[0];
    var pName = createObj("attribute", {
        name: aspectNameAttrP,
        current: indexP, // Set a default value for the spell name
        max: 0,
        characterid: characterP.id
    });
    if (pName) {
        var backImg = createObj("attribute", {
            name: backgroundP,
            current: backgroundUrl, // Set a default value for the spell name
            max: 0,
            characterid: characterP.id
        });

        var symbol = createObj("attribute", {
            name: aspectSymbol,
            current: symbolUrl, // Set a default value for the spell name
            max: 0,
            characterid: characterP.id
        });

    }

};

const deleteAspectThaum = (msg, paramsThaum) => {
    var sure = paramsThaum[1];

    // Only proceed if 'sure' is 'yes'
    if (sure === "Yes") {
        var rowID = paramsThaum[2];
        var characterD = findObjs({ type: 'character', name: paramsThaum[3] })[0];

        // Ensure the character exists
        if (characterD) {
            deleteRepeatingSectionRowThaum(rowID, characterD.id);
        } else {
            sendChat(msg.who, "Character not found: " + paramsThaum[3]);
        }
    }
};

const apiMapThaum = {
    "!addParent ": addParentThaum,
    "!deleteAspect ": deleteAspectThaum
};

on("chat:message", function (msg) {
    if (msg.type == "api") {
        var paramsThaum = msg.content.split("|");
        var apiCall = paramsThaum[0];
        if (apiMapThaum[apiCall]) {
            apiMapThaum[apiCall](msg, paramsThaum);
        } else {
            console.log("No Thaum specific logic found for api: " + apiCall);
        }
    }
});

function formatStringThaum(inputString) {
    return inputString
        .trim() // Remove leading and trailing whitespace
        .replace(/ /g, "_") // Replace all spaces with underscores
        .split("_") // Split the string into an array of words based on underscores
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter, lowercase the rest
        })
        .join("_"); // Join the array back into a string with underscores
}
function deleteRepeatingSectionRowThaum(rowid, characterid) {
    const regex = new RegExp(`^repeating_.*?_${rowid}_.*?$`);
    const attrsInRow = filterObjs(function (obj) {
        if (obj.get('type') !== 'attribute' || obj.get('characterid') !== characterid) return false;
        return regex.test(obj.get('name'));
    });
    _.each(attrsInRow, function (attribute) {
        attribute.remove();
    });
}