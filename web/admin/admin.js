function doAdminSetup() {
    document.title = botData.svrnm + " Admin Console";
    document.getElementById("servername").innerHTML = botData.svrnm;
    document.getElementById("profilepic").src = botData.svricon;
    setFavicon(botData.svricon);
    document.getElementById("botsince").innerHTML = botData.botnm + " added " + botData.joined + " ago";
    
    switchAdmins();
    $("#admins-body").collapse("show");
    switchBlocked();
    $("#blocked-body").collapse("show");
    switchStrikes();
    $("#strikes-body").collapse("show");
    switchRss();
    $("#rss-body").collapse("show");
    switchCommands();
    $("#commands-body").collapse("show");
    switchManage();
    $("#manage-body").collapse("show");
    switchTriviaSets();
    $("#triviasets-body").collapse("show");
    switchExtensions();
    $("#extensions-body").collapse("show");
    
    $("#loading-modal").modal("hide");
}

function switchAdmins() {
    document.getElementById("adminstable").style.display = "";
    
    var blacklist = [];
    var adminstablebody = "";
    for(var i=0; i<botData.configs.admins.length; i++) {
        blacklist.push(botData.configs.admins[i][2]);
        adminstablebody += "<tr id=\"adminsentry-" + botData.configs.admins[i][2] + "\"><td><img class=\"profilepic\" width=25 src=\"" + botData.configs.admins[i][0] + "\" /></td><td>" + botData.configs.admins[i][1] + "</td><td>" + botData.configs.admins[i][2] + "</td><td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:config('admins', this.parentNode.parentNode.id.substring(12), function() {switchAdmins();switchBlocked();switchStrikes();});\">Remove</button></td></tr>";
    }
    document.getElementById("adminstablebody").innerHTML = adminstablebody;
    if(botData.configs.admins.length==0) {
        document.getElementById("adminstable").style.display = "none";
    }
    
    for(var i=0; i<botData.configs.blocked.length; i++) {
        blacklist.push(botData.configs.blocked[i][2]);
    }
    filterMembers(blacklist, function(possibleAdmins) {
        var adminsselector = "<option value=\"\">Select Member</option>";
        for(var i=0; i<possibleAdmins.data.length; i++) {
            adminsselector += "<option value=\"" + possibleAdmins.data[i][1] + "\">" + possibleAdmins.data[i][0] + "</option>";
        }
        document.getElementById("adminsselector").innerHTML = adminsselector;
        $("#adminsselector").selectpicker("refresh");
    });
}

function switchBlocked() {
    document.getElementById("blockedtable").style.display = "";
    
    var blacklist = [];
    var blockedtablebody = "";
    for(var i=0; i<botData.configs.blocked.length; i++) {
        blacklist.push(botData.configs.blocked[i][2]);
        blockedtablebody += "<tr id=\"blockedentry-" + botData.configs.blocked[i][2] + "\"><td><img class=\"profilepic\" width=25 src=\"" + botData.configs.blocked[i][0] + "\" /></td><td>" + botData.configs.blocked[i][1] + "</td><td>" + botData.configs.blocked[i][2] + "</td>" + (botData.configs.blocked[i][3] ? "" : "<td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:config('blocked', this.parentNode.parentNode.id.substring(13), function() {switchAdmins();switchBlocked();switchStrikes();});\">Unblock</button></td>") + "</tr>";
    }
    document.getElementById("blockedtablebody").innerHTML = blockedtablebody;
    if(botData.configs.blocked.length==0) {
        document.getElementById("blockedtable").style.display = "none";
    }
    
    for(var i=0; i<botData.configs.admins.length; i++) {
        blacklist.push(botData.configs.admins[i][2]);
    }
    filterMembers(blacklist, function(possibleBlocked) {
        var blockedselector = "<option value=\"\">Select Member</option>";
        for(var i=0; i<possibleBlocked.data.length; i++) {
            blockedselector += "<option value=\"" + possibleBlocked.data[i][1] + "\">" + possibleBlocked.data[i][0] + "</option>";
        }
        document.getElementById("blockedselector").innerHTML = blockedselector;
        $("#blockedselector").selectpicker("refresh");
    });
}

