/*
Matattack Skill Plugin
Created by Karelmx

This plugin allows custom skills to increase damage based on a percentage of one of the unit's stats.

How to Use:

1. Create a Custom Skill.
2. Set the skill keyword to: matattack
3. Add the following Custom Parameters to the skill:
{
stat: "spd",
multiplier: 0.4
}

Parameter Explanation:
stat
Determines which stat will be used to calculate the bonus damage.

Supported stats:
"str" = Strength
"mag" = Magic
"skl" = Skill
"spd" = Speed
"lck" = Luck
"def" = Defense
"mdf" = Magic Defense
"mov" = Movement
"wlv" = Weapon Level

multiplier
Determines how much of the selected stat is added as bonus damage.

Examples:

{
stat: "spd",
multiplier: 0.4
}

Adds 40% of the unit's Speed as bonus damage.

{
stat: "def",
multiplier: 1.5
}

Adds 150% of the unit's Defense as bonus damage.

{
stat: "lck",
multiplier: 2.8
}

Adds 280% of the unit's Luck as bonus damage.
*/

(function () {

    // =========================
    // SKILL ACTIVATION
    // =========================

    var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;

    SkillRandomizer.isCustomSkillInvokedInternal = function (active, passive, skill, keyword) {

        if (keyword === "matattack") {
            return this._isSkillInvokedInternal(active, passive, skill);
        }

        return alias1.call(this, active, passive, skill, keyword);
    };


    // =========================
    // DAMAGE BONUS
    // =========================

    var alias2 = AttackEvaluator.HitCritical.calculateDamage;

    AttackEvaluator.HitCritical.calculateDamage = function (virtualActive, virtualPassive, attackEntry) {

        var damage = alias2.call(this, virtualActive, virtualPassive, attackEntry);

        var active = virtualActive.unitSelf;
        var passive = virtualPassive.unitSelf;

        var skill = SkillControl.checkAndPushCustomSkill(
            active,
            passive,
            attackEntry,
            true,
            "matattack"
        );

        if (skill !== null) {

            // =========================
            // CUSTOM PARAMETERS
            // =========================

            var stat = skill.custom.stat;
            var multiplier = skill.custom.multiplier;

            if (multiplier == null) {
                multiplier = 1;
            }

            var statValue = 0;

            // =========================
            // STAT CHECK
            // =========================

            switch (stat) {

                case "str":
                    statValue = RealBonus.getStr(active);
                    break;

                case "mag":
                    statValue = RealBonus.getMag(active);
                    break;

                case "skl":
                    statValue = RealBonus.getSki(active);
                    break;

                case "spd":
                    statValue = RealBonus.getSpd(active);
                    break;

                case "lck":
                    statValue = RealBonus.getLuk(active);
                    break;

                case "def":
                    statValue = RealBonus.getDef(active);
                    break;

                case "mdf":
                    statValue = RealBonus.getMdf(active);
                    break;

                case "mov":
                    statValue = RealBonus.getMov(active);
                    break;

                case "wlv":
                    statValue = RealBonus.getWlv(active);
                    break;
            }

            // =========================
            // FINAL BONUS
            // =========================

            var extra = Math.floor(statValue * multiplier);

            damage += extra;
        }

        return damage;
    };

})();
