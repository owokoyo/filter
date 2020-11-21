const config = {
    deleteUnder: 3000,
    /*
      blacklist:
      binary star
      squariards
      pong game/pong stage
      ice hockey
      2+ "remix:" in a row
    */
    blacklistMatcher: /binary star|squariards|pong (game|stage)|ice hockey|((remix:( )?){2,}|PRO[- ]C\d)/i,
    deleteDuplicates: true,
}
var lastEntryName
var style = "align-self:start;width:auto;position:absolute;color:black;background-color:white";
function doForEntry(entry){
    var a = entry.children[0]
    var name = a.children[1].children[0].textContent
    var isDuplicate = lastEntryName===name && config.deleteDuplicates;
lastEntryName = name;
    if (name.match(config.blacklistMatcher)) {
        console.log(`removed ${name} for matching blacklist`)
        entry.parentNode.remove();
        return;
    }
    if (isDuplicate) {
        console.log(`removed ${name} for being a duplicate`)
        entry.parentNode.remove();
        return;
    }
    var id = a.children[1].attributes.href.value.split("/")[3]
    var node = document.createElement("p");
    node.setAttribute("style", style);
    a.insertBefore(node, a.childNodes[0])
    
    var cb = source=>{
        if (source[0].size>config.deleteUnder) {
            node.textContent = source[0].size
        } else {
            entry.parentNode.remove();
            console.log(`removed ${name} for being only ${source[0].size} bytes (min ${config.deleteUnder})`)
        }
    }
    $.get(`https://studio.code.org/v3/sources/${id}`).then(cb)
    
}
for (entry of $(".project_card")){
    doForEntry(entry)
}

var observer = new MutationObserver(ml=>{
    for (m of ml){
        if (m.type==="childList" && !(m.addedNodes[0]&&m.addedNodes[0].nodeName==="P")) {
            for (entry of $(".project_card")){
                if (entry.children[0].children[0].nodeName!="P") {
                    doForEntry(entry)
                }
            }
        }
    }
})
observer.observe(document.body, {childList: true,subtree:1})