function switchStrikes() {
    document.getElementById("strikestable").style.display = "";
    
    var blacklist = [];
    var strikestablebody = "";
    for(var i=botData.strikes.length-1; i>=0; i--) {
        strikestablebody += "<tr id=\"strikesentry-" + botData.strikes[i][0] + "\"><td><img class=\"profilepic\" width=25 src=\"" + botData.strikes[i][1] + "\" /></td><td>" + botData.strikes[i][2] + "</td><td>" + botData.strikes[i][3].length + "</td><td><button type=\"button\" id=\"strikesentry-" + i + "-view\" class=\"btn btn-default btn-xs strikesview\">View</button>&nbsp;<button type=\"button\" id=\"strikesentry-" + i + "-add\" class=\"btn btn-primary btn-xs strikesadd\">Add</button>&nbsp;<button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:removeStrike(this.parentNode.parentNode.id.substring(13), " + i + ");\">Remove All</button></td></tr>";
    }
    document.getElementById("strikestablebody").innerHTML = strikestablebody;
    if(botData.strikes.length==0) {
        document.getElementById("strikestable").style.display = "none";
    }
    
    $("#strikestable").popover({ 
        html: true,
        title: function() {
            i = parseInt(this.id.substring(this.id.indexOf("-")+1, this.id.lastIndexOf("-")));
            return "<button type=\"button\" class=\"close\" id=\"strikesentry-" + botData.strikes[i][0] + "-popoverclose\" onclick=\"$('#" + this.id + "').popover('hide');\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">Strikes for " + botData.strikes[i][2] + "</h4>";
        },
        content: function() {
            i = parseInt(this.id.substring(this.id.indexOf("-")+1, this.id.lastIndexOf("-")));
            var popovercontent = "<div class=\"table-responsive\"><table class=\"table table-striped\"><thead><tr><th>#</th><th>Reason</th><th>From</th><th>Action</th></tr></thead><tbody>";
            for(var j=0; j<botData.strikes[i][3].length; j++) {
                popovercontent += "<tr id=\"" + j + "-" + botData.strikes[i][0] + "-strikesentry\"><td>" + (j+1) + "</td><td>" + botData.strikes[i][3][j][1] + "</td><td>@" + botData.strikes[i][3][j][0] + "</td><td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:removeStrike('" + botData.strikes[i][0] + "', " + i + ", this.parentNode.parentNode.id.substring(0, this.parentNode.parentNode.id.indexOf('-')));\">Remove</button></td></tr>";
            }
            popovercontent += "</tbody></table></div>";
            return popovercontent;
        },
        selector: ".strikesview",
        placement: "bottom",
        container: "body",
        trigger: "click"
    });
    $("#strikestablebody").popover({
        html: true,
        title: function() {
            i = parseInt(this.id.substring(this.id.indexOf("-")+1, this.id.lastIndexOf("-")));
            return "<button type=\"button\" class=\"close\" id=\"strikesentry-" + botData.strikes[i][0] + "-popoverclose\" onclick=\"$('#" + this.id + "').popover('hide');\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">Add Strike</h4>";
        },
        content: function() {
            i = parseInt(this.id.substring(this.id.indexOf("-")+1, this.id.lastIndexOf("-")));
            return "<div class=\"input-group\"><input type=\"text\" id=\"" + botData.strikes[i][0] + "-strikesadd\" class=\"form-control\" placeholder=\"Reason for strike\" onkeydown=\"if(event.keyCode==13){addStrike('" + botData.strikes[i][0] + "', this.value, " + i + ");}\"><span class=\"input-group-addon btn btn-primary\" onclick=\"javascript:addStrike('" + botData.strikes[i][0] + "', document.getElementById('" + botData.strikes[i][0] + "-strikesadd').value, " + i + ");\">Add</span></div><script>document.getElementById(\"" + botData.strikes[i][0] + "-strikesadd\").parentNode.parentNode.parentNode.style.maxWidth = \"350px\";</script>";
        },
        selector: ".strikesadd",
        placement: "bottom",
        container: "body",
        trigger: "click"
    });
    
    for(var i=0; i<botData.configs.admins.length; i++) {
        blacklist.push(botData.configs.admins[i][2]);
    }
    filterMembers(blacklist, function(possibleStrikes) {
        var strikesselector = "<option value=\"\">Select Member</option>";
        for(var i=0; i<possibleStrikes.data.length; i++) {
            strikesselector += "<option value=\"" + possibleStrikes.data[i][1] + "\">" + possibleStrikes.data[i][0] + "</option>";
        }
        document.getElementById("strikesselector").innerHTML = strikesselector;
        $("#strikesselector").selectpicker("refresh");
    });
    document.getElementById("strikesinput").value = "";
}

