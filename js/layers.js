const timeFormat = function(x){
    x = new Decimal(x)

    if(x.gte(3600*24*365*100)) return formatWhole(x.div(3600*24*365)) + "yrs"
    if(x.gte(3600*24*100)) return formatWhole(x.div(3600*24)) + "days"
    if(x.gte(3600*100)) return formatWhole(x.div(3600)) + "hrs"
    if(x.gte(60*100)) return formatWhole(x.div(60)) + "min"
    return formatWhole(x) + "secs"
}
const romanNumeral = function(x){
    if(x <= 10){
        return ["I","II","III","IV","V","VI","VII","VIII","IX","X"][x]
    }
    return x;
}

addLayer("g", {
    symbol: "Ge",
    color: "#95E856",
    row: 0,
    position: 0,

    resource: "generator dust",
    layerShown(){return true},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        time: new Decimal(0),
        buys: 0,
    }},
    tooltip(){return `<h2>Generators</h2><br>${formatWhole(player.g.points)} generator dust<br>${timeFormat(player.g.time)} passed`},

    milestonePopups() {return !hasAchievement("a",14)},
    tabFormat: {
        "Generators": {
            content: [
                ["blank",24],
                ["display-text",
                    function() {
                        if(player.g.points.gte(1e9) || hasAchievement("a",14)) return `<h2 style="color: rgb(145, 219, 86); text-shadow: rgb(145, 219, 86) 0px 0px 10px;">${format(player.g.points)}</h2> generator dust, generating ${format(layers.g.effect())} points each second`
                        return `You have <h2 style="color: rgb(145, 219, 86); text-shadow: rgb(145, 219, 86) 0px 0px 10px;">${format(player.g.points)}</h2> generator dust, generating ${format(layers.g.effect())} points each second`
                    }],
                ["display-text",
                    function() { return `(+${format(layers.g.production())}/s)` }, {"font-size": "12px"}],
                "blank",
                ["buyables",[1,2]],
                ["display-text",
                    function() { return `you can hold on all buyables to buy them` }, {"font-size": "10px"}],
            ]
        },
        "Side": {
            content: [
                ["blank",24],
                ["display-text",
                    function() { return `You have <h2 style="color: rgb(145, 219, 86); text-shadow: rgb(145, 219, 86) 0px 0px 10px;">${format(player.g.points)}</h2> generator dust, generating ${format(layers.g.effect())} points each second` }],
                ["display-text",
                    function() { return `(+${format(layers.g.production())}/s)` }, {"font-size": "12px"}],
                "blank",
                ["buyables",[3,4]],
                "milestones",
            ],
            style: {'borderColor': '#7CBD4A'},
            unlocked() {return hasAchievement("a",11)},
            prestigeNotify(){
                return layers.g.buyables[31].canAfford() && !hasUpgrade("sa",22)
            },
        },
    },

    buyables: {
        11: {
            cost(x) {
                if(player.g.buyables[11].gte(1000)) return new Decimal(1.01).pow(x).mul(15).ceil()
                return new Decimal(10).mul(x.add(1).pow(1.4)).ceil()
            },
            effect(x) {
                let mult = new Decimal(1).div(4.6);
                if(hasUpgrade("s",11)) mult = mult.mul(tmp.s.upgrades[11].effect)
                if(hasUpgrade("s",12)) mult = mult.mul(tmp.s.upgrades[12].effect)
                if(hasUpgrade("s",13)) mult = mult.mul(tmp.s.upgrades[13].effect)
                if(hasUpgrade("s",23)) mult = mult.mul(tmp.s.upgrades[23].effect)
                if(player.t.unlocked) mult = mult.mul(layers.t.boost())

                let pow = new Decimal(1.2);
                if(inChallenge("d",12)) pow = pow.mul(tmp.d.challenges[12].nerf).div(1.2)
                if(hasUpgrade("na",13)) pow = pow.mul(tmp.na.upgrades[13].effect)
                
                return x.mul(2).pow(1.2).mul(mult).pow(pow)
            },

            maxbuys(x) {
                let buys = player.points.floor().div(10).pow(1/1.4).ceil()
                if(buys.gte(1000)){
                    return player.points.div(15).log(1.01).ceil().max(1000)
                }
                return buys
            },

            display() { return `<h2>Primary Generator x${formatWhole(getBuyableAmount("g",11))}</h2><br>Generates ${format(this.effect())} generator dust per second.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if(!hasMilestone("s",0)) player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.9).toNumber()/4;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),this.maxbuys()))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },
        },
        12: {
            cost(x) {
                if(player.g.buyables[12].gte(1000)) return new Decimal(1.014).pow(x).mul(22.5).ceil()
                return new Decimal(50).mul(x.add(1).pow(2)).ceil()
            },
            maxbuys(x) {
                let buys = player.points.floor().div(50).pow(1/2).ceil()
                if(buys.gte(1000)){
                    return player.points.div(22.5).log(1.014).ceil().max(1000)
                }
                return buys
            },

            effect(x) {
                let mult = new Decimal(1);
                if(hasUpgrade("s",11)) mult = mult.mul(tmp.s.upgrades[11].effect)
                if(hasUpgrade("s",12)) mult = mult.mul(tmp.s.upgrades[12].effect)
                if(hasUpgrade("s",13)) mult = mult.mul(tmp.s.upgrades[13].effect)
                if(hasUpgrade("s",23)) mult = mult.mul(tmp.s.upgrades[23].effect)

                let pow = new Decimal(1);
                if(hasUpgrade("na",23)) pow = pow.mul(tmp.na.upgrades[23].effect)
                if(inChallenge("d",12)) pow = pow.mul(tmp.d.challenges[12].nerf)
                
                return x.div(3).add(1).pow(0.8).sub(1).mul(mult).pow(pow).add(1)
            },
            display() { return `<h2>Primary Multiplier x${formatWhole(getBuyableAmount("g",12))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if(!hasMilestone("s",1)) player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.9).toNumber()/4;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),this.maxbuys()))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },
        },
        13: {
            cost(x) {
                if(hasMilestone(this.layer,2)) return new Decimal(1.5).pow(x).mul(10000).ceil()
                return new Decimal(2.5).pow(x).mul(1000).ceil()
            },
            maxbuys(x) {
                let buys = player.points.div(10000).log(2.5).ceil()
                if(hasMilestone(this.layer,2)) {
                    buys = player.points.div(1000).log(1.5).ceil()
                }
                return buys
            },

            effect(x) {
                let mult = new Decimal(1);
                if(hasUpgrade("s",11)) mult = mult.mul(tmp.s.upgrades[11].effect)
                if(hasUpgrade("s",12)) mult = mult.mul(tmp.s.upgrades[12].effect)
                if(hasUpgrade("s",13)) mult = mult.mul(tmp.s.upgrades[13].effect)
                if(hasUpgrade("s",23)) mult = mult.mul(tmp.s.upgrades[23].effect)

                if(inChallenge("d",12)) return x.add(1).pow(1.2).sub(1).mul(mult).add(1).pow(tmp.d.challenges[12].nerf)
                return x.add(1).pow(1.2).sub(1).mul(mult).add(1)
            },
            display() { return `<h2>Secondary Multiplier x${formatWhole(getBuyableAmount("g",13))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.9).toNumber()/4;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),tmp.g.buyables[this.id].maxbuys))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },

            unlocked() {
                return hasMilestone("g",0)
            }
        },
        21: {
            cost(x) {
                if(hasUpgrade("s",82)) return new Decimal(1.5).pow(x.pow(1.12)).mul(1e5).ceil()
                if(hasUpgrade("s",72)) return new Decimal(1.5).pow(x.pow(1.16)).mul(1e5).ceil()
                return new Decimal(2).pow(x.pow(1.2)).mul(1e6).ceil()
            },
            maxbuys(x) {
                if(hasUpgrade("s",82)) return player.points.div(1e5).log(1.5).pow(1/1.12).ceil()
                if(hasUpgrade("s",72)) return player.points.div(1e5).log(1.5).pow(1/1.16).ceil()
                return player.points.div(1e6).log(2).pow(1/1.2).ceil()
            },

            effect(x) {
                let power = getBuyableAmount(this.layer,this.id).div(50)

                if(power.gte(1)) power = power.pow(0.2)
                else power = power.pow(1.5)

                let mult = player.s.points.mul(new Decimal(player.g.time).pow(power)).add(0.5).max(1);
                
                if(getBuyableAmount(this.layer,this.id).eq(0)) return new Decimal(1)
                return mult
            },
            tooltip() {
                return "gets boosted by time since last row 2+ reset and slightly by total skill"
            },
            display() { return `<h2>Tertiary Time Multiplier x${formatWhole(getBuyableAmount("g",21))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.9).toNumber()/4;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                if(this.unlocked())
                    setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),tmp.g.buyables[this.id].maxbuys))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },

            unlocked() {
                return hasUpgrade("s",63)
            }
        },
        22: {
            cost(x) {
                return new Decimal(2).pow(x.pow(2)).mul(1e32).ceil()
            },
            maxbuys(x) {
                return player.points.div(1e32).log(2).pow(1/2).ceil()
            },

            effect(x) {
                return new Decimal(10).pow(getBuyableAmount(this.layer,this.id))
            },
            display() { return `<h2>Quaternary Multiplier x${formatWhole(getBuyableAmount("g",22))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.9).toNumber()/4;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                if(this.unlocked())
                    setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),tmp.g.buyables[this.id].maxbuys))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },

            unlocked() {
                return hasUpgrade("s",92)
            }
        },

        31: {
            cost(x) {
                if(hasUpgrade("s",93)) x = x.pow(upgradeEffect("s",93))

                let upgs = hasUpgrade("s",62) + hasUpgrade("s",32) + hasUpgrade("s",22)
                if(upgs >= 3) return new Decimal(10).pow((x.pow(2).div(7)).add(2.5)).div(2)
                if(upgs >= 2) return new Decimal(10).pow((x.mul(x.add(1)).div(6)).add(3))
                if(upgs >= 1) return new Decimal(10).pow((x.mul(x.add(1)).div(4)).add(3)).mul(5)
                return new Decimal(10).pow((x.mul(x.add(1)).div(2)).add(3)).mul(5)
            },
            bulk() {
                let bulk = new Decimal(0)
                
                let upgs = hasUpgrade("s",62) + hasUpgrade("s",32) + hasUpgrade("s",22)
                if(upgs >= 3) bulk = player.g.points.mul(2).log10().mul(7).sqrt()
                else if(upgs >= 2) bulk = player.g.points.log10().sub(3).mul(6).pow(2)
                else if(upgs >= 1) bulk = player.g.points.div(5).log10().sub(3).mul(4).pow(2)
                else bulk = player.g.points.div(5).log10().sub(3).mul(2).pow(2)
            
                if(hasUpgrade("s",93)) return bulk.pow(new Decimal(1).div(upgradeEffect("s",93))).ceil()
                return bulk.ceil();
            },
            effect(x) { 
                let eff = new Decimal(4).pow(x);
                if(inChallenge("d",21)) eff = eff.pow(tmp.d.challenges[21].nerf)
                return eff;
            },
            display() { return `<h2>Compact x${formatWhole(getBuyableAmount("g",31))}</h2><br>Resets Basic generators, generator dust, and points<br><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Requires ${formatWhole(this.cost())} generator dust` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy(amount) {
                if(!amount) amount = 1; else amount = amount.min(this.bulk().sub(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                if(hasUpgrade("sa",21)) return;

                player.points = new Decimal(10)
                player.g.points = new Decimal(0)
                player.g.buyables[11] = new Decimal(0)
            },
        },
        32: {
            cost(x) {
                let boost = new Decimal(1);
                if(hasUpgrade("s",91)) boost = boost.mul(0.5)

                let pow = new Decimal(1);
                if(hasUpgrade("na",11)) pow = pow.mul(upgradeEffect("na",11))
                if(hasUpgrade("na",21)) pow = pow.mul(upgradeEffect("na",21))
                if(hasUpgrade("na",22)) pow = pow.mul(upgradeEffect("na",22))

                let base = new Decimal(1.4)
                if(hasUpgrade("s",52)) base = new Decimal(1.25)
                if(hasUpgrade("s",61)) base = new Decimal(1.2)
                
                if(hasMilestone("t",11)) return base.sub(0.1).pow(x).mul(boost).pow(pow).ceil()
                
                if(hasUpgrade("s",61)) return base.pow(x).add(x.div(1.5)).add(2).mul(boost).pow(pow).ceil()
                if(hasUpgrade("s",52)) return base.pow(x).add(x.div(1.2)).add(2).floor().mul(boost).pow(pow).ceil()
                return base.pow(x).add(x).add(2).floor().mul(boost).pow(pow).ceil()
            },
            bulk() {
                let boost = new Decimal(1);
                if(hasUpgrade("s",91)) boost = boost.mul(0.5)

                let pow = new Decimal(1);
                if(hasUpgrade("na",11)) pow = pow.mul(upgradeEffect("na",11))
                if(hasUpgrade("na",21)) pow = pow.mul(upgradeEffect("na",21))
                if(hasUpgrade("na",22)) pow = pow.mul(upgradeEffect("na",22))

                let base = new Decimal(1.3)
                if(hasUpgrade("s",52)) base = new Decimal(1.15)
                if(hasUpgrade("s",61)) base = new Decimal(1.1)
                
                return new Decimal(player.g.buyables[31]).pow(new Decimal(1)/pow).div(boost).log(base).ceil()
            },

            effect(x) {
                let effect = new Decimal(10)
                if(hasUpgrade("s",51)) effect = effect.mul(3)
                if(inChallenge("d",21)) effect = effect.pow(tmp.d.challenges[21].nerf)
                return new Decimal(effect).pow(x)
            },
            display() { return `<h2>Compress x${formatWhole(getBuyableAmount("g",32))}</h2><br>Resets generator dust and points, and halves your compacts<br><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Requires ${formatWhole(this.cost())} compacts` },
            canAfford() { return player.g.buyables[31].gte(this.cost()) },
            buy(amount) {
                if(!amount) amount = 1; else amount = amount.min(this.bulk().sub(getBuyableAmount(this.layer, this.id)))

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(amount))
                if(hasUpgrade("sa",33)) return;

                player.points = new Decimal(10)
                player.g.points = new Decimal(0)
                player.g.buyables[31] = player.g.buyables[31].div(2).ceil()
            },
            unlocked(){ return hasUpgrade("s",42)}
        },
        41: {
            cost(x) {
                let boost = new Decimal(1)
                if(hasUpgrade("s",81)) boost = boost.mul(0.5)
                if(hasUpgrade("s",91)) boost = boost.mul(0.5)

                return new Decimal(1.5).pow(x).add(x).add(2).floor().mul(boost).ceil()
            },
            effect(x) {
                let effect = new Decimal(10)

                if(inChallenge("d",21)) effect = effect.pow(tmp.d.challenges[21].nerf)

                return new Decimal(effect).pow(x)
            },
            display() { return `<h2>Condense x${formatWhole(getBuyableAmount("g",41))}</h2><br>Resets generator dust and points, and halves your compacts & compresses<br><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Requires ${formatWhole(this.cost())} compresses` },
            canAfford() { return player.g.buyables[32].gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasUpgrade("sa",31)) return;

                player.points = new Decimal(10)
                player.g.points = new Decimal(0)
                player.g.buyables[31] = player.g.buyables[31].div(2).ceil()
                player.g.buyables[32] = player.g.buyables[32].div(2).ceil()
            },
            unlocked(){ return hasUpgrade("s",71)}
        },
    },
    milestones: {
        0: {
            requirementDescription: "Do 2 Compacts",
            effectDescription: "Unlock Secondary Multipliers",
            done() { return getBuyableAmount("g",31).gte(2)},
            unlocked() { return hasAchievement("a",13) || getBuyableAmount("g",31).gte(1)},
        },
        1: {
            requirementDescription: "Do 3 Compacts",
            effectDescription: "+0.2 Generator dust efficiency",
            tooltip: "Efficiency: how many points it produces<br>(dust<sup>0.7</sup> -> dust<sup>0.9</sup>)",
            done() { return getBuyableAmount("g",31).gte(3) },
            unlocked() { return hasAchievement("a",13)},
        },
        2: {
            requirementDescription: "Do 4 Compacts",
            effectDescription: "Secondary multiplier cost scaling is reduced<br>Unlock a new layer.",
            tooltip: "10,000(2.5^x) -> 1000(1.5^x)",
            done() { return getBuyableAmount("g",31).gte(4) },
            unlocked() { return hasAchievement("a",13)},
        },
        3: {
            requirementDescription: "Do 8 Compacts",
            effectDescription: "Unlock a new layer.",
            done() { return getBuyableAmount("g",31).gte(8) },
            unlocked() { return hasAchievement("a",14)},
        },
    },

    exp() {
        let exponent = new Decimal(0.7)
        if(hasMilestone(this.layer,1)) exponent = exponent.add(0.2)
        if(hasUpgrade("s",21)) exponent = exponent.add(0.2)
        if(player.t.unlocked) exponent = exponent.add(layers.t.buyables[12].effect())
        
        if(hasUpgrade("s",41)) exponent = exponent.add(0.5)
        if(inChallenge("d",22)) exponent = exponent.mul(tmp.d.challenges[22].nerf)
        
        return exponent;
    },
    effect() {
        let exponent = this.exp()

        return player.g.points.pow(exponent)
    },
    reduction() {
        return new Decimal(1)
    },


    production() {
        let gain = layers.g.buyables[11].effect()
        gain = gain.mul(layers.g.buyables[12].effect())
        gain = gain.mul(layers.g.buyables[13].effect())
        gain = gain.mul(layers.g.buyables[21].effect())
        gain = gain.mul(layers.g.buyables[22].effect())

        gain = gain.mul(layers.g.buyables[31].effect())
        gain = gain.mul(layers.g.buyables[32].effect())
        gain = gain.mul(layers.g.buyables[41].effect())
        gain = gain.div(this.reduction())

        gain = gain.mul(layers.a.effect())
        return gain
    },
    update(diff) {
        player.g.buys /= (5 ** diff)

        let gain = this.production()

        player.g.points = player.g.points.add(gain.mul(diff))

        let gameSpeed = new Decimal(1)
        if(hasUpgrade("s",33)) gameSpeed = gameSpeed.mul(upgradeEffect("s",33))
        if(hasUpgrade("s",43)) gameSpeed = gameSpeed.mul(upgradeEffect("s",43))
        if(hasUpgrade("s",53)) gameSpeed = gameSpeed.mul(upgradeEffect("s",53))
        if(hasUpgrade("s",73)) gameSpeed = gameSpeed.mul(upgradeEffect("s",73))
        if(hasUpgrade("s",83)) gameSpeed = gameSpeed.mul(upgradeEffect("s",83))
        if(hasUpgrade("t",12)) gameSpeed = gameSpeed.mul(upgradeEffect("t",12))
            
        if(hasUpgrade("s",34)) gameSpeed = gameSpeed.mul(upgradeEffect("s",34))
        if(hasUpgrade("s",44)) gameSpeed = gameSpeed.mul(upgradeEffect("s",44))
        player.g.time = player.g.time.add(gameSpeed.mul(diff))

        if(player.points.lte(0) && player.g.points.lte(0)) player.points = new Decimal(10)
    },
    
    automate() {
        if(hasUpgrade("sa",11)) layers.g.buyables[11].buyMax()
        if(hasUpgrade("sa",12)) layers.g.buyables[12].buyMax()
        if(hasUpgrade("sa",13) && layers.g.buyables[13].unlocked()) layers.g.buyables[13].buyMax()
        if(hasUpgrade("sa",14) && layers.g.buyables[21].unlocked()) layers.g.buyables[21].buyMax()
        if(hasUpgrade("sa",24) && layers.g.buyables[22].unlocked()) layers.g.buyables[22].buyMax()
        
        let bulk = 1
        if(hasUpgrade("sa",41)) bulk *= 3
        if(hasUpgrade("sa",42)) bulk *= 3
        if(hasUpgrade("sa",43)) bulk *= 77
        if(hasUpgrade("sa",22) && tmp.g.buyables[31].canAfford) layers.g.buyables[31].buy(new Decimal(bulk))
        
        if(hasUpgrade("sa",23) && tmp.g.buyables[32].canAfford && tmp.g.buyables[32].unlocked) {
            if(hasUpgrade("sa",44)) layers.g.buyables[32].buy(new Decimal(bulk))
            else layers.g.buyables[32].buy()
        }
        if(hasUpgrade("sa",32) && tmp.g.buyables[41].canAfford && tmp.g.buyables[41].unlocked) layers.g.buyables[41].buy()
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
        
        let milestones = player.g.milestones;

        layerDataReset(this.layer);
        if(hasMilestone("s",4)) player.g.buyables[11] = new Decimal(1)
        if(hasMilestone("s",8)) player.g.milestones = milestones;
    },
})

addLayer("s", {
    symbol: "Sk",
    color: "#58D699",
    row: 1,
    position: 0,

    layerShown(){return hasAchievement("a",14)},
    tooltip(){return `<h2>Skill</h2><br>${formatWhole(player.s.points.sub(player.s.used))}/${formatWhole(player.s.points)} skill`},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        used: new Decimal(0),
        best: new Decimal(0),
    }},
    branches: ["g"],

    type: "static",
    canBuyMax(){return hasMilestone("t",0)},
    resource: "skill",
    baseResource: "generator dust",
    baseAmount() {return player.g.points},

    requires: new Decimal(1e10), 
    exponent(){
        var exp = new Decimal(1.45)
        
        //if(player.s.points.gte(100)) exp = exp.add(new Decimal(0.01).mul(player.s.points.sub(99)))
        if(hasUpgrade("s",24)) exp = exp.mul(upgradeEffect("s",24))

        return exp.sub(tmp.d.challenges[11].reward)
    },
    base(){
        return new Decimal(10).sub(tmp.d.challenges[22].reward).sub(hasAchievement("a",15)*2)
    },
    gainMult() {
        if(player.d.activeChallenge) return new Decimal(0)
        
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    
    tabFormat: {
        "Skill Tree": {
            content: [
                ["blank",24],
                ["display-text",
                    function() { return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.s.points.sub(player.s.used))} / ${formatWhole(player.s.points)}</h2> skill` }],

                "blank",
                "prestige-button",
                ["display-text",
                    function() { return `Note: for any node with two branches; you only need one or the other to buy that upgrade.` }, {"fontSize": "12px"}],
                
                "blank",
                ["clickables",1],
                "upgrades",
            ]
        },
        Automation: {
            content: [
                ["microtabs","Automation"]
            ],
            prestigeNotify(){
                return tmp.sa.prestigeNotify;
            }
        },
    },
    microtabs: {
        Automation: {
            Upgrades: {
                embedLayer: "sa",
                buttonStyle: {"fontSize":"0.85em","borderColor":"#4DB080"},
            },
            Milestones: {
                content: [
                    ["blank",24],
                    ["clickables",[2]],
                    "blank",
                    ["display-text",
                        function() { return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.s.points.sub(player.s.used))} / ${formatWhole(player.s.points)}</h2> skill` }],
                    "blank",
                    "milestones"
                ],
                buttonStyle: {"fontSize":"0.85em","borderColor":"#4DB080"},
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 Skill",
            effectDescription: "Unlock a new skill tab",

            done() { return player.s.points.gte(1) },
            unlocked() {return true},
        },
        1: {
            requirementDescription: "3 Skill",
            effectDescription: "+1 automation point",

            done() { return player.s.points.gte(3) },
            unlocked() {return hasMilestone("s",0) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        2: {
            requirementDescription: "5 Skill",
            effectDescription: "+1 automation point",

            done() { return player.s.points.gte(5) },
            unlocked() {return hasMilestone("s",0) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        3: {
            requirementDescription: "10 Skill",
            effectDescription: "+1 automation point",

            done() { return player.s.points.gte(10) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        4: {
            requirementDescription: "12 Skill",
            effectDescription: "+1 automation point. Keep one compact on all row 2 resets",

            done() { return player.s.points.gte(12) },
            unlocked() {return hasMilestone("s",this.id-2)},
        },
        5: {
            requirementDescription: "13 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(13) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        6: {
            requirementDescription: "15 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(15) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        7: {
            requirementDescription: "17 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(17) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        8: {
            requirementDescription: "20 Skill",
            effectDescription: "+1 automation point; generator milestones are kept on row 2 resets",
            
            done() { return player.s.points.gte(20) },
            unlocked() {return hasMilestone("s",this.id-2)},
        },
        9: {
            requirementDescription: "25 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(25) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        10: {
            requirementDescription: "33 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(33) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        11: {
            requirementDescription: "60 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(60) },
            unlocked() {return hasMilestone("s",this.id-1) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        12: {
            requirementDescription: "70 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(70) },
            unlocked() {return hasMilestone("s",this.id-1) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        13: {
            requirementDescription: "3,000 Skill",
            effectDescription: "Wow! A huge skill gap!<br>+1 automation point",
            
            done() { return player.s.points.gte(2000) },
            unlocked() {return hasMilestone("s",this.id-1)},
        },
        14: {
            requirementDescription: "5,400 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(5400) },
            unlocked() {return hasMilestone("s",this.id-1)},
        },
    },

    clickables: {
        11: {
            display() {return "<h3>Respec</h3><br>Reset your skill points to reallocate them."},
            tooltip() {return "Resets <em>nothing</em><br>Hotkey: R (only usable in-tab)"},
            canClick() {return player.s.upgrades.length > 0 || player.s.used.gt(0)},
            onClick() {
                player.s.used = new Decimal(0)
                player.s.upgrades = []
            }
        },
        12: {
            display() {return "<h3>Buy all</h3><br>Buys as many upgrades as possible"},
            tooltip() {return "Buys left to right; top to bottom<br>Hotkey: M (only usable in-tab)"},
            canClick() {return player.s.points.gt(player.s.used)},
            onClick() {
                let upgs = [11,12,13,21,22,23,32,33,41,42,43,51,52,53,61,62,63,71,72,73,81,82,83,91,92,93]
                if(player.d.activeChallenge >= 31){
                    upgs = [11,12,21,22,23,32,33,41,42,43,51,52,61,62,63,71,72,73,81,82,83,91,92,93]
                }
                let j;

                for(var i=0;i<upgs.length;i++){
                    j = layers.s.upgrades[upgs[i]];
                    if(
                        (typeof j.unlocked == "function" ? j.unlocked() : j.unlocked) &&
                        layers.s.upgrades[upgs[i]].canAfford() &&
                        !player.s.upgrades.includes(upgs[i])
                    ){
                        layers.s.upgrades[upgs[i]].pay()
                        player.s.upgrades.push(upgs[i])
                    }
                }
                
            }
        },
        21: {
            display() {
                if(player.g.clickables[21]) return "Show non-unique milestones"
                return "Only show unique milestones"
            },
            canClick() {return true},
            onClick() {
                player.g.clickables[21] = !player.g.clickables[21]
            },
            style() {
                let styles = {
                    "min-height": "0px",
                    "padding": "15px 10px",
                    "font-size": "11px",
                    "borderRadius": "5px",
                    "width": "200px",
                }
                if(player.g.clickables[21]) styles["backgroundColor"] = "#9AEB57"
                else styles["backgroundColor"] = "#EB5778"
                return styles
            },
        },
    },

    upgrades: {
        11: {
            title: "A generic boost",
            description: "All generators are stronger based on total real time played.",
            tooltip(){
                return `((x+60)^^${format(new Decimal(0.3).add(tmp.d.challenges[21].reward))} -1)/3`
            },
            
            effect(){
                return new Decimal(player.timePlayed).add(60).tetrate(
                    new Decimal(0.3).add(tmp.d.challenges[21].reward)
                ).sub(1).div(3).max(1.5)
            },
            effectDisplay(){return "×" + format(this.effect(),3)},

            cost: new Decimal(1),

            canAfford() { return player.s.points.sub(player.s.used).gte(this.cost)},
            pay() { player.s.used = player.s.used.add(this.cost)},
        },
        21: {
            title: "A generic power",
            description: "Buff generator dust efficiency by +0.2",
            tooltip: "Efficiency: how many points they produce. x<sup>0.7</sup> to x<sup>0.9</sup>",
            cost: new Decimal(1),
            branches: ["11"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        22: {
            title: "Compact+",
            description: "Compact scaling is better",
            cost: new Decimal(1),
            branches: ["11"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        31: {style: {"visibility": "hidden"},canAfford(){return false}},
        32: {
            title: "Compact++",
            description: "Compact scaling is better",
            cost: new Decimal(1),
            branches: ["22"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        41: {
            title: "Power Surge",
            description: "+0.5 generator dust efficiency",
            cost: new Decimal(1),
            branches: ["21","32"],

            canAfford() {
                if(!player.s.points.sub(player.s.used).gte(this.cost)) return false
                for(var i=0;i<this.branches.length;i++){ if(hasUpgrade(this.layer,this.branches[i])) return true}
                return false
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        42: {
            title: "New compact methods",
            description: "Unlock Compression",
            cost: new Decimal(1),
            branches(){if(!hasAchievement("a",21)) return [32]},

            canAfford() {
                if(hasAchievement("a",21)) return player.s.points.sub(player.s.used).gte(this.cost)
                return hasUpgrade(this.layer, 32) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        51: {
            title: "Compress Power",
            description: "Compress strength is tripled",
            tooltip() {return "10^x => 30^x"},
            cost: new Decimal(1),
            branches: ["42"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        52: {
            title: "Compress Slowdown",
            description: "Slightly reduce the scaling of compresses",
            cost: new Decimal(1),
            branches: ["42"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        61: {
            title: "Compress Slowdown II",
            description: "Reduce the scaling of compresses",
            cost: new Decimal(1),
            branches: ["52"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        62: {
            title: "Compact Slowdown",
            description: "Reduce the scaling of compacting",
            cost: new Decimal(1),
            branches: ["52"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        71: {
            title: "More!!",
            description: "Unlock Condensing",
            cost: new Decimal(2),
            branches: ["61","62"],

            canAfford() {
                if(!player.s.points.sub(player.s.used).gte(this.cost)) return false
                for(var i=0;i<this.branches.length;i++)
                    if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },

        81: {
            title: "Squishable",
            description: "Condenses require 50% less compresses (rounded up)",
            cost: new Decimal(1),
            branches: ["71"],

            unlocked() {return player.d.challenges[12] >= 1},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        63: {
            title: "Clockwork",
            description: "Unlock Time Multipliers",
            cost: new Decimal(2),
            branches: ["52"],

            unlocked() {return player.d.challenges[12] >= 1},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        72: {
            title: "Clockwork II",
            description: "Time multiplier cost scaling is heavily nerfed",
            tooltip: "1e6*2^(x^1.2) => 1e5*1.5^(x^1.16)",
            cost: new Decimal(1),
            branches: ["63"],

            
            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        82: {
            title: "Clockwork III",
            description: "Time multiplier cost scaling is heavily nerfed",
            tooltip: "1e5*1.5^(x^1.16) => 1e5*1.5^(x^1.12)",
            cost: new Decimal(2),
            branches: ["72"],

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        91: {
            title: "Squishability+",
            description: "Condense and Compress requirements are nerfed by 50%",
            cost: new Decimal(2),
            branches: ["81","82"],

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        23: {
            title: "A more basic boost",
            description: "All generators are stronger based on time since last row 2 reset.",
            tooltip: "(x^^0.6)<sup>1.25</sup>",

            effect(){
                return new Decimal(player.g.time).tetrate(
                    new Decimal(0.6)
                ).pow(1.25).max(1)
            },
            effectDisplay(){return "×" + format(this.effect(),3)},

            cost: new Decimal(1),

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        33: {
            title: "Time Warp",
            description: "Speed up time since last row 2 reset based on total skill points",
            tooltip: "(boosts A more basic boost and Tertiary Time Generators)<br>formula: skill/2",

            effect(){
                return player.s.total.div(2)
            },
            effectDisplay(){return "×" + format(this.effect(),1)},

            cost: new Decimal(1),

            branches: ["23"],

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        43: {
            title: "Time Warp II",
            description: "Speed up time since last row 2 reset based on time since last row 2 reset",
            tooltip: "(Time Warp upgrades boost this)",

            effect(){
                let exponent = new Decimal(1)
                if(hasAchievement("a",43)) exponent = exponent.mul(1.25)
                if(hasChallenge("d",32)) exponent = exponent.mul(layers.d.challenges[32].reward())
                return new Decimal(player.g.time).pow(0.3).add(1).pow(exponent)
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),

            branches: ["33"],

            unlocked() {return player.d.challenges[12] >= 3},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        53: {
            title: "Time Warp III",
            description: "Speeds up time based on tears",
            tooltip: "2(d<sup>2</sup>)",

            effect(){
                return new Decimal(2).mul(player.d.points.pow(2))
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),

            branches: ["43"],

            unlocked() {return player.d.challenges[12] >= 3},
            style(){
                if(this.effect().lte(1) && hasUpgrade("s",this.id)) return {"backgroundColor":"#CC4E6A"}
                if(this.effect().lte(1) && this.canAfford()) return {"backgroundColor":"#996E78"}
            },

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        12: {
            title: "A generic-er boost",
            description: "Boosts generators based on skill points",
            tooltip: "skill<sup>0.7</sup>",

            effect(){
                return player.s.points.pow(0.7)
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),


            unlocked() {return player.d.challenges[12] >= 4},

            canAfford() {
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        13: {
            title: "A generic-er-er boost",
            description: "Boosts generators based on tears",
            tooltip: "3t<sup>0.9</sup>",

            effect(){
                return player.d.points.pow(0.9).mul(3)
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),


            unlocked() {return player.d.challenges[12] >= 4},
            style(){
                if(this.effect().lte(1) && hasUpgrade("s",this.id)) return {"backgroundColor":"#CC4E6A"}
                if(this.effect().lte(1) && this.canAfford()) return {"backgroundColor":"#996E78"}
            },

            canAfford() {
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        92: {
            title: "Expensive Upgrade",
            description: "Unlock Quaternary Multipliers",
            cost: new Decimal(10),
            branches: ["82"],

            unlocked() {return player.d.challenges[12] >= 4},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        73: {
            title: "Time Warp IV",
            description: "Speeds up time based on Compacts",
            tooltip: "(2x)<sup>0.5</sup> +3",

            effect(){
                return new Decimal(player.g.buyables[31]).mul(2).pow(0.5).add(3)
            },
            effectDisplay(){return "×" + format(this.effect())},

            cost: new Decimal(1),

            unlocked() {return player.d.challenges[12] >= 5},

            branches: [63],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        83: {
            title: "Time Warp V",
            description: "Speeds up time based on Compresses",
            tooltip: "(3x)<sup>0.8</sup>+3",

            effect(){
                return new Decimal(player.g.buyables[32]).mul(3).pow(0.8).add(3)
            },
            effectDisplay(){return "×" + format(this.effect())},

            cost: new Decimal(4),

            unlocked() {return player.d.challenges[12] >= 5},

            branches: [73],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        93: {
            title: "Huge Power bump",
            description: "Compact scaling price is decreased.",
            tooltip: "Scaling acts like there's ^0.85 compacts than there actually is",

            effect(){
                return new Decimal(0.85)
            },
            effectDisplay(){return "^" + format(this.effect())},

            cost: new Decimal(20),

            unlocked() {return player.d.challenges[12] >= 5},

            branches: [82],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        
        14: {
            title: "Skillful Tears",
            description: "Tear requirement is decreased based on skill points",

            cost: new Decimal(100),
            effect(){
                return new Decimal(1).div(player.s.points.sub(6).max(0).div(16).add(1).log10().div(20).add(1).max(1).min(1.2))
            },
            effectDisplay(){
                return "^" + format(this.effect(),3)
            },

            unlocked() {return hasMilestone("t",4)},

            branches: [13],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        24: {
            title: "Sad Skill",
            description: "Skill requirement is decreased based on tears",
            effect(){
                return new Decimal(1).div(player.d.points.sub(6).max(0).div(4).add(1).log10().div(20).add(1).max(1).min(1.2))
            },
            effectDisplay(){
                return "^" + format(this.effect(),3)
            },

            cost: new Decimal(100),

            unlocked() {return hasMilestone("t",4)},

            branches: [13],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        34: {
            title: "Tear Warp",
            description: "Speed up time based on tears",
            effect(){
                return new Decimal(10).pow(player.d.points.pow(0.7))
            },
            effectDisplay(){
                return "x" + format(this.effect(),3)
            },

            cost: new Decimal(100),

            unlocked() {return hasMilestone("t",4)},

            branches: [33],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        44: {
            title: "Skill Warp",
            description: "Speed up time based on skill points",
            effect(){
                return new Decimal(5).pow(player.s.points.div(2).pow(0.5).div(2))
            },
            effectDisplay(){
                return "x" + format(this.effect(),3)
            },

            cost: new Decimal(100),

            unlocked() {return hasMilestone("t",4)},

            branches: [33],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        54: {
            title: "Tree Warp",
            description: "Trees boost time based on skill points",
            effect(){
                return new Decimal(10).pow(player.t.points.pow(0.8))
            },
            effectDisplay(){
                return "x" + format(this.effect(),3)
            },

            cost: new Decimal(100),

            unlocked() {return hasMilestone("t",4)},

            branches: [33],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
    },

    hotkeys: [
        {key: "m", description: "M: Buys max skill upgrades (only usable in S-tab)", onPress(){if (player.tab === "s" && tmp.s.clickables[12].canClick) tmp.s.clickables[12].onClick()}},
        {key: "r", description: "R: Respecs skill upgrades (only usable in S-tab)", onPress(){if (player.tab === "s" && tmp.s.clickables[11].canClick) tmp.s.clickables[11].onClick()}},
        {key: "s", description: "S: Skill reset", onPress(){if (tmp.s.canReset) doReset("s")}},
    ],

    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;

        let mile = player.s.milestones
        let upgs = player.sa.upgrades
        let used = player.sa.used

        layerDataReset(this.layer);
        layerDataReset("sa");

        if(hasMilestone("t",0)) player.s.milestones = [0,1,2,3,4]
        if(hasMilestone("t",2)) {
            player.s.milestones = mile;
            player.sa.upgrades = upgs;
            player.sa.used = used;
        }
    },
})
addLayer("sa", {
    color: "#58D699",

    layerShown(){return false},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        used: new Decimal(0),
    }},

    tabFormat: [
        ["blank",24],
        ["display-text",
            function() { return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.s.points.sub(player.s.used))} / ${formatWhole(player.s.points)}</h2> skill` }],
        ["blank",2],
        ["display-text",
            function() {
                let req = layers.s.milestones[player.s.milestones.length];
                if(req) req = req.requirementDescription
                else req = "Infinity Skill"
                return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.sa.points.sub(player.sa.used))} / ${formatWhole(player.sa.points)}</h2> automation points (+1 at ${req})`
            }],
        //[1,2,6,9,12,13,15,18,20,26]
        "blank",
        "clickables",
        "upgrades",
    ],
    prestigeNotify(){return player.sa.points.sub(player.sa.used).gte(1)},

    clickables: {
        11: {
            display() {return "Respec<br><br>Reset your automation points to reallocate them."},
            canClick() {return player.sa.upgrades.length > 0 || player.sa.used.gt(0)},
            onClick() {
                player.sa.used = new Decimal(0)
                player.sa.upgrades = []
            }
        },
    },

    upgrades: {
        11: {
            fullDisplay: "<h2>Primary Generator</h2><br>automate primary generator purchasing & they no longer take away points",

            cost: new Decimal(1),

            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost)},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        12: {
            fullDisplay: "<h2>Primary Multiplier</h2><br>automate primary multipliers purchasing & they no longer take away points",

            branches: [11],
            cost: new Decimal(1),

            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        13: {
            fullDisplay: "<h2>Secondary Multiplier</h2><br>automate secondary multipliers purchasing & they no longer take away points",

            branches: [12],
            cost: new Decimal(1),

            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        14: {
            fullDisplay: "<h2>Time Multiplier</h2><br>automate tertiary time multipliers purchasing & they no longer take away points",

            branches: [13],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4) && player.d.challenges[12] >= 1},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        21: {
            fullDisplay: "<h2>Compact II</h2><br>compacting resets nothing",

            branches: [22],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(5)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        22: {
            fullDisplay: "<h2>Compact</h2><br>automate compacts",

            branches: [12],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        23: {
            fullDisplay: "<h2>Compress</h2><br>automate compressing",

            branches: [22],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        24: {
            fullDisplay: "<h2>Quaternary Multi</h2><br>automate quaternary multipliers purchasing & they no longer take away points",

            branches: [14],
            cost: new Decimal(1),

            unlocked() {return player.d.challenges[12] >= 4},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        31: {
            fullDisplay: "<h2>Condense II</h2><br>condensing resets nothing",

            branches: [32],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(5)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        32: {
            fullDisplay: "<h2>Condense</h2><br>automate condensing",

            branches: [23],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        33: {
            fullDisplay: "<h2>Compress II</h2><br>compressing resets nothing",

            branches: [23],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(5)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        41: {
            fullDisplay: "<h2>Compact III</h2><br>triple compact bulk",
            tooltip: "(it resets 3x as fast)",

            branches: [31],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(11)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        42: {
            fullDisplay: "<h2>Compact IV</h2><br>triple compact bulk again",
            tooltip: "(it resets 3x as fast)",

            branches: [41],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(11)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        43: {
            fullDisplay: "<h2>Compact IV</h2><br>x77 Compact bulk",

            branches: [42],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(14)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        44: {
            fullDisplay: "<h2>Compress III</h2><br>Compress has the same bulk as Compacts",

            branches: [43],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(15)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
    },
    update() {
        player.sa.points = new Decimal(player.s.milestones.length);
    }
})

addLayer("d", {
    symbol: "De",
    color: "#5373DB",
    row: 1,
    position: 1,

    layerShown(){return hasAchievement("a",21)},
    tooltip(){return `<h2>Depression</h2><br>${formatWhole(player.d.points)} tears`},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
    }},
    branches: ["g"],

    type: "static",
    resource: "tears",
    baseResource: "primary generators",
    baseAmount() {return player.g.buyables[11]},

    requires: new Decimal(13500), 
    canBuyMax(){return hasMilestone("t",12)},

    exponent(){
        let exponent = new Decimal(1.1);
        if(player.d.points.gte(4)) exponent = new Decimal(1.4)

        if(hasAchievement("a",42)) exponent = exponent.sub(0.1);
        if(hasAchievement("a",53)) exponent = exponent.sub(0.1);
        if(hasUpgrade("s",14)) exponent = exponent.mul(upgradeEffect("s",14))
        return exponent
    },
    base(){
        if(hasAchievement("a",54)) return new Decimal(1.125)
        if(hasAchievement("a",53)) return new Decimal(1.14)
        if(hasMilestone("t",4)) return new Decimal(1.2)
        return new Decimal(1.3)
    },
    gainMult() {
        if(player.d.activeChallenge >= 31) return new Decimal(0)
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    tabFormat: {
        "Depression": {
            content: [
                ["blank",24],
                ["infobox","intro"],
                ["blank",12],
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return `Entering Depression causes a skill reset.` }, {"font-size": "12px"}],
                ["display-text",
                    function() { if(player.d.points.gte(1)) return `Ring I Depression [${player.d.points.min(4)}/4]` }, {"font-size": "18px"}],

                "blank",
                ["challenges",[1,2]],
                "blank",
                "blank",
                "blank",

                ["display-text",
                    function() { if(player.d.best.gte(5)) return `Ring II Depression [${player.d.points.sub(4).min(2)}/2]` }, {"font-size": "18px"}],
                "blank",
                ["challenges",[3,4]],
            ]
        },
    },

    infoboxes: {
        intro: {
            title: "Depression Introduction",
            body() { return `
                welcome to depression! you unlock a depression for each of the first 6 tears.<br><br>
                skill respec resets absolutely nothing (except for skill upgrades):<br><br>
                any mechanic that gets locked will still have it's boost active<br>
                any resource gained from upgrades will still stay<br><br>
                most of these will require atleast one or two respecs<br><br>
                a tip: having all 3 of the compact scaling decreases at once is really strong and usually will give you huge generator dust multipliers` },
        },
    },

    challenges: {
        11: {
            name() {return `Baseline (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Reduce skill requirement (-^0.05)",
            goal(){
                let req = new Decimal(1e20)
                req = req.mul(new Decimal(1e5).pow(new Decimal(2).pow(player.d.challenges[this.id])))
                if(player.d.challenges[11] >= 3) req = req.div(1e5)
                if(player.d.challenges[11] === 4) req = req.mul(1e5)
                return req;
            },
            canComplete: function() {
                return player.g.points.gte(this.goal())
            },
            reward() {
                return new Decimal(0.05).mul(player.d.challenges[this.id])
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(1)},
            completionLimit: 5,
        },
        12: {
            name() {return `Supersqrt (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}<br>Nerf all G-layer generators by ^^${format(this.nerf())}`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Unlock new skill upgrades (each completion)",
            goal() {
                let req = new Decimal(1e25)
                req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))

                if(player.d.challenges[this.id] === 1) req = req.div(1e5)
                if(player.d.challenges[this.id] >= 3) req = req.mul(1e5)
                if(player.d.challenges[this.id] >= 4) req = req.mul(1e10)

                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            nerf() {
                return new Decimal(0.65).div(new Decimal(1.2).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(2)},
            completionLimit: 5,
        },
        21: {
            name() {return `Prestige Nerf (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}<br>Nerf all compact/compress/condense by ^${format(this.nerf())}`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "S11: 'A generic Boost' is stronger",
            goal() {
                let req = new Decimal(1e25)
                req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal([0,0.15,0.22,0.3,0.4,0.4,0.4][player.d.challenges[this.id]])
            },
            nerf() {
                return new Decimal(0.5).div(new Decimal(1.5).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(3)},
            completionLimit: 5,
        },
        22: {
            name() {return `Point Drought (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}<br>Generator Dust efficiency is nerfed by ${format(this.nerf().mul(100))}%`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Reduce the skill point requirement formula",
            goal() {
                let req = new Decimal(1e40)
                req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                if(player.d.challenges[this.id] === 0) req = req.mul(1e5)
                if(player.d.challenges[this.id] >= 3) req = req.mul(1e5)
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal(player.d.challenges[this.id]).pow(0.5)
            },
            nerf() {
                return new Decimal(0.1).div(new Decimal(5).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(4)},
            completionLimit: 5,
        },
        31: {
            name() {return `Baseline 2: ${romanNumeral(player.d.challenges[this.id])}`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id]*2 + 6}<br>Lose all depression`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Unlock a new layer per completion",
            goal() {
                let req = new Decimal(["1e100","1e800","Infinity"][player.d.challenges[this.id]])
                //req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal(player.d.challenges[this.id]).mul(3).pow(0.65)
            },
            nerf() {
                return new Decimal(0.1).div(new Decimal(5).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id]*2 + 6).floor()
                player.d.points = new Decimal(0)
            },
            onExit(){
                player.s.points = player.s.best
                player.d.points = player.d.best
            },
            unlocked(){return player.d.points.gte(5) || inChallenge("d",31)},
            completionLimit: 2,
        },
        32: {
            name() {return `Skill issue: ${romanNumeral(player.d.challenges[this.id])}`},
            challengeDescription() {return `Start with ${formatWhole(this.nerf())} skill.<br>Lose all depression`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription(){
                return `Boost timewarp II by ^${this.reward()}`
            },
            goal() {
                let req = new Decimal(["1e65","1e90","1e90","1e90"][player.d.challenges[this.id]])
                //req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal(player.d.challenges[this.id]).div(3).add(1)
            },
            nerf() {
                return new Decimal(6).sub(player.d.challenges[32] *2)
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = this.nerf().floor()
                player.d.points = new Decimal(0)
            },
            onExit(){
                player.s.points = player.s.best
                player.d.points = player.d.best
            },
            unlocked(){return player.d.points.gte(6) || inChallenge("d",32)},
            completionLimit: 3,
        },
    },

    automate(){
        if(player.d.qol && hasMilestone("t",0)){
            let active = player.d.activeChallenge;
            if(!active) return;
            if(layers.d.challenges[active].canComplete()){
                if(player.d.challenges[active] < layers.d.challenges[active].completionLimit) {
                    player.d.challenges[active] ++;
                    
                    if(player.d.challenges[active] >= layers.d.challenges[active].completionLimit-1){
                        doReset("d",true)
                        layers.d.challenges[active].onExit()
                        activeChallenge = undefined;
                    } else {
                        doReset("d",true)
                        player.d.activeChallenge = active;
                        layers.d.challenges[active].onEnter()
                        player.d.challenges[active] ++;
                    }
                }
            }
        }
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;

        let baselinetwo = player.d.challenges[31];

        layerDataReset(this.layer);

        player.d.challenges[31] = baselinetwo;
        if(hasMilestone("t",1)) {player.d.challenges[11] = 5; player.d.points = new Decimal(1)}
        if(hasMilestone("t",5)) {player.d.challenges[12] = 5; player.d.challenges[21] = 5; player.d.challenges[22] = 5; player.d.points = new Decimal(4)}
        if(hasAchievement("a",61)) {player.d.challenges[32] = 3; player.d.points = new Decimal(6)}
    },
})

addLayer("t", {
    symbol: "Tr",
    color: "#5DD115",
    row: 2,
    position: 0,

    layerShown(){return hasAchievement("a",43)},
    tooltip(){return `<h2>Trees</h2><br>${formatWhole(player.t.points)} trees<br>${formatWhole(player.t.leaves)} leaves`},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        leaves: new Decimal(0),
        masterytime: 0,
    }},
    branches: ["s"],

    type: "static",
    canBuyMax(){return true},
    resource: "trees",
    baseResource: "compacts",
    baseAmount() {return player.g.buyables[31]},

    requires: new Decimal(70), 
    roundUpCost: true,
    exponent(){
        if(hasUpgrade("na",33)) return 1.0
        if(hasMilestone("t",11)) return 1.05
        if(hasMilestone("t",6)) return 1.1
        return 1.2
    },
    base(){
        return 1.075
    },
    gainMult() {
        mult = new Decimal(1)
        if(player.t.points.gte(45)) return new Decimal(0) // incase something breaks or smth
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    tabFormat: {
        "Main": {
            content: [
                ["blank",24],
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
        "Leaves": {
            content: [
                ["blank",24],
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function() { return `You have ${format(player.t.leaves)} leaves (+${format(tmp.t.production)}/s)` }],
                ["display-text", function() { return `x${format(layers.t.boost())} generator dust` }, {"fontSize": "0.8em"}],
                ["display-text", function() { return `The leaf boost is based on generator efficiency.` }, {"fontSize": "0.8em"}],
                "blank",
                "buyables",
                "upgrades",
            ],
            unlocked(){
                return hasMilestone("t",0)
            },
        },
    },

    buyables: {
        11: {
            effect(x) {
                if(hasUpgrade("t",22)) return new Decimal(2).pow(new Decimal(x).add(1).pow(0.7))
                return new Decimal(x).div(3).add(1).pow(1.5)
            },
            cost(x) {
                if(hasUpgrade("t",13)) return new Decimal(2).pow(x.div(1.25)).mul(2)
                return new Decimal(4).pow(x).mul(5)
            },
            display() { return `<h2>Basic Leaf Boost</h2><br>Boosts leaf gain by x${format(this.effect())}<br>Costs ${format(this.cost())} leaves` },
            canAfford() { return player[this.layer].leaves.gte(this.cost()) },
            buy() {
                player[this.layer].leaves = player[this.layer].leaves.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            effect(x) {
                if(hasMilestone("t",9)) return new Decimal(x).pow(0.7).div(6)
                return new Decimal(x).pow(0.6).div(4)
            },
            cost(x) { return new Decimal(2).pow(x).mul(10) },
            display() { return `<h2>Efficiency Overclock</h2><br>Boost generator efficiency by +${format(this.effect())}<br>Costs ${format(this.cost())} leaves` },
            canAfford() { return player[this.layer].leaves.gte(this.cost()) },
            buy() {
                player[this.layer].leaves = player[this.layer].leaves.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        13: {
            effect(x) {
                if(hasMilestone("t",8)) return new Decimal(x).pow(0.99).div(1.5).add(1) //the pow(0.99) is just so the number looks less perfect :P
                return new Decimal(x).pow(0.8).div(1.5).add(1)
            },
            cost(x) {
                return new Decimal(10).pow(x).mul(100)
            },
            display() { return `<h2>Upgrade Booster</h2><br>Boost the first two leaf upgrades by ^${format(this.effect())}<br>Costs ${format(this.cost())} leaves` },
            canAfford() { return player[this.layer].leaves.gte(this.cost()) },
            buy() {
                player[this.layer].leaves = player[this.layer].leaves.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){
                return hasMilestone("t",2)
            },
        },
    },
    /*resetbuyablereset: function(){
        player.t.leaves = new Decimal(0)
        player.t.buyables[11] = new Decimal(0);
        player.t.buyables[12] = new Decimal(0);
    },*/
    upgrades: {
        11: {
            fullDisplay(){
                return `<h2>[11] Leaf Markup</h2><br>Requires 250 leaves<br><br>Boosts leaves gain by x${formatWhole(this.effect())}`
            },
            effect(){return new Decimal(1.5).pow(layers.t.buyables[13].effect())},
            tooltip(){return "Resets the first two leaf buyables"},
            canAfford(){return player.t.leaves.gte(250)},
            pay(){
                player.t.leaves = new Decimal(0)
                player.t.buyables[11] = new Decimal(0);
                player.t.buyables[12] = new Decimal(0);
            },
            unlocked(){
                return hasMilestone("t",1)
            },
            style: {"width": "130px","height": "130px"}
        },
        12: {
            fullDisplay(){
                return `<h2>[12] Time Markup</h2><br>Requires 300 leaves<br><br>Time since last row 2 reset is ${formatWhole(this.effect())}x'd`
            },
            effect(){return new Decimal(1000).pow(layers.t.buyables[13].effect())},
            tooltip(){return "Resets the first two leaf buyables"},
            canAfford(){return player.t.leaves.gte(300)},
            pay(){
                player.t.leaves = new Decimal(0)
                player.t.buyables[11] = new Decimal(0);
                player.t.buyables[12] = new Decimal(0);
            },
            unlocked(){
                return hasMilestone("t",1)
            },
            style: {"width": "130px","height": "130px"}
        },
        13: {
            fullDisplay(){
                return `<h2>[13] Scale loss</h2><br>Requires 600 leaves<br><br>Reduce 'basic leaf boost's cost scaling very significantly`
            },
            effect(){return new Decimal(600)},
            tooltip(){return "Resets the first two leaf buyables"},
            canAfford(){return player.t.leaves.gte(600)},
            pay(){
                player.t.leaves = new Decimal(0)
                player.t.buyables[11] = new Decimal(0);
                player.t.buyables[12] = new Decimal(0);
            },
            unlocked(){
                return hasMilestone("t",1)
            },
            style: {"width": "130px","height": "130px"}
        },
        21: {
            fullDisplay(){
                return `<h2>[21] Scale loss</h2><br>Requires 6,000 leaves<br><br>Skill boosts leaf production: x${format(this.effect())}`
            },
            effect(){return player.s.points.div(5).pow(0.4).mul(2).add(1)},
            tooltip(){return "Resets the first two leaf buyables"},
            canAfford(){return player.t.leaves.gte(6000)},
            pay(){
                player.t.leaves = new Decimal(0)
                player.t.buyables[11] = new Decimal(0);
                player.t.buyables[12] = new Decimal(0);
            },
            unlocked(){
                return hasMilestone("t",1)
            },
            style: {"width": "130px","height": "130px"}
        },
        22: {
            fullDisplay(){
                return `<h2>[22] Booster+</h2><br>Requires 1e12 leaves<br><br>'Leaf Boost' is stronger`
            },
            tooltip(){return "Resets the first two leaf buyables"},
            canAfford(){return player.t.leaves.gte(1e12)},
            pay(){
                player.t.leaves = new Decimal(0)
                player.t.buyables[11] = new Decimal(0);
                player.t.buyables[12] = new Decimal(0);
            },
            unlocked(){
                return hasMilestone("t",1)
            },
            style: {"width": "130px","height": "130px"}
        },
        23: {
            fullDisplay(){
                return `<h2>[23] Tree Power</h2><br>Requires 300,000 leaves<br><br>Each tree boosts leaf production more (2x per tree)`
            },
            tooltip(){return "Resets the first two leaf buyables"},
            canAfford(){return player.t.leaves.gte(300000)},
            pay(){
                player.t.leaves = new Decimal(0)
                player.t.buyables[11] = new Decimal(0);
                player.t.buyables[12] = new Decimal(0);
            },
            unlocked(){
                return hasMilestone("t",1)
            },
            style: {"width": "130px","height": "130px"}
        },
    },
    challenges: {11: {}},

    milestones: {
        0: {
            requirementDescription: "1 Tree",
            effectDescription: "Unlock a new tree tab and keep the first 5 skill milestones<br>You can buy skill in bulk<br>When you complete the requirement for a depression milestone, complete it and re-enter it. (toggleable)",

            toggles: [["d","qol"]],
            done() { return player.t.points.gte(1) },
            unlocked() {return true},
        },
        1: {
            requirementDescription: "2 Trees",
            effectDescription: "Keep the first five 'Baseline' completions<br>Unlock 5 new upgrades",

            done() { return player.t.points.gte(2) },
            unlocked() {return hasMilestone("t", 0)},
        },
        2: {
            requirementDescription: "3 Trees",
            effectDescription: "Unlock a new buyable<br>Keep all skill-layer automation milestones on reset",

            done() { return player.t.points.gte(3) },
            unlocked() {return hasMilestone("t", 0)},
        },
        3: {
            requirementDescription: "4 Trees",
            effectDescription: "Keep all skill-layer automation milestones on reset",

            done() { return player.t.points.gte(4) },
            unlocked() {return hasMilestone("t", 0)},
        },
        4: {
            requirementDescription: "6 Trees",
            effectDescription: "Tear cost scaling is reduced. Unlock 3 VERY expensive skill upgrades",

            done() { return player.t.points.gte(6) },
            unlocked() {return hasMilestone("t", 0)},
        },
        5: {
            requirementDescription: "8 Trees",
            effectDescription: "Trees produce even more leaves (+x5 per tree after this milestone). Keep all first 4 depression on reset.",

            done() { return player.t.points.gte(8) },
            unlocked() {return hasMilestone("t", 0)},
        },
        6: {
            requirementDescription: "11 Trees",
            effectDescription: "Tree cost scaling is reduced",

            done() { return player.t.points.gte(11) },
            unlocked() {return hasMilestone("t", 0)},
        },
        7: {
            requirementDescription: "14 Trees",
            effectDescription: "Trees produce even more leaves (+x15 per tree after this milestone).",

            done() { return player.t.points.gte(14) },
            unlocked() {return hasMilestone("t", 0)},
        },
        8: {
            requirementDescription: "16 Trees",
            effectDescription: "Upgrade booster effect scaling is stronger.",

            done() { return player.t.points.gte(16) },
            unlocked() {return hasMilestone("t", 0)},
        },
        9: {
            requirementDescription: "18 Trees",
            effectDescription: "Efficiency Overclock effect scaling is stronger.",

            done() { return player.t.points.gte(18) },
            unlocked() {return hasMilestone("t", 0)},
        },
        10: {
            requirementDescription: "20 Trees",
            effectDescription: "Trees produce even more leaves (instant 100x; +x15 per tree after this milestone).<br>Unlock new salt upgrades.",

            done() { return player.t.points.gte(20) },
            unlocked() {return hasMilestone("t", 0)},
        },
        11: {
            requirementDescription: "24 Trees",
            effectDescription: "Compression formula is reduced hard.<br>Tree cost scaling is reduced yet again.",

            done() { return player.t.points.gte(24) },
            unlocked() {return hasMilestone("t", 0)},
        },
        12: {
            requirementDescription: "30 Trees",
            effectDescription: "You can buy max tears.",

            done() { return player.t.points.gte(30) },
            unlocked() {return hasAchievement("a",63)},
        },
    },

    automation(){
        //if(player.s.auto && hasMilestone("t",0)) doReset("s")
    },
    production(){
        let boost = new Decimal(4).pow(player.t.points).div(4)
        if(hasUpgrade("t",23)) boost = new Decimal(8).pow(player.t.points).div(8)

        if(hasMilestone("t",5)) boost = new Decimal(5).pow(player.t.points.sub(7).max(0)).mul(boost)
        if(hasMilestone("t",7)) boost = new Decimal(15).pow(player.t.points.sub(14).max(0)).mul(boost)
        if(hasMilestone("t",10)) boost = new Decimal(15).pow(player.t.points.sub(20).max(0)).mul(boost).mul(100)

        if(player.t.points.lte(0)) return new Decimal(0);
        boost = boost.mul(layers.t.buyables[11].effect())
        if(hasUpgrade("t",11)) boost = boost.mul(upgradeEffect("t",11))
        if(hasUpgrade("t",21)) boost = boost.mul(upgradeEffect("t",21))
            
        if(hasUpgrade("na",12)) boost = boost.mul(upgradeEffect("na",12))
        if(hasUpgrade("na",31)) boost = boost.mul(upgradeEffect("na",31))

        boost = boost.div(player.t.leaves.div(boost).max(1).sqrt())

        return boost;
    },
    boost(){
        return player.t.leaves.pow(layers.g.exp()).max(1)
    },
    update(diff){
        player.t.leaves = player.t.leaves.add(this.production().mul(diff))
    }
})
addLayer("na", {
    symbol: "Sa",
    color: "#d2dbeeff",
    row: 2,
    position: 1,

    layerShown(){return hasAchievement("a",53)},
    tooltip(){return `<h2>Salt</h2><br>${formatWhole(player.na.points)} salt`},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    branches: ["d"],

    type: "custom",
    canBuyMax(){return true},
    resource: "salt",
    baseResource: "tears",
    baseAmount() {return player.d.points},

    requires: new Decimal(25), 
    getResetGain(x = player.d.points){
        if(x.lte(24)) return new Decimal(0)
        if(x.gte(66)) return x.sub(24).pow(1.6).mul(new Decimal(1.5).pow(x.sub(61))).mul(new Decimal(10).pow(x.sub(65))).floor()
        if(x.gte(62)) return x.sub(24).pow(1.6).mul(new Decimal(1.5).pow(x.sub(61))).floor()
        if(hasUpgrade("na",32)) return x.sub(24).pow(1.6).floor()
        return x.sub(24).pow(0.8).floor()
    },
    canReset(){
        return player.d.points.gte(25)
    },
    getNextAt(){
        let next = this.getResetGain().add(1).pow(1/0.8).add(24).ceil()
        if(hasUpgrade("na",32)) next = this.getResetGain().add(1).pow(1/1.6).add(24).ceil()
        if(next.isNan()) next = new Decimal(25)
        return next;
    },
    prestigeButtonText(){
        let gain = tmp.na.getResetGain
        return `Evaporate your tears for <b>${formatWhole(gain)}</b> salt.<br>Next at <b>${formatWhole(tmp.na.getNextAt)}</b> tears`
    },
    prestigeNotify(){
        return tmp.na.getResetGain.gte(this.costincrease())
    },
    

    tabFormat: {
        "Main": {
            content: [
                ["blank",24],
                "main-display",
                "prestige-button",
                "blank",
                "upgrades",
            ]
        },
    },

    costincrease(){
        return new Decimal(2).pow(player.na.upgrades.length/1.1).floor()
    },

    upgrades: {
        11: {
            title: "Yum! Salt!",
            description: "Compresses cost is reduced based on salt upgrades!",
            cost() {return tmp.na.costincrease},

            effect(){return new Decimal(0.95).pow(player.na.upgrades.length + !hasUpgrade("na",this.id) - 1).mul(0.85) },
            effectDisplay(){return `^${format(this.effect(), 3)}`},
        },
        12: {
            title: "Leaves like salt!",
            description: "Leaf production is boosted based on salt upgrades!",
            cost() {return tmp.na.costincrease},

            effect(){return new Decimal(10).pow(player.na.upgrades.length + !hasUpgrade("na",this.id) - 1).mul(1000) },
            effectDisplay(){return `x${format(this.effect(), 3)}`},
        },
        13: {
            title: "Generators like salt!",
            description: "Primary Generators are boosted by salt upgrades!",
            cost() {return tmp.na.costincrease},

            effect(){return new Decimal(1.05).pow(player.na.upgrades.length + !hasUpgrade("na",this.id) - 1).mul(1.1) },
            effectDisplay(){return `^${format(this.effect(), 3)}`},
        },
        21: {
            title: "Yum! Salt! II",
            description: "Compresses cost is further reduced based on salt upgrades!",
            cost() {return tmp.na.costincrease},

            effect(){return new Decimal(0.875).pow(player.na.upgrades.length + !hasUpgrade("na",this.id) - 1) },
            effectDisplay(){return `^${format(this.effect(), 3)}`},
        },
        22: {
            title: "Yum! Salt! III",
            description: "Compresses cost is further reduced based on salt upgrades!",
            cost() {return tmp.na.costincrease},
            unlocked() {return hasMilestone("t",10)},

            effect(){return new Decimal(0.9).pow(player.na.upgrades.length + !hasUpgrade("na",this.id) - 1) },
            effectDisplay(){return `^${format(this.effect(), 3)}`},
        },
        23: {
            title: "Primary Spotlight",
            description: "Primary Multipliers are stronger based on salt upgrades",
            cost() {return tmp.na.costincrease},
            unlocked() {return hasMilestone("t",10)},

            effect(){return new Decimal(1.2).pow(player.na.upgrades.length + !hasUpgrade("na",this.id) - 1).mul(2) },
            effectDisplay(){return `^${format(this.effect(), 3)}`},
        },
        31: {
            title: "you're still going?",
            description: "Leaf production is increased based on salt",
            cost() {return tmp.na.costincrease},
            unlocked() {return hasAchievement("a",63)},

            effect(){return player.na.points.pow(2).mul(1000) },
            effectDisplay(){return `x${format(this.effect(), 3)}`},
        },
        32: {
            title: "salty",
            description: "Salt cost scaling is heavily reduced",
            cost() {return tmp.na.costincrease},
            unlocked() {return hasUpgrade("na",31)},
        },
        33: {
            title: "treey",
            description: "Tree cost scaling is heavily reduced",
            cost() {return tmp.na.costincrease},
            unlocked() {return hasUpgrade("na",31)},
        },
    },
})