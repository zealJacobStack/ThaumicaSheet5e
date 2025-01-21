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
        makeAspectAttr(repeatingBase + "_mastery", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_mastery0", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_mastery1", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_mastery2", defaultVal, characterP.id);
        makeAspectAttr(repeatingBase + "_spelloutput", "ATTACK", characterP.id);

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
    try {
        //var toExpendArray = paramsThaum[1].split(",");
        //var aspectNameArray = paramsThaum[2].split(",");
        //var discountArray = paramsThaum[3].split(",");
        var toExpend = paramsThaum[1];
        var aspectName = paramsThaum[2];
        var discount = paramsThaum[3];
        var rollName = paramsThaum[4];
        var rollType = paramsThaum[5];
        var charName = paramsThaum[6];
        var character = getThaumChar(charName);
        var repeatingBase = "repeating_aspect_" + aspectName;
        var aspectPbId = repeatingBase + "_aspect_remaining";
        //if (toExpendArray.length === aspectNameArray.length && aspectNameArray.length === discountArray.length) {
        sendChat(`character|${character.id}`,  `toExpend: ${toExpend} %NEWLINE%
                                                aspectName: ${aspectName} %NEWLINE%
                                                discount: ${discount} %NEWLINE%
                                                rollName: ${rollName} %NEWLINE%
                                                rollType: ${rollType} %NEWLINE%
                                                charName: ${charName} %NEWLINE%
                                                `);
        //}
        /*
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
            */
    } catch (error) {
        thaumError(error, "ExpendAttr: " + msg.content);
    }


}
const unExpendAttributeThaum = (msg, paramsThaum) => {
    try {
        var toUnExpend = paramsThaum[1];
        var aspectName = paramsThaum[2];
        var discount = paramsThaum[3];
        var rollType = paramsThaum[4];
        var charName = paramsThaum[5];
        var character = getThaumChar(charName);

        sendChat(`character|${character.id}`,  `toUnExpend: ${toUnExpend} %NEWLINE%
            aspectName: ${aspectName} %NEWLINE%
            discount: ${discount} %NEWLINE%
            rollType: ${rollType} %NEWLINE%
            charName: ${charName} %NEWLINE%
            `);
    } catch (error) {
        thaumError(error, "UnExpendAttribute");
    }

}
const aspectspellThaum = (msg, paramsThaum) => {
    var innate = paramsThaum[1];
    var spellritual = paramsThaum[2];
    var spellconcentration = paramsThaum[3];
    var spellattackid = paramsThaum[4];
    var spelloutput = paramsThaum[5];
    var spellcomp = paramsThaum[6];
    var spellname = paramsThaum[7];
    var arcaneformula = paramsThaum[8];
    var spellcastingtime = paramsThaum[9];
    var spellrange = paramsThaum[10];
    var spelltarget = paramsThaum[11];
    var spellduration = paramsThaum[12];
    var spell_ability = paramsThaum[13];
    var spelloutput = paramsThaum[14];
    var spellattack = paramsThaum[15];
    var spelldamage = paramsThaum[16];
    var spelldamagetype = paramsThaum[17];
    var spelldamage2 = paramsThaum[18];
    var spelldamagetype2 = paramsThaum[19];
    var spellhealing = paramsThaum[20];
    var spelldmgmod = paramsThaum[21];
    var spellsave = paramsThaum[22];
    var spellsavesuccess = paramsThaum[23];
    var includedesc = paramsThaum[24];
    var spelldescription = paramsThaum[25];
    var charname = paramsThaum[26];
    var character = getThaumChar(charname);

    sendChat(`character|${character.id}`, `
        innate = ${innate} %NEWLINE%
        spellritual = ${spellritual} %NEWLINE%
        spellconcentration = ${spellconcentration} %NEWLINE%
        spellattackid = ${spellattackid} %NEWLINE%
        spelloutput = ${spelloutput} %NEWLINE%
        spellcomp = ${spellcomp} %NEWLINE%
        spellname = ${spellname} %NEWLINE%
        arcaneformula = ${arcaneformula} %NEWLINE%
        spellcastingtime = ${spellcastingtime} %NEWLINE%
        spellrange = ${spellrange} %NEWLINE%
        spelltarget = ${spelltarget} %NEWLINE%
        spellduration = ${spellduration} %NEWLINE%
        spell_ability = ${spell_ability} %NEWLINE%
        spelloutput = ${spelloutput} %NEWLINE%
        spellattack = ${spellattack} %NEWLINE%
        spelldamage = ${spelldamage} %NEWLINE%
        spelldamagetype = ${spelldamagetype} %NEWLINE%
        spelldamage2 = ${spelldamage2} %NEWLINE%
        spelldamagetype2 = ${spelldamagetype2} %NEWLINE%
        spellhealing = ${spellhealing} %NEWLINE%
        spelldmgmod = ${spelldmgmod} %NEWLINE%
        spellsave = ${spellsave} %NEWLINE%
        spellsavesuccess = ${spellsavesuccess} %NEWLINE%
        includedesc = ${includedesc} %NEWLINE%
        spelldescription = ${spelldescription} %NEWLINE%
                                        ` );
}
const aspectspellcardThaum = (msg, paramsThaum) => {
    var innate = paramsThaum[1];
    var spellritual = paramsThaum[2];
    var spellconcentration = paramsThaum[3];
    var spellattackid = paramsThaum[4];
    var spelloutput = paramsThaum[5];
    var spellcomp = paramsThaum[6];
    var spellname = paramsThaum[7];
    var arcaneformula = paramsThaum[8];
    var spellcastingtime = paramsThaum[9];
    var spellrange = paramsThaum[10];
    var spelltarget = paramsThaum[11];
    var spellduration = paramsThaum[12];
    var spell_ability = paramsThaum[13];
    var spelloutput = paramsThaum[14];
    var spellattack = paramsThaum[15];
    var spelldamage = paramsThaum[16];
    var spelldamagetype = paramsThaum[17];
    var spelldamage2 = paramsThaum[18];
    var spelldamagetype2 = paramsThaum[19];
    var spellhealing = paramsThaum[20];
    var spelldmgmod = paramsThaum[21];
    var spellsave = paramsThaum[22];
    var spellsavesuccess = paramsThaum[23];
    var includedesc = paramsThaum[24];
    var spelldescription = paramsThaum[25];
    var charname = paramsThaum[26];
    var character = getThaumChar(charname);

    sendChat(`character|${character.id}`, `
        innate = ${innate} %NEWLINE%
        spellritual = ${spellritual} %NEWLINE%
        spellconcentration = ${spellconcentration} %NEWLINE%
        spellattackid = ${spellattackid} %NEWLINE%
        spelloutput = ${spelloutput} %NEWLINE%
        spellcomp = ${spellcomp} %NEWLINE%
        spellname = ${spellname} %NEWLINE%
        arcaneformula = ${arcaneformula} %NEWLINE%
        spellcastingtime = ${spellcastingtime} %NEWLINE%
        spellrange = ${spellrange} %NEWLINE%
        spelltarget = ${spelltarget} %NEWLINE%
        spellduration = ${spellduration} %NEWLINE%
        spell_ability = ${spell_ability} %NEWLINE%
        spelloutput = ${spelloutput} %NEWLINE%
        spellattack = ${spellattack} %NEWLINE%
        spelldamage = ${spelldamage} %NEWLINE%
        spelldamagetype = ${spelldamagetype} %NEWLINE%
        spelldamage2 = ${spelldamage2} %NEWLINE%
        spelldamagetype2 = ${spelldamagetype2} %NEWLINE%
        spellhealing = ${spellhealing} %NEWLINE%
        spelldmgmod = ${spelldmgmod} %NEWLINE%
        spellsave = ${spellsave} %NEWLINE%
        spellsavesuccess = ${spellsavesuccess} %NEWLINE%
        includedesc = ${includedesc} %NEWLINE%
        spelldescription = ${spelldescription} %NEWLINE%
                                        ` );
}

