addLayer("a", {
    symbol: "A",
    color: "#DBD639",
    row: "side",
    position: 0,

    layerShown(){return true},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        firstsecrettimer: 0,
    }},
    tooltip(){return `<h2>Achievements</h2><br>${player.a.achievements.length} achievements`},

    tabFormat: {
        "Achievements": {
            content: [
                ["display-text",
                    function() { return `You have <h2 style="color: #DBD639; text-shadow: #DBD639 0px 0px 10px;">${player.a.achievements.length}</h2> achievements, boosting generator point production by x${format(layers.a.effect())}` }],
                "blank",
                "blank",
                ["achievements",[1,2,3,4,5,6,7,8,9]],
                ["blank",10],
                ["achievements",[10]]
            ]
        },
    },

    achievements: {
        11: {
            name: "<span class='id'>ACH 11<br></span>a small start",
            done() {return player.g.points.gte(100)},
            tooltip: "Collect 100 generator dust",
        },
        12: {
            name: "<span class='id'>ACH 12<br></span>a smaller start",
            done() {return player.g.buyables[31].gte(1)},
            tooltip: "Do a compact",
        },
        13: {
            name: "<span class='id'>ACH 13 [★]<br></span>an even smaller start",
            done() {return player.g.buyables[31].gte(2)},
            tooltip: "Do two compacts<br>[★]: Unlocks 2 more compact milestones",
        },
        14: {
            name: "<span class='id'>ACH 14 [★]<br></span>compaction",
            done() {return player.g.buyables[31].gte(4)},
            tooltip: "Do four compacts<br>[★]: Unlocks another compact milestones & a new layer",
        },
        15: {
            name: "<span class='id'>ACH 15 [★]<br></span>more compaction",
            done() {return player.g.buyables[31].gte(7)},
            tooltip: "Compact 7 times<br>[★]: Unlocks new skill upgrades and nerf the skill requirement scaling",
        },
        21: {
            name: "<span class='id'>ACH 21 [★]<br></span>dont cry",
            done() {return hasMilestone("g",3) || player.d.points.gte(1)},
            tooltip: "Unlock Depression<br>[★]: One skill branch is removed",
        },
        22: {
            name: "<span class='id'>ACH 22<br></span>skilled",
            done() {return player.s.points.gte(10)},
            tooltip: "Have 10 skill at once",
        },
        23: {
            name: "<span class='id'>ACH 23<br></span>''full'' automation",
            done() {return player.sa.points.gte(7)},
            tooltip: "Have atleast 7 automation points",
        },
        24: {
            name: "<span class='id'>ACH 24<br></span>full automation",
            done() {return player.sa.points.gte(10)},
            tooltip: "Have atleast 10 automation points",
        },
        25: {
            name: "<span class='id'>ACH 25<br></span>when is too much?",
            done() {return player.s.points.gte(30)},
            tooltip: "Have atleast 30 skill points",
        },
        31: {
            name: "<span class='id'>ACH 31<br></span>boring",
            done() {return player.d.challenges[11] >= 5},
            tooltip: "Beat 'Baseline V'",
        },
        32: {
            name: "<span class='id'>ACH 32<br></span>large roots",
            done() {return player.d.challenges[12] >= 5},
            tooltip: "Beat 'Supersqrt V'",
        },
        33: {
            name: "<span class='id'>ACH 33<br></span>who needs prestige anyway",
            done() {return player.d.challenges[21] >= 5},
            tooltip: "Beat 'Prestige Nerf V'",
        },
        34: {
            name: "<span class='id'>ACH 34<br></span>who needs points anyway",
            done() {return player.d.challenges[22] >= 5},
            tooltip: "Beat 'Point Drought V'",
        },
        35: {
            name: "<span class='id'>ACH 35 [★]<br></span>partial clear!",
            done() {return player.a.achievements.length >= 11},
            tooltip: "Have 11 achievements<br>Unlock new achievements",
        },
        41: {
            name: "<span class='id'>ACH 41<br></span>not overpowered",
            done() {return hasUpgrade("s",92) && hasUpgrade("s",93)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have both 'expensive upgrade' and 'huge power bump' at once",
        },
        42: {
            name: "<span class='id'>ACH 42 [★]<br></span>maybe overpowered",
            done() {return player.s.points.gte(80)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Obtain 80 skill<br>[★]: Tear scaling is decreased",
        },
        43: {
            name: "<span class='id'>ACH 43 [★]<br></span>finally, a new layer",
            done() {return player.d.challenges[31] >= 1},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Beat Baseline 2I<br>[★]: Time Warp II's effect is ^1.1.",
        },
        44: {
            name: "<span class='id'>ACH 44<br></span>all the progress..",
            done() {return player.t.points.gte(1)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Do a tree reset",
        },
        45: {
            name: "<span class='id'>ACH 45<br></span>a small start but 2",
            done() {return player.t.leaves.gte(100)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have 100 leaves",
        },
        51: {
            name: "<span class='id'>ACH 51<br></span>playing for ages",
            done() {return player.g.time >= 1e18*3.154e7},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have your 'time since row 2 reset' reach 1e18 years (viewable with G-layer tooltip)",
        },
        52: {
            name: "<span class='id'>ACH 52<br></span>point inflation",
            done() {return player.points.gte("1e3000")},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have 1e3,000 points",
        },
        53: {
            name: "<span class='id'>ACH 53 [★]<br></span>tear up",
            done() {return player.d.challenges[31] >= 2},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Beat Baseline 2 II<br>[★] Tear cost scaling is decreased heavily.",
        },
        54: {
            name: "<span class='id'>ACH 54 [★]<br></span>double digit",
            done() {return player.t.points.gte(11)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have 11 trees<br>[★] Tear cost is decreased again.",
        },
        55: {
            name: "<span class='id'>ACH 55<br></span>mastery",
            done() {return player.s.points.gte(1000)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have 1,000 skill",
        },
        61: {
            name: "<span class='id'>ACH 61 [★]<br></span>no issue salt",
            done() {return player.d.points.gte(25)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Have 25 tears without beating 'Skill Issue' at all.<br>[★] Start with all completions of 'Skill Issue' on row 3 resets. Also unlocks new achievements.",
        },
        62: {
            name: "<span class='id'>ACH 62<br></span>thats a long time",
            done() {return player.g.time.gte(new Decimal('1.79e308').mul(31536000))},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",61)},
            tooltip: "Let 1.79e308yrs of time pass",
        },
        63: {
            name: "<span class='id'>ACH 63 [★]<br></span>it's the end..",
            done() {return player.s.points.gte(7300)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",61)},
            tooltip: "Have 7,300 skill<br>[★] YOU WIN !! Unlock a small amount post-endgame content.",
        },
        64: {
            name: "<span class='id'>ACH 64<br></span>the actual end",
            done() {return player.t.points.gte(41)},
            unlocked() {return hasAchievement("a",64)},
            tooltip: "Have 41 trees",
        },
        65: {
            name: "<span class='id'>ACH 65<br></span>the actual, actual end",
            done() {return player.t.points.gte(42)},
            unlocked() {return hasAchievement("a",64)},
            tooltip: "Have 42 trees",
        },
        71: {
            name: "<span class='id'>ACH 71 ⭕<br></span>the actual, actual, actual end",
            done() {return player.t.points.gte(43)},
            unlocked() {return hasAchievement("a",65)},
            tooltip: "Have 43 trees<br>(⭕ means I didn't playtest this part)"
        },
        72: {
            name: "<span class='id'>ACH 72 ⭕<br></span>the actual, actual, actual, actual end",
            done() {return player.t.points.gte(44)},
            unlocked() {return hasAchievement("a",71)},
            tooltip: "Have 44 trees<br>(⭕ means I didn't playtest this part)"
        },
        73: {
            name: "<span class='id'>ACH 72 ⭕<br></span>the actual, actual, actual, actual end",
            done() {return player.t.points.gte(45)},
            unlocked() {return hasAchievement("a",72)},
            tooltip: "Have 45 trees<br>(⭕ means I didn't playtest this part)"
        },
    },
    effect(){
        if(player.a.achievements.length === 0) return new Decimal(1)
        return new Decimal(player.a.achievements.length).pow(1.5).div(10).add(1.2).add(new Decimal(player.a.achievements.length).pow(0.5).div(5))
    },

})