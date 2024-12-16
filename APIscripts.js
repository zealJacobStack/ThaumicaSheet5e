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
    //costInput
    var costInput = repeatingBase + "_aspect_remaining";


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
        var defaultVal = 0;

        makeAspectAttr(costInput, defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_aspect_pb", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_aspect_exp", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_cost_reduction", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_skill_mod", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_attk_mod", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_save_mod", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_damage_mod", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_basic_expend", defaultVal, characterP.id);

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

const expendAttributeThaum = (msg, paramsThaum) => {
    //var toExpendArray = paramsThaum[1].split(",");
    //var aspectNameArray = paramsThaum[2].split(",");
    //var discountArray = paramsThaum[3].split(",");
    var toExpend = paramsThaum[1];
    var aspectName = paramsThaum[2];
    var discount = paramsThaum[3];
    var rollName = paramsThaum[4]
    var charName = paramsThaum[5];
    var character = getThaumChar(charName);
    var repeatingBase = "repeating_aspect_" + aspectName;
    var aspectPbId = repeatingBase + "_aspect_remaining";
    //if (toExpendArray.length === aspectNameArray.length && aspectNameArray.length === discountArray.length) {

    //}
    var cost = getCostThaum(toExpend, discount);
    var aspectU = findObjs({
        name: aspectPbId,
        _type: "attribute",
        _characterid: character.id
    })[0];
    var currentU = aspectU.get("current");
    if (currentU >= cost) {
        aspectU.set("current", currentU - cost);
        var expIndex = repeatingBase + "_aspect_exp";
        var expAttr = findObjs({
            name: expIndex,
            _type: "attribute",
            _characterid: character.id
        })[0];
        expAttr.set("current", expAttr.get("current") + toExpend);
        aspectBasicAttackRoll(charName, character.id, aspectName, rollName);
    } else {
        sendChat(msg.who, "Not enough " + aspectName + ". Cost: " + cost + ", and Reserves: " + currentU);
    }

}

const apiMapThaum = {
    "!addParent ": addParentThaum,
    "!deleteAspect ": deleteAspectThaum,
    "!expendAttribute ": expendAttributeThaum
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

function getCostThaum(toExpend, discount) {
    return Math.ceil(toExpend / 2) > toExpend - discount ? Math.ceil(toExpend / 2) : toExpend - discount;
}
function getThaumChar(charName) {
    var characterP = findObjs({ type: 'character', name: charName })[0];
    if (characterP) {
        return characterP;
    } else {
        console.log("Character not found: " + charName);
    }
}
function makeAspectAttr(index, value, id) {
    createObj("attribute", {
        name: index,
        current: value, // Set a default value for the spell name
        max: "",
        characterid: id
    });
}
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
function deleteRepeatingSectionRowThaum(rowid, characterid, aspect) {
    const regex = new RegExp(`^repeating_.*?_${rowid}_.*?$`);
    const attrsInRow = filterObjs(function (obj) {
        if (obj.get('type') !== 'attribute' || obj.get('characterid') !== characterid) return false;
        return regex.test(obj.get('name'));
    });
    _.each(attrsInRow, function (attribute) {
        attribute.remove();
    });
}
function getAttributeThaum(charId, attr) {
    return findObjs({ name: attr, _type: "attribute", _characterid: charId })[0];
}
function addToInlineRoll(inlineRoll, addition, tag) {

}
async function aspectSkillCheck(characterName, charId, aspect, rollName) {
    var base = "repeating_aspect_" + aspect;
    let aspectGlobal = "[[" + findObjs({ name: `${base}_skill_mod`, _type: "attribute", _characterid: charId })[0].get("current") + "]]";

    var template = `@{${characterName}|wtype}&{template:simple} {{rname=${rollName} (Skill)}} {{rnamec=${rollName} (Skill)}} {{mod=@{${characterName}|${base}_aspect_pb}}} {{r1=[[@{${characterName}|d20}+@{${characterName}|${base}_aspect_pb}@{${characterName}|pbd_safe}]]}} @{${characterName}|rtype}+@{${characterName}|${base}_aspect_pb}@{${characterName}|pbd_safe}]]}} {{global=@{${characterName}|global_skill_mod}${aspectGlobal} }} @{${characterName}|charname_output}`;
    sendChat(`character|${charId}`, template);
}
async function aspectBasicAttackRoll(characterName, charId, aspect, rollName) {
    var base = "repeating_aspect_" + aspect;
    //let aspectGlobal = "[[" + findObjs({ name: `${base}_attk_mod`, _type: "attribute", _characterid: charId })[0].get("current") + "]]";
    //let global = findObjs({ name: 'global_attack_mod', _type: "attribute", _characterid: charId })[0].get("current");

    let expression = await makeExpressionThaum(characterName, ['global_attack_mod', `${base}_attk_mod`]);

    var template = `@{${characterName}|wtype}&{template:atk} {{mod=@{${characterName}|${base}_aspect_pb}}} {{rname=[${rollName} (Attack Roll)]}} {{rnamec=[${rollName} (Attack Roll)]}} {{r1=[[@{${characterName}|d20}cs>20 + @{${characterName}|${base}_aspect_pb}[ASPECT PROF]]]}} @{${characterName}|rtype}cs>20 + @{${characterName}|${base}_aspect_pb}[ASPECT PROF]]]}} {{range=}} {{desc=}} {{spelllevel=}} {{innate=}} {{globalattack=[[${expression}]]}} ammo= @{${characterName}|charname_output}`
    sendChat(`character|${charId}`, template);
}
function aspectDescriptionRoll(characterName, charId, aspect) {

}
function aspectDamageRoll(characterName, charId, aspect) {

}

async function getRollThaum(roll) {
    let rollOnce = await new Promise((resolve, reject) => {
        sendChat("", "/r 0" + roll, function (ops) {
            resolve(ops[0]);
        });
    });
    return rollOnce.inlinerolls;
}

function getRollResult(roll) {
    let results = (roll.length > 0) ? roll.results.total : "";
    return results;
}
function getRollExpression(roll) {
    let expression = (roll.length > 0) ? roll.expression : "";
    return expression;
}

function makeRollInThaum(charName, attr) {
    return `@{${charName}|${attr}}`;
}
async function getExpression(charName, attr) {
    let rollIn = makeRollInThaum(charName, attr);
    let rollOut = await getRollThaum(rollIn);
    return getRollExpression(rollOut);

}
async function makeExpressionThaum(charName, rollList) {
    let expression = await getExpression(charName, rollList[0]);
    for (let i = 1; i < rollList.length; i++) {
        let nextExpression = await getExpression(charName, rollList[i]);
        expression = (!!nextExpression) ? expression + " + " + nextExpression : expression;
    }
    return expression;
}