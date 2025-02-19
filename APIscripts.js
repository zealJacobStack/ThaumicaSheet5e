const aspectBase = "repeating_aspect_";
const addParentThaum = (msg, paramsThaum) => {
    var indexP = paramsThaum[1]; // Extract the index
    var nameP = paramsThaum[2]; // The remaining part is the name
    var baseUrl = paramsThaum[3];
    indexP = formatStringThaum(indexP);

    var repeatingBase = aspectBase + indexP;
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
        makeAspectAttr(repeatingBase + "_spellsave_mod", defaultVal, characterP.id);
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
            sendChat(msg.who, "/w gm Character not found: " + paramsThaum[3]);
        }
    }
};

const expendAttributeThaum = async (msg, paramsThaum) => {
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
        var repeatingBase = aspectBase + aspectName;
        var aspectPbId = repeatingBase + "_aspect_remaining";
        //if (toExpendArray.length === aspectNameArray.length && aspectNameArray.length === discountArray.length) {
        // sendChat(`character|${character.id}`, `toExpend: ${toExpend} %NEWLINE%
        //                                         aspectName: ${aspectName} %NEWLINE%
        //                                         discount: ${discount} %NEWLINE%
        //                                         rollName: ${rollName} %NEWLINE%
        //                                         rollType: ${rollType} %NEWLINE%
        //                                         charName: ${charName} %NEWLINE%
        //                                         `);
        //}

        thaumAspectSpell([aspectName], [toExpend], character.id, rollType, rollName);  
        /*
        toExpend = Number(await getRollThaum(toExpend));
        discount = Number(await getRollThaum(discount));
        var cost = await getCostThaum(toExpend, discount);
        
        var aspectU = findObjs({
            name: aspectPbId,
            _type: "attribute",
            _characterid: character.id
        })[0];
        var currentU = Number(aspectU.get("current"));
        if (currentU >= cost) {
            
            aspectU.set("current", currentU - cost);
            var expIndex = repeatingBase + "_aspect_exp";
            var profIndex = repeatingBase + "_aspect_pb";
            var expAttr = findObjs({
                name: expIndex,
                _type: "attribute",
                _characterid: character.id
            })[0];
            var pbAttr = getAttributeThaum(character.id, profIndex);
            var newExp = Number(expAttr.get("current")) + toExpend;
            var oldPb = Number(pbAttr.get("current"));
            if (!(rollType == "SPELLCARD" || rollType == "NONE" || rollType == "SAVE")) {
                
                aspectD20Roll(charName, character.id, aspectName, rollName, oldPb, rollType);
            }
            
            expAttr.set("current", newExp);
            pbAttr.set("current", aspectProf(newExp));
            
        } else {
            sendChat(msg.who, "/w gm Not enough " + aspectName + ". Cost: " + cost + ", and Reserves: " + currentU);
        }
        */
    } catch (error) {
        thaumError(error, "ExpendAttr: " + msg.content);
    }


}
const unExpendAttributeThaum = (msg, paramsThaum) => {
    try {
        var aspects = paramsThaum[1];
        var charId = paramsThaum[2];
        var rname = paramsThaum[3];
        var rtype = paramsThaum[4];
        let row = aspects.split(",");
        let aspectI = 0;
        let reserveI = 1;
        let expI = 2;
        for (let i = 0; i < row.length; i++) {
            let cells = row[i].split(" ");
            updateAspectExp(cells[aspectI], (-1 * Number(cells[expI])), (-1 * Number(cells[reserveI])), charId);
        }

        basicMessage(`character|${charId}`, `${msg.who} undid ${rtype} ${rname}`);
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
    let costFormula = paramsThaum[26];
    let d20mod = paramsThaum[27];
    let dcmod = paramsThaum[28];
    var charname = paramsThaum[29];
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
        costFormula = ${costFormula} %NEWLINE%
        d20mod = ${d20mod} %NEWLINE%
        dcmod = ${dcmod} %NEWLINE%
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
    let costFormula = paramsThaum[26];
    let d20mod = paramsThaum[27];
    let dcmod = paramsThaum[28];
    var charname = paramsThaum[29];
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
        costFormula = ${costFormula} %NEWLINE%
        d20mod = ${d20mod} %NEWLINE%
        dcmod = ${dcmod} %NEWLINE%
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
        if (gend >= 0) {
            var globalattacksubstring = "[[" + globalattack.substring(gstart, gend) + "]]";
        } else {
            var globalattacksubstring = globalattack;
        }


        var template = `@{${charname}|wtype}&{template:atk} {{mod=${mod}}} {{rname=${rname}}} {{rnamec=${rname}}} {{r1=[[@{${charname}|d20}${r1substring}]]}} @{${charname}|rtype}${r2substring}]]}} {{range=${range}}} {{desc=${desc}}} {{innate=${innate}}} {{globalattack=${globalattacksubstring}}} ammo= {{charname=${charname}}}`
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

const gainAttribute = async (msg, paramsThaum) => {
    try {
        let uValue = paramsThaum[1].split(",");
        let aspect = paramsThaum[2].split(",");
        let gainTrue = paramsThaum[3] == "true";
        let charName = paramsThaum[4];
        
        if (aspect.length != uValue.length) {
            let message = `ERROR: ${aspect.length} Aspect(s) found, but ${uValue.length} U Value(s) found. Make sure no "," or "|" were used.`;
            basicErrorMessage(charName, message);
        } else {
            let character = getThaumChar(charName);
            let reserves = [];
            let gains = [];
            for (let i = 0; i < aspect.length; i++) {
                let base = aspectBase + aspect[i];
                let reserve = getAttributeThaum(character.id, base + "_aspect_remaining");
                let currentReserves = Number(reserve.get("current"));
                let toGain = Number(await getRollThaum(uValue[i]));
                uValue[i] = toGain;
                let newReserve = (gainTrue) ? currentReserves + toGain : currentReserves - toGain;
                gains.push(toGain);
                reserves.push(newReserve);
                reserve.set("current", newReserve);
            }

            // Define the headers and columns as an array of objects
            const colors = {
                "text": "blue",
                "background": "transparent"
            }
            const tableData = {
                title: `<span style="color:${colors.text};font-weight:bolder;">[Undo Aspect ${(gainTrue) ? "Gain" : "Loss"}](${setUndoGainAttribute(aspect, uValue, gainTrue, charName)})</span>`,
                headers: ['Aspect', 'Reserves', `${(gainTrue) ? "Gain" : "Loss"}`],
            };

            // Define column widths as percentages, where the first two columns are 20% and the last column takes 60%
            const columnWidths = [60, 20, 20];
            const textAlign = ["left", "center", "center"];
            const cellTwoBorder = "border-left:1px solid black; border-right:1px solid black;";

            // Start building the table HTML string
            let backgroundImgSrc = `https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/sheet-box-border-thaum.png`;
            let background = `background: url(${backgroundImgSrc}) top left; background-size: 100% 100%; background-repeat: no-repeat;`

            let tableHTML = `<div style="${background}width:100%; max-width: 100%; margin-left: -15%; padding-left:10%;padding-right:10%;"><table style="background:none;width:100%; max-width: 100%; margin-left:-1%">`;

            // Generate the full-width table header
            tableHTML += '<thead>';
            tableHTML += '<tr>';
            tableHTML += `<th colspan="${tableData.headers.length}" style="padding:5px; background-color:transparent; color:red !important; text-align:center; width:100%;">${tableData.title}</th>`;
            tableHTML += '</tr>';
            tableHTML += '</thead>';


            // Generate the table headers dynamically
            tableHTML += '<tbody style="width:90%; max-width: 90%;">';
            tableHTML += '<tr >';
            tableData.headers.forEach((header, index) => {
                tableHTML += `<th style="${(index == 1) ? cellTwoBorder : ""} padding:5px; background-color:transparent; width:${columnWidths[index]}%;"><span style="color:black">${header}</span></th>`;
            });
            tableHTML += '</tr>';

            // Generate the table rows dynamically
            aspect.forEach((aspect1, i) => {
                let aspectImg = `<img style="height:98%; margin-right: 5px;" src="https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/${aspect1}.png">`
                tableHTML += '<tr style="width:100%; max-width: 100%; overflow: clip;">';
                tableData.headers.forEach((cell, index) => {
                    
                    tableHTML += `<td class="thaum-table-cell" style="${(index == 1) ? cellTwoBorder : ""} border-top:1px solid black; text-align:${textAlign[index]}; overflow: clip; text-wrap: nowrap; text-overflow: ellipsis; font-weight:bolder; color: black; background-color:transparent; padding:5px; width:${columnWidths[index]}%;height:28px; max-width:120px;">${(index == 0) ? aspectImg + " " + aspect1 : ""}${(index == 1) ? reserves[i] : ""}${(index == 2) ? gains[i] : ""}</td>`;
                });
                tableHTML += '</tr>';
            });

            // Generate the full-width table footer
            tableHTML += '<tfoot>';
            tableHTML += '<tr>';
            tableHTML += `<td colspan="${tableData.headers.length}" style=" padding:5px; background-color:transparent; color:red !important; text-align:center; width:100%;">${tableData.title}</td>`;
            tableHTML += '</tr>';
            tableHTML += '</tfoot>';

            // Close the table tag
            tableHTML += '</tbody>';
            tableHTML += '</table>';

            // Send the generated table to the chat
            sendChat(`character|${character.id}`, '/w gm ' + tableHTML);
            basicMessage(`character|${character.id}`, `${charName} ${(gainTrue) ? "gained" : "lost"} aspect`);
        }


    } catch (error) {
        thaumError(error, "GainAttribute MSG: " + msg.content);
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
    "!aspectspellcard ": aspectspellcardThaum,
    "!gainAttribute ": gainAttribute
};
/*
const aspectSpellThaum = {
    "ATTACK": aspectAttackRoll,
    "ABILITY": aspectAbilityRoll,
    "SAVE": aspectSave,
    "SPELLCARD": aspectSpellCard
};
*/

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
function setUndoGainAttribute(aspects, costs, gainTrue, charName) {
    let aspectOut = aspects.join();
    let costOut = costs.join();
    return "`!gainAttribute |" + costOut + "|" + aspectOut + "|" + ((!gainTrue) ? "true" : "false") + "|" + charName;
}
function thaumError(error, custom) {
    console.log("Error Trying: " + custom);
    console.log(error);
    sendChat("Error Trying: ", "/w gm " + custom);
    sendChat("Error", "/w gm " + error.message);
}
function basicErrorMessage(name, message) {
    let style = `style=" height:100%; width:100%; background-color:red; color:black; font-weight:bolder; margin-left:-5%; padding:5px;"`;
    let div = `<div ${style}>${message}</div>`;
    sendChat(name, "/w gm " + div);
}
function basicMessage(sender, content) {
    let backgroundImgSrc = `https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/rolldesc.png`;
    let background = `background: url(${backgroundImgSrc}) top left; background-size: 100% 100%; background-repeat: no-repeat;`
    let div = `<div style="${background} margin-left:-15%; display:flex; padding:5px; background-color:transparent; color:black; text-align:center; width:115%;">${content}</div>`
    sendChat(sender, div);
}
function basicTable(sender, content) {

}
function getCostThaum(toExpend, discount) {
    //discount can only reduce the cost to half at most
    toExpend = Number(toExpend);
    discount = Number(discount);
    let finalCost = Math.ceil(toExpend / 2) > toExpend - discount ? Math.ceil(toExpend / 2) : toExpend - discount;
    return finalCost;
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
        .replace(/_/g, " ") // Replace all spaces with underscores
        .split(" ") // Split the string into an array of words based on spaces
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter, lowercase the rest
        })
        .join("-"); // Join the array back into a string with underscores
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
        var base = aspectBase + aspect;
        let aspectGlobal = "[[" + findObjs({ name: `${base}_skill_mod`, _type: "attribute", _characterid: charId })[0].get("current") + "]]";

        var template = `@{${characterName}|wtype}&{template:simple} {{rname=${rollName} (Skill)}} {{rnamec=${rollName} (Skill)}} {{mod=@{${characterName}|${base}_aspect_pb}}} {{r1=[[@{${characterName}|d20}+@{${characterName}|${base}_aspect_pb}@{${characterName}|pbd_safe}]]}} @{${characterName}|rtype}+@{${characterName}|${base}_aspect_pb}@{${characterName}|pbd_safe}]]}} {{global=@{${characterName}|global_skill_mod}${aspectGlobal} }} @{${characterName}|charname_output}`;
        sendChat(`character|${charId}`, template);
    } catch (error) {
        thaumError(error, "AspectSkillCheck");
    }

}
async function aspectBasicAttackRoll(characterName, charId, aspect, rollName) {
    try {
        var base = aspectBase + aspect;
        //let aspectGlobal = "[[" + findObjs({ name: `${base}_attk_mod`, _type: "attribute", _characterid: charId })[0].get("current") + "]]";
        //let global = findObjs({ name: 'global_attack_mod', _type: "attribute", _characterid: charId })[0].get("current");

        let expression = await makeExpressionThaum(characterName, ['global_attack_mod', `${base}_attk_mod`]);

        var template = `@{${characterName}|wtype}&{template:atk} {{mod=@{${characterName}|${base}_aspect_pb}}} {{rname=[${rollName} (Attack Roll)]}} {{rnamec=[${rollName} (Attack Roll)]}} {{r1=[[@{${characterName}|d20}cs>20 + @{${characterName}|${base}_aspect_pb}[ASPECT PROF]]]}} @{${characterName}|rtype}cs>20 + @{${characterName}|${base}_aspect_pb}[ASPECT PROF]]]}} {{range=}} {{desc=}} {{innate=}} {{globalattack=[[${expression}]]}} ammo= @{${characterName}|charname_output}`
        sendChat(`character|${charId}`, template);
    } catch (error) {
        thaumError(error, "AspectBasicAttackRoll");
    }

}
async function aspectD20Roll(charId, aspect, rollName, rolltype) {
    try {
        var base = aspectBase + aspect;
        var global = getd20globalAspect(charId, base, rolltype);
        let pb = getAttrByName(charId, base + "_aspect_pb");
        let characterName = getAttrByName(charId, "character_name");

        var template = `@{${characterName}|wtype}&{template:atk} {{mod=${pb}}} {{rname=${rollName} *${rolltype}*}} {{rnamec=${rollName} *${rolltype}*}} {{r1=[[@{${characterName}|d20}cs>20 + ${pb}[${aspect} PB]]]}} @{${characterName}|rtype}cs>20 + ${pb}[${aspect} PB]]]}} {{range=}} {{desc=}} {{innate=}} {{globalattack=${global}}} ammo= @{${characterName}|charname_output}`
        sendChat(`character|${charId}`, template);
    } catch (error) {
        thaumError(error, "aspectD20Roll");
    }

}
function getd20globalAspect(charId, base, rolltype) {
    try {
        var global = getAttributeThaum(charId, "global_" + rolltype + "_mod").get("current");
        var aspectGlobal = getAttributeThaum(charId, base + (rolltype == "attack" ? "_attk_mod" : "_" + rolltype + "_mod")).get("current");
        var hasGlobal = (global) && (global.indexOf("[[") >= 0);
        var hasAspectGlobal = (aspectGlobal) && aspectGlobal != 0;
        var allGlobal = "";
        if (hasGlobal || hasAspectGlobal) {
            allGlobal = "[[";
            allGlobal = (hasGlobal) ? allGlobal + global.slice(2, -2) : allGlobal;
            allGlobal = (hasGlobal && hasAspectGlobal) ? allGlobal + " + " : allGlobal;
            allGlobal = (hasAspectGlobal) ? allGlobal + aspectGlobal : allGlobal;
            allGlobal = allGlobal + "]]";
        }
        return allGlobal;
    } catch (error) {
        thaumError(error, "getd20globalAspect, " + global);
    }

}
function aspectProf(experience) {

    if (experience < 20) {
        return 0;
    } else if (experience < 60) {
        return 1;
    } else if (experience < 180) {
        return 2;
    } else if (experience < 540) {
        return 3;
    } else if (experience < 1620) {
        return 4
    }
    return 6;
}
function aspectDescriptionRoll(characterName, charId, aspect) {

}
function aspectDamageRoll(characterName, charId, aspect) {

}