const rerolld20 = (msg, paramsThaum) => {
    try {
        var r1 = paramsThaum[1];
        var r2 = paramsThaum[2];
        var mod = paramsThaum[3];
        var globalattack = paramsThaum[4];
        var range = paramsThaum[5];
        var desc = paramsThaum[6];
        var innate = paramsThaum[7];
        var rname = paramsThaum[9];
        var charname = paramsThaum[8];
        var rstart = "cs>";
        var r1start = r1.indexOf(rstart);
        var r2start = r2.indexOf(rstart);
        var gstart = " Rolling ".length;
        var r1end = r1.indexOf("=");
        var r2end = r2.indexOf("=");
        var gend = globalattack.indexOf("=");
        var r1substring = r1.substring(r1start, r1end);
        var r2substring = r2.substring(r2start, r2end);
        var globalattacksubstring = globalattack.substring(gstart, gend);

        var template = `@{${charname}|wtype}&{template:atk} {{mod=${mod}}} {{rname=${rname}}} {{rnamec=${rname}}} {{r1=[[@{${charname}|d20}${r1substring}]]}} @{${charname}|rtype}${r2substring}]]}} {{range=${range}}} {{desc=${desc}}} {{innate=${innate}}} {{globalattack=[[${globalattacksubstring}]]}} ammo= {{charname=${charname}}}`
        sendChat(charname, template);
    } catch (error) {
        thaumError(error, "rerolld20 MSG: " + msg.content);
    }
}
const rerolleffect = (msg, paramsThaum) => {
    try {
        var charname = paramsThaum[1];
        var range = paramsThaum[2];
        var damage = paramsThaum[3];
        var dmg1flag = paramsThaum[4];
        var dmg1 = paramsThaum[5];
        var dmg1type = paramsThaum[6];
        var dmg2flag = paramsThaum[7];
        var dmg2 = paramsThaum[8];
        var dmg2type = paramsThaum[9];
        var spelllevel = paramsThaum[10];
        var innate = paramsThaum[11];
        var globaldamage = paramsThaum[12];
        var globaldamagetype = paramsThaum[13];
        var rname = escapeChars(paramsThaum[14]);
        var character = getThaumChar(charname);

        var dmgstart = " Rolling ".length;
        var dmg1roll = dmg1;
        if (dmg1) {
            var d1end = dmg1.indexOf("=");
            dmg1roll = dmg1.substring(dmgstart, d1end);
        }
        var dmg2roll = dmg2;
        if (dmg2) {
            var d2end = dmg2.indexOf("=");
            dmg2roll = dmg2.substring(dmgstart, d2end);
        }
        var gdroll = globaldamage;
        if (globaldamage) {
            var gend = globaldamage.indexOf("=");
            gdroll = globaldamage.substring(dmgstart, gend);
        }


        var template = `@{${charname}|wtype}&{template:dmg} {{rname=${rname}}} 0 {{range=${range}}} {{damage=${damage}}} {{dmg1flag=${dmg1flag}}} {{dmg1=[[${dmg1roll}]]}} {{dmg1type=${dmg1type} }} {{damage=${damage}}} {{dmg2flag=${dmg2flag}}} {{dmg2=[[${dmg2roll}]]}} {{dmg2type=${dmg2type} }} 0 {{desc=}}  {{spelllevel=${spelllevel}}} {{innate=${innate}}} {{globaldamage=[[${gdroll}]]}} {{globaldamagetype=@{${charname}|global_damage_mod_type}}} ammo=  @{${charname}|charname_output}`

        sendChat(`character|${character.id}`, template);
        
    } catch (error) {
        thaumError(error, "rerolleffect MSG: " + msg.content);
    }
}