function newStrike() {
    if(!document.getElementById("strikesselector").value || !document.getElementById("strikesinput").value) {
        if(!document.getElementById("strikesselector").value) {
            richModal("Select a member");
        }
        if(!document.getElementById("strikesinput").value) {
            $("#strikesinput-block").addClass("has-error");
        }
    } else {
        $("#strikesinput-block").removeClass("has-error");
        config("strikes", [document.getElementById("strikesselector").value, document.getElementById("strikesinput").value], function() {
            switchAdmins();
            switchBlocked();
            switchStrikes();
        });
    }
}

function addStrike(usrid, reason, i) {
    if(reason) {
        $("#strikesentry-" + i + "-view").popover("hide");
        $("#strikesentry-" + i + "-add").popover("hide");
        config("strikes", [usrid, reason], function() {
            switchAdmins();
            switchBlocked();
            switchStrikes();
        });
    }
}

function removeStrike(usrid, i, u) {
    $("#strikesentry-" + i + "-view").popover("hide");
    $("#strikesentry-" + i + "-add").popover("hide");
    config("strikes", [usrid, u || -1], function() {
        switchAdmins();
        switchBlocked();
        switchStrikes();
    });
}

function switchRss() {
    document.getElementById("rsstable").style.display = "";
    
    var rsstablebody = "";
    for(var i=0; i<botData.configs.rss[1].length; i++) {
        rsstablebody += "<tr id=\"rssentry-" + i + "\"><td>" + botData.configs.rss[2][i] + "</td><td><a href=\"" + botData.configs.rss[1][i] + "\">" + botData.configs.rss[1][i] + "</a></td><td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:config('rss', this.parentNode.parentNode.id.substring(9), switchRss);\">Remove</button></td></tr>";
    }
    document.getElementById("rsstablebody").innerHTML = rsstablebody;
    if(botData.configs.rss[1].length==0) {
        document.getElementById("rsstable").style.display = "none";
    }
}

function newRss() {
    if(!document.getElementById("rssnewname").value || !document.getElementById("rssnewurl").value) {
        if(!document.getElementById("rssnewname").value) {
            $("#rssnewname-block").addClass("has-error");
        }
        if(!document.getElementById("rssnewurl").value) {
            $("#rssnewurl-block").addClass("has-error");
        }
    } else if(document.getElementById("rssnewname").value.indexOf(" ")>-1 || document.getElementById("rssnewurl").value.indexOf(" ")>-1) {
        richModal("Name and URL cannot contain spaces");
    } else {
        $("#rssnewname-block").removeClass("has-error");
        $("#rssnewurl-block").removeClass("has-error");
        config("rss", [document.getElementById("rssnewurl").value, document.getElementById("rssnewname").value], function() {
            document.getElementById("rssnewname").value = "";
            document.getElementById("rssnewurl").value = "";
            switchRss();
        });
    }
}

function switchCommands() {
    var commands = "";
    for(var cmd in botData.configs) {
        if(["admins", "blocked", "extensions", "newgreeting", "nsfwfilter", "rss", "servermod", "spamfilter", "cmdtag", "newmembermsg", "rmmembermsg", "banmembermsg", "unbanmembermsg", "triviasets", "showpub"].indexOf(cmd)==-1) {
            commands += "<div class=\"checkbox\"><input style=\"height: auto;\" id=\"commandsentry-" + cmd + "\" type=\"checkbox\" onclick=\"javascript:config(this.id.substring(14), this.checked, switchCommands);\" " + (botData.configs[cmd] ? "checked " : "") + "/><label for=\"commandsentry-" + cmd + "\">" + cmd + "</label></div>";
        }
    }
    $("#commands-container").html(commands);
    document.getElementById("commandtag-tag").innerHTML = "@" + botData.botnm;
    document.getElementById("commandtag-selector").value = botData.configs.cmdtag;
    $("#commandtag-selector").selectpicker("refresh");
}