async function getRollThaum(roll) {
    try {
        roll = ("" + roll).trim();
        let rollOnce = await new Promise((resolve, reject) => {
            roll = roll ? "[[" + roll + "]]" : "[[" + 0 + "]]";
            sendChat("", roll, function (ops) {
                resolve(ops[0]);
            });

        });

        //sendChat("Get roll thaum", JSON.stringify(rollOnce.inlinerolls[0].results.total));
        result = rollOnce.inlinerolls[0].results.total;

        return result;
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

async function thaumAspectSpell(aspects, costs, charId, rolltype, rname, params) {
    try {
        let allCostDetails = [];
        for (let i = 0; i < costs.length; i++) {
            costs[i] = Number(await getRollThaum(costs[i]));
        }
        let canCast = await canCastThaumSpells(aspects, costs, charId, allCostDetails);
        if (canCast) {
            successfulCastMessage(allCostDetails, charId, rname, rolltype, costs);
            //Roll Goes here
            updateAspectsExp(aspects, costs, allCostDetails, charId);
            if (!params) {
                if (rolltype != "NONE") {
                    aspectD20Roll(charId, aspects[0], rname, rolltype);
                }
                
            } else {
                sendChat("ThaumAspectSpell", "TODO: Spell rolls");
            }
        } else {
            notEnoughAspectError(allCostDetails, charId);
        }
    } catch (error) {
        thaumError(error, "thaumAspectSpell");
    }

}
function notEnoughAspectError(allCostDetails, charId) {
    // Define the headers and columns as an array of objects
    const tableData = {
        title: '<span style="color:red;font-weight:bolder;">ERROR: NOT ENOUGH ASPECT</span>',
        headers: ['<span style="color:black;">Aspect</span>', '<span style="color:black;">Reserves</span>', '<span style="color:black;">Required</span>'],
    };
    const colors = {
        true: "red",
        false: "transparent"
    }

    // Define column widths as percentages, where the first two columns are 20% and the last column takes 60%
    const columnWidths = [60, 15, 15];
    const textAlign = ["left", "center", "center"];
    const cellTwoBorder = "border-left:1px solid black; border-right:1px solid black;";

    // Start building the table HTML string
    let backgroundImgSrc = `https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/sheet-box-border-thaum.png`;
    let background = `background: url(${backgroundImgSrc}) top left; background-size: 100% 100%; background-repeat: no-repeat;`

    let tableHTML = `<div style="${background}width:100%; max-width: 100%; margin-left: -15%; padding-left:10%;padding-right:10%;"><table style="background:none;width:100%; max-width: 100%; margin-left:-1%">`;

    // Generate the full-width table header
    tableHTML += '<thead>';
    tableHTML += '<tr>';
    tableHTML += `<th colspan="${tableData.headers.length}" style="border:none; padding:5px; background-color:transparent; color:red !important; text-align:center; width:100%;">${tableData.title}</th>`;
    tableHTML += '</tr>';
    tableHTML += '</thead>';


    // Generate the table headers dynamically
    tableHTML += '<tbody style="width:90%; max-width: 90%; margin:5%;">';
    tableHTML += '<tr >';
    tableData.headers.forEach((header, index) => {
        tableHTML += `<th style="${(index == 1) ? cellTwoBorder : ""} padding:5px; background-color:transparent; width:${columnWidths[index]}%;">${header}</th>`;
    });
    tableHTML += '</tr>';

    // Generate the table rows dynamically
    allCostDetails.forEach(row => {
        let aspectImg = `<img style="height:98%; margin-right: 5px;" src="https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/${row[0]}.png">`
        tableHTML += '<tr style="width:100%; max-width: 100%; overflow: clip;">';
        row.forEach((cell, index) => {
            let errorSource = (row[1] < row[2]);
            let content = `<span style="text-wrap:wrap;">${cell}</span>`
            tableHTML += `<td class="thaum-table-cell" style="${(index == 1) ? cellTwoBorder : ""}border-top:1px solid black;text-align:${textAlign[index]}; overflow: clip; text-wrap: nowrap; text-overflow: ellipsis; font-weight:bolder; color: black; background-color:${colors[(errorSource)]}; padding:5px; width:${columnWidths[index]}%;height:28px; max-width:120px;">${(index == 0) ? aspectImg : ""} ${content}</td>`;
        });
        tableHTML += '</tr>';
    });

    // Generate the full-width table footer
    tableHTML += '<tfoot>';
    tableHTML += '<tr>';
    tableHTML += `<td colspan="${tableData.headers.length}" style="border:none; padding:5px; background-color:transparent; color:red !important; text-align:center; width:100%;">${tableData.title}</td>`;
    tableHTML += '</tr>';
    tableHTML += '</tfoot>';

    // Close the table tag
    tableHTML += '</tbody>';
    tableHTML += '</table></div>';

    // Send the generated table to the chat
    sendChat(`character|${charId}`, '/w gm ' + tableHTML);

}
function getUnExpendCommand(allCostDetails, costs, charId, rname, rtype) {
    let aspects = "";
    for (let i = 0; i < allCostDetails.length; i++) {
        aspects += (i > 0) ? "," : "";
        aspects += allCostDetails[i][0] + " ";
        aspects += allCostDetails[i][2] + " ";
        aspects += costs[i];
    }
    return "`!unExpendAttribute |" + aspects + "|" + charId + "|" + rname + "|" + rtype;
}
function successfulCastMessage(allCostDetails, charId, rname, rtype, costs) {
    for (let i = 0; i < allCostDetails.length; i++) {
        let reserveOld = Number(allCostDetails[i][1]);
        let expend = Number(allCostDetails[i][2]);
        allCostDetails[i][1] = reserveOld - expend;
    }
    // Define the headers and columns as an array of objects
    const colors = {
        true: "blue",
        false: "black"
    }
    const tableData = {
        title: `<span style="color:${colors.true};font-weight:bolder;">[Undo ${rtype} ${rname}](${getUnExpendCommand(allCostDetails, costs, charId, rname, rtype)})</span>`,
        headers: ['Aspect', 'Reserves', 'Spent'],
    };


    // Define column widths as percentages, where the first two columns are 20% and the last column takes 60%
    const columnWidths = [60, 20, 20];
    const textAlign = ["left", "center", "center"];
    const cellTwoBorder = "border-left:1px solid black; border-right:1px solid black;";

    // Start building the table HTML string
    let backgroundImgSrc = `https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/sheet-box-border-thaum.png`;
    let background = `background: url(${backgroundImgSrc}) top left; background-size: 100% 100%; background-repeat: no-repeat;`

    let tableHTML = `<div style="${background}width:100%; max-width: 100%; margin-left: -15%; padding-left:10%;padding-right:10%;"><table style="background:none;width:100%; max-width: 100%; margin-left:-1%">`;

    // Generate the full-width table header
    tableHTML += '<thead>';
    tableHTML += '<tr>';
    tableHTML += `<th colspan="${tableData.headers.length}" style="padding:5px; background-color:transparent; color:red !important; text-align:center; width:100%;">${tableData.title}</th>`;
    tableHTML += '</tr>';
    tableHTML += '</thead>';


    // Generate the table headers dynamically
    tableHTML += '<tbody style="width:90%; max-width: 90%;">';
    tableHTML += '<tr >';
    tableData.headers.forEach((header, index) => {
        tableHTML += `<th style="${(index == 1) ? cellTwoBorder : ""} padding:5px; background-color:transparent; width:${columnWidths[index]}%;"><span style="color:black">${header}</span></th>`;
    });
    tableHTML += '</tr>';

    // Generate the table rows dynamically
    allCostDetails.forEach((row, i) => {
        let aspectImg = `<img style="height:98%; margin-right: 5px;" src="https://raw.githubusercontent.com/DM1818/ThaumicaSheet5e/refs/heads/main/images/${row[0]}.png">`
        tableHTML += '<tr style="width:100%; max-width: 100%; overflow: clip;">';
        row.forEach((cell, index) => {
            let colorTheme = (i % 2 == 0);
            let content = `<span style="text-wrap:wrap;">${cell}</span>`
            tableHTML += `<td class="thaum-table-cell" style="${(index == 1) ? cellTwoBorder : ""} border-top:1px solid black; text-align:${textAlign[index]}; overflow: clip; text-wrap: nowrap; text-overflow: ellipsis; font-weight:bolder; color: black; background-color:transparent; padding:5px; width:${columnWidths[index]}%;height:28px; max-width:120px;">${(index == 0) ? aspectImg : ""} ${content}</td>`;
        });
        tableHTML += '</tr>';
    });

    // Generate the full-width table footer
    tableHTML += '<tfoot>';
    tableHTML += '<tr>';
    tableHTML += `<td colspan="${tableData.headers.length}" style=" padding:5px; background-color:transparent; color:red !important; text-align:center; width:100%;">${tableData.title}</td>`;
    tableHTML += '</tr>';
    tableHTML += '</tfoot>';

    // Close the table tag
    tableHTML += '</tbody>';
    tableHTML += '</table>';

    // Send the generated table to the chat
    sendChat(`character|${charId}`, '/w gm ' + tableHTML);
}
function updateAspectsExp(aspects, costs, costsDetails, charId) {
    try {
        for (let i = 0; i < aspects.length; i++) {
            updateAspectExp(aspects[i], costs[i], costsDetails[i][2], charId);
        }
    } catch (error) {
        thaumError(error, "updateAspectsExp");
    }
}
async function updateAspectExp(aspect, cost, reduced, charId) {
    try {
        let base = aspectBase + aspect;
        let profAttr = getAttributeThaum(charId, base + "_aspect_pb");
        let expAttr = getAttributeThaum(charId, base + "_aspect_exp");
        let reserveAttr = getAttributeThaum(charId, base + "_aspect_remaining");

        let oldPb = Number(profAttr.get("current"));
        let newReserve = Number(reserveAttr.get("current")) - Number(reduced);
        let newExp = Number(expAttr.get("current")) + cost;
        let newPb = aspectProf(newExp);
        reserveAttr.set("current", Number(newReserve));
        expAttr.set("current", Number(newExp));
        profAttr.set("current", Number(newPb));

        //reveal or hide mastery rerolls
        if (oldPb != newPb) {
            let masteryAttr = getAttributeThaum(charId, base + "_mastery");
            let hasMastery = (newPb >= 6) ? "1" : "0";
            masteryAttr.set("current", hasMastery);
        }
    } catch (error) {
        thaumError(error, "updateAspectExp");
    }

}
async function canCastThaumSpells(aspects, costs, charId, allCostDetails) {
    try {
        let canCast = true;
        for (let i = 0; i < aspects.length; i++) {
            var costDetails = await canCastThaumSpell(aspects[i], costs[i], charId);
            if (costDetails[1] < costDetails[2]) {
                canCast = false;
            }
            allCostDetails.push(costDetails);
        }
        return canCast;
    } catch (error) {
        thaumError(error, "canCastThaumSpells");
    }
}
async function canCastThaumSpell(aspect, toExpend, charId) {
    try {
        var base = aspectBase + aspect;
        var reserves = Number(getAttrByName(charId, base + "_aspect_remaining"));
        let reductionHelper = getAttrByName(charId, base + "_cost_reduction");

        var reduction = await getRollThaum(reductionHelper);
        var reduced = Number(getCostThaum(toExpend, reduction));
        return [aspect, reserves, reduced];
    } catch (error) {
        thaumError(error, "canCastThaumSpell");
    }

}