const apiMapThaum = {
    "!addParent ": addParentThaum,
    "!deleteAspect ": deleteAspectThaum,
    "!expendAttribute ": expendAttributeThaum,
    "!unExpendAttribute ": unExpendAttributeThaum,
    "!rerolld20 ": rerolld20,
    "!rerolleffect ": rerolleffect,
    "!aspectspell ": aspectspellThaum,
    "!aspectspellcard ": aspectspellcardThaum 
};

on("chat:message", function (msg) {
    if (msg.type == "api") {
        try {
            var paramsThaum = msg.content.split("|");
            var apiCall = paramsThaum[0];
            if (apiMapThaum[apiCall]) {
                apiMapThaum[apiCall](msg, paramsThaum);
            } else {
                console.log("No Thaum specific logic found for api: " + apiCall);
            }
        } catch (error) {
            thaumError(error, "Chat:message MSG: " + msg.content);
        }

    }
});
function thaumError(error, custom) {
    console.log("Error Trying: " + custom);
    console.log(error);
    sendChat("Error Trying: ", custom);
    sendChat("Error", error.message);
}
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
    try {
        var base = "repeating_aspect_" + aspect;
        let aspectGlobal = "[[" + findObjs({ name: `${base}_skill_mod`, _type: "attribute", _characterid: charId })[0].get("current") + "]]";

        var template = `@{${characterName}|wtype}&{template:simple} {{rname=${rollName} (Skill)}} {{rnamec=${rollName} (Skill)}} {{mod=@{${characterName}|${base}_aspect_pb}}} {{r1=[[@{${characterName}|d20}+@{${characterName}|${base}_aspect_pb}@{${characterName}|pbd_safe}]]}} @{${characterName}|rtype}+@{${characterName}|${base}_aspect_pb}@{${characterName}|pbd_safe}]]}} {{global=@{${characterName}|global_skill_mod}${aspectGlobal} }} @{${characterName}|charname_output}`;
        sendChat(`character|${charId}`, template);
    } catch (error) {
        thaumError(error, "AspectSkillCheck");
    }

}
async function aspectBasicAttackRoll(characterName, charId, aspect, rollName) {
    try {
        var base = "repeating_aspect_" + aspect;
        //let aspectGlobal = "[[" + findObjs({ name: `${base}_attk_mod`, _type: "attribute", _characterid: charId })[0].get("current") + "]]";
        //let global = findObjs({ name: 'global_attack_mod', _type: "attribute", _characterid: charId })[0].get("current");

        let expression = await makeExpressionThaum(characterName, ['global_attack_mod', `${base}_attk_mod`]);

        var template = `@{${characterName}|wtype}&{template:atk} {{mod=@{${characterName}|${base}_aspect_pb}}} {{rname=[${rollName} (Attack Roll)]}} {{rnamec=[${rollName} (Attack Roll)]}} {{r1=[[@{${characterName}|d20}cs>20 + @{${characterName}|${base}_aspect_pb}[ASPECT PROF]]]}} @{${characterName}|rtype}cs>20 + @{${characterName}|${base}_aspect_pb}[ASPECT PROF]]]}} {{range=}} {{desc=}} {{innate=}} {{globalattack=[[${expression}]]}} ammo= @{${characterName}|charname_output}`
        sendChat(`character|${charId}`, template);
    } catch (error) {
        thaumError(error, "AspectBasicAttackRoll");
    }

}
function aspectDescriptionRoll(characterName, charId, aspect) {

}
function aspectDamageRoll(characterName, charId, aspect) {

}

async function getRollThaum(roll) {
    try {
        let rollOnce = await new Promise((resolve, reject) => {
            sendChat("", "/r 0" + roll, function (ops) {
                resolve(ops[0]);
            });
        });
        sendChat("Get roll thaum", "/r 0" + roll);
        return rollOnce.inlinerolls;
    } catch (error) {
        thaumError(error, "GetRollThaum");
    }

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

    try {
        let rollIn = makeRollInThaum(charName, attr);
        let rollOut = await getRollThaum(rollIn);
        return getRollExpression(rollOut);
    } catch (error) {
        thaumError(error, "GetExpression");
    }
}
async function makeExpressionThaum(charName, rollList) {
    try {
        let expression = await getExpression(charName, rollList[0]);
        for (let i = 1; i < rollList.length; i++) {
            let nextExpression = await getExpression(charName, rollList[i]);
            expression = (!!nextExpression) ? expression + " + " + nextExpression : expression;
        }
        return expression;
    } catch (error) {
        thaumError(error, "MakeExpressionThaum");
    }
}
function escapeChars(string) {
    var sanitized = string.replace(/\(/g, "&#40;");
    sanitized = sanitized.replace(/\)/g, "&#41;");
    return sanitized;
} 