function resetConfigs() {
    config("preset", "default", function(err) {
        if(!err) {
            location.reload();
        }
    });
}

function switchManage() {
    document.getElementById("manageentry-servermod").checked = botData.configs.servermod;
    
    var membermsg = ["newmembermsg", "onmembermsg", "offmembermsg", "rmmembermsg", "banmembermsg", "unbanmembermsg"];
    for(var i=0; i<membermsg.length; i++) {
        document.getElementById("manageentry-" + membermsg[i]).checked = botData.configs[membermsg[i]][0];
        if(botData.configs[membermsg[i]][0]) {
            var current_block = "";
            for(var j=0; j<botData.configs[membermsg[i]][1].length; j++) {
                current_block += "<div class=\"checkbox\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" onclick=\"javascript:config('" + membermsg[i] + "', this.value, function() {});\" id=\"manageentry-" + membermsg[i] + "-" + j + "\" value=\"" + botData.configs[membermsg[i]][1][j] + "\" checked><label for=\"manageentry-" + membermsg[i] + "-" + j + "\">" + botData.configs[membermsg[i]][1][j].replace("++", "<b>@user</b>") + "</label></div>";
            }
            document.getElementById("manageentry-" + membermsg[i] + "-block").innerHTML = current_block;
            document.getElementById(membermsg[i] + "-input").value = "";
            $("#manageentry-" + membermsg[i] + "-body").collapse("show");
        } else {
            $("#manageentry-" + membermsg[i] + "-body").collapse("hide");
        }
    }
    
    document.getElementById("manageentry-spamfilter").checked = botData.configs.spamfilter[0];
    if(botData.configs.spamfilter[0]) {
        if(!document.getElementById("manageentry-spamfilter-block").innerHTML) {
            var spamfilter_block = "";
            for(var i=0; i<botData.channels.length; i++) {
                spamfilter_block += "<div class=\"checkbox\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" id=\"manageentry-spamfilter-" + botData.channels[i][1] + "\" onclick=\"javascript:config('spamfilter', this.id.substring(23), function() {});\"" + (botData.configs.spamfilter[1].indexOf(botData.channels[i][1])==-1 ? " checked" : "") + "><label for=\"manageentry-spamfilter-" + botData.channels[i][1] + "\">" + botData.channels[i][0] + "</label></div>";
            }
            document.getElementById("manageentry-spamfilter-block").innerHTML = spamfilter_block;
        }
        $("#manageentry-spamfilter-body").collapse("show");
    } else {
        $("#manageentry-spamfilter-body").collapse("hide");
    }
    switch(botData.configs.spamfilter[2]) {
        case 10:
            document.getElementById("manageentry-spamfilter-selector").value = "low";
            break;
        case 5:
            document.getElementById("manageentry-spamfilter-selector").value = "medium";
            break;
        case 3:
            document.getElementById("manageentry-spamfilter-selector").value = "high";
            break;
    }
    
    document.getElementById("manageentry-nsfwfilter").checked = botData.configs.nsfwfilter[0];
    if(botData.configs.nsfwfilter[0]) {
        if(!document.getElementById("manageentry-nsfwfilter-block").innerHTML) {
            var nsfwfilter_block = "";
            for(var i=0; i<botData.channels.length; i++) {
                nsfwfilter_block += "<div class=\"checkbox\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"checkbox\" id=\"manageentry-nsfwfilter-" + botData.channels[i][1] + "\" onclick=\"javascript:config('nsfwfilter', this.id.substring(23), function() {});\"" + (botData.configs.nsfwfilter[1].indexOf(botData.channels[i][1])==-1 ? " checked" : "") + "><label for=\"manageentry-nsfwfilter-" + botData.channels[i][1] + "\">" + botData.channels[i][0] + "</label></div>";
            }
            document.getElementById("manageentry-nsfwfilter-block").innerHTML = nsfwfilter_block;
        }
        $("#manageentry-nsfwfilter-body").collapse("show");
    } else {
        $("#manageentry-nsfwfilter-body").collapse("hide");
    }
    
    disableBlock("servermod", !botData.configs.servermod);
    if(!botData.configs.servermod) {
        document.getElementById("manageentry-spamfilter-selector").setAttribute("disabled", "disable");
    } else {
        document.getElementById("manageentry-spamfilter-selector").removeAttribute("disabled");
    }
    $("#manageentry-spamfilter-selector").selectpicker("refresh");
    
    if(botData.configs.newgreeting && botData.configs.servermod) {
        document.getElementById("manageentry-newgreeting").style.display = "";
        document.getElementById("newgreetingremove").style.display = "";
        document.getElementById("newgreetinginput").value = botData.configs.newgreeting;
    } else if(!botData.configs.servermod) {
        document.getElementById("manageentry-newgreeting").style.display = "none";
    } else {
        document.getElementById("newgreetingremove").style.display = "none";
        document.getElementById("newgreetinginput").value = "";
    }
    
    if(botData.polls.length>0) {
        document.getElementById("manageentry-polls").style.display = "";
        var manageentry_polls_block = "";
        for(var i=0; i<botData.polls.length; i++) {
            manageentry_polls_block += "<li>" + botData.polls[i][1] + " <span class=\"removetool\" id=\"manageentry-polls-" + botData.polls[i][0] + "\" onclick=\"javascript:config('closepoll', this.id.substring(18), function() {});\"><i>(close)</i></span></li>";
        }
        document.getElementById("manageentry-polls-block").innerHTML = manageentry_polls_block;
    } else {
        document.getElementById("manageentry-polls").style.display = "none";
    }
    
    if(botData.trivia.length>0) {
        document.getElementById("manageentry-trivia").style.display = "";
        var manageentry_trivia_block = "";
        for(var i=0; i<botData.trivia.length; i++) {
            manageentry_trivia_block += "<li>" + botData.trivia[i][1] + " <span class=\"removetool\" id=\"manageentry-trivia-" + botData.trivia[i][0] + "\" onclick=\"javascript:config('endtrivia', this.id.substring(19), function() {});\"><i>(end)</i></span></li>";
        }
        document.getElementById("manageentry-trivia-block").innerHTML = manageentry_trivia_block;
    } else {
        document.getElementById("manageentry-trivia").style.display = "none";
    }
    
    var caselector = ""; 
    for(var i=0; i<botData.channels.length; i++) {
        caselector += "<option id=\"caentry-" + botData.channels[i][1] + "\" value=\"" + botData.channels[i][1] + "\">#" + botData.channels[i][0] + "</option>";
    }
    document.getElementById("caselector").innerHTML = caselector;
    $("#caselector").selectpicker("refresh");
    
    document.getElementById("manageentry-showpub").checked = botData.configs.showpub;
}

function disableBlock(blockname, disable) {
    var inputs = document.getElementById("manageentry-" + blockname + "-block").getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
        if(disable) {
            inputs[i].setAttribute("disabled", "disable");
        } else {
            inputs[i].removeAttribute("disabled");
        }
    }
    var buttons = document.getElementById("manageentry-" + blockname + "-block").getElementsByClassName("btn");
    for(var i=0; i<buttons.length; i++) {
        if(disable) {
            buttons[i].setAttribute("disabled", "disable");
        } else {
            buttons[i].removeAttribute("disabled");
        }
    }
}

function configNewgreeting(content) {
    if(!content && !botData.configs.newgreeting) {
        richModal("New member greeting cannot be blank");
    } else {
        config("newgreeting", content, function() {});
    }
}

function configCA(type) {
    if(!document.getElementById("cainput").value) {
        $("#cainput-block").addClass("has-error");
        return;
    }
    
    $("#cainput-block").addClass("remove-error");
    if(type=="clean") {
        config(type, [document.getElementById("caselector").value, parseInt(document.getElementById("cainput").value)], function() {
            richModal("Cleaned " + num + " messages in " + document.getElementById("cleanentry-" + chid).innerHTML, "Info");
        });
    } else if(type=="archive") {
        $("#loading-modal").modal("show");
        getJSON("/archive?auth=" + authtoken + "&type=" + authtype + "&svrid=" + JSON.parse(localStorage.getItem("auth")).svrid + "&chid=" + document.getElementById("caselector").value + "&num=" + parseInt(document.getElementById("cainput").value), function(archive) {
            window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(archive)));
            $("#loading-modal").modal("hide");
        });
    }
}

