/*
Matattack Skill Plugin
Created by Karelmx

This plugin allows custom skills to increase damage based on a percentage of one of the unit's stats.

How to Use:

1. Create a Custom Skill.
2. Set the skill keyword to: matattack
3. Add the following Custom Parameters to the skill:
{
stat: "hp",
multiplier: 0.5,
target: "target"
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
"mhp" = Max HP
"hp"  = Current HP
"losthp" = Missing HP

multiplier
Determines how much of the selected stat is added as bonus damage.

Available targets:
user   = Uses the skill user's stats (default)
target = Uses the target's stats

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
            var target = skill.custom.target;

            // default values
            if (multiplier == null) {
                multiplier = 1;
            }

            // =========================
            // USER OR TARGET
            // =========================

            var unit = active;

            if (target === "target") {
                unit = passive;
            }

            var statValue = 0;

            // =========================
            // STAT CHECK
            // =========================

            switch (stat) {

                case "str":
                    statValue = RealBonus.getStr(unit);
                    break;

                case "mag":
                    statValue = RealBonus.getMag(unit);
                    break;

                case "skl":
                    statValue = RealBonus.getSki(unit);
                    break;

                case "spd":
                    statValue = RealBonus.getSpd(unit);
                    break;

                case "lck":
                    statValue = RealBonus.getLuk(unit);
                    break;

                case "def":
                    statValue = RealBonus.getDef(unit);
                    break;

                case "mdf":
                    statValue = RealBonus.getMdf(unit);
                    break;

                case "mov":
                    statValue = RealBonus.getMov(unit);
                    break;

                case "wlv":
                    statValue = RealBonus.getWlv(unit);
                    break;

                case "mhp":
                    statValue = ParamBonus.getMhp(unit);
                    break;

                case "hp":
                    statValue = unit.getHp();
                    break;

                case "losthp":
                    statValue = ParamBonus.getMhp(unit) - unit.getHp();
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