function switchTriviaSets() {
    document.getElementById("triviasetstable").style.display = "";
    
    var triviasetstablebody = "";
    for(var i=0; i<botData.configs.triviasets.length; i++) {
        triviasetstablebody += "<tr id=\"triviasetsentry-" + encodeURI(botData.configs.triviasets[i][0]) + "\"><td>" + botData.configs.triviasets[i][0] + "</td><td>" + botData.configs.triviasets[i][1] + "</td><td><button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:config('triviasets', this.parentNode.parentNode.id.substring(16), switchTriviaSets);\">Remove</button></td></tr>";
    }
    document.getElementById("triviasetstablebody").innerHTML = triviasetstablebody;
    if(botData.configs.triviasets.length==0) {
        document.getElementById("triviasetstable").style.display = "none";
    }
}

function newTriviaSet(uploads) {
    if(!uploads) {
        richModal("Upload a file and enter a name");
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(event) {
        try {
            var tset = JSON.parse(event.target.result);
            config("triviasets", tset, function(err) {
                if(err) {
                    richModal("Error adding trivia set, see logs for details");
                } else {
                    switchTriviaSets();
                }
            });
        } catch(err) {
            richModal("File must be JSON format");
        }
    };
    reader.readAsText(uploads[0]);
    
    document.getElementById("triviasetsupload").value = null;
}

function switchExtensions() {
    document.getElementById("extensionstable").style.display = "";
    
    var extensionstablebody = "";
    for(var i=0; i<botData.configs.extensions.length; i++) {
        var info = "<tr id=\"extensionsentry-" + encodeURI(botData.configs.extensions[i][0]) + "\"><td>" + botData.configs.extensions[i][0] + "</td><td>" + botData.configs.extensions[i][1] + "</td><td>";
        if(botData.configs.extensions[i][2].length>0) {
            var chinfo = "";
            for(var j=0; j<botData.configs.extensions[i][2].length; j++) {
                chinfo += "#" + botData.configs.extensions[i][2][j] + ", ";
            }
            info += chinfo.substring(0, chinfo.length-2);
        } else {
            info += "All";
        }
        info += "</td><td><button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"javascript:showExtension(" + i + ");\">View Code</button>&nbsp;<button type=\"button\" class=\"btn btn-danger btn-xs\" onclick=\"javascript:config('extensions', this.parentNode.parentNode.id.substring(16), switchExtensions);\">Delete</button></td></tr>";
        extensionstablebody += info;
    }
    document.getElementById("extensionstablebody").innerHTML = extensionstablebody;
    if(botData.configs.extensions.length==0) {
        document.getElementById("extensionstable").style.display = "none";
    }
}

function showExtension(i) {
    window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(botData.configs.extensions[i][3])));
}

function newExtension(uploads) {
    if(!uploads) {
        richModal("Upload a file and enter a name");
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(event) {
        try {
            var extension = JSON.parse(event.target.result);
            config("extensions", extension, function(err) {
                if(err) {
                    richModal("Error adding extension, see logs for details");
                } else {
                    switchExtensions();
                }
            });
        } catch(err) {
            richModal("File must be JSON format");
        }
    };
    reader.readAsText(uploads[0]);
    
    document.getElementById("extensionsupload").value = null;
}

function leaveServer() {
    config("leave", true, function(err) {
        localStorage.removeItem("auth");
        document.location.replace("/");
    });
}