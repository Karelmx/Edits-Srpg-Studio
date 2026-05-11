/*
Stat Compare Skill Plugin
Created by Karelmx

This plugin allows you to create passive skills that compare one of the user's stats with one of the target's stats.
If the condition is met, the skill can increase damage dealt and/or increase defense when receiving attacks.

How to Use:
1. Create a Custom Skill.
2. Set the skill keyword to: statcompare
3. Add Custom Parameters to the skill.

Basic Example:
{
userStat: "str",
targetStat: "str",
operator: "greater",
value: 5,
damageBonus: 3,
defenseBonus: 3
}

What This Example Does:
If the user's STR is 5 or more higher than the target's STR:
* The user deals +3 damage.
* The user gains +3 DEF/MDF when defending.

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

Supported values:
"greater"
"less"

damageBonus/defenseBonus
Bonus damage dealt if the condition is met.
Can be positive, negative, or 0.

Examples:
damage/defenseBonus: 3
damage/Bonus: -2
damage/Bonus: 0

Optional Parameters:
damageBonus and defenseBonus are optional.
If omitted, they automatically default to 0.
*/

(function () {

    // =========================
    // DAMAGE BONUS
    // =========================

    var aliasDamage = AttackEvaluator.HitCritical.calculateDamage;

    AttackEvaluator.HitCritical.calculateDamage = function (virtualActive, virtualPassive, attackEntry) {

        var damage = aliasDamage.call(this, virtualActive, virtualPassive, attackEntry);

        var active = virtualActive.unitSelf;
        var passive = virtualPassive.unitSelf;

        var skill = SkillControl.getPossessionCustomSkill(
            active,
            "statcompare"
        );

        if (skill !== null) {

            var userStat = skill.custom.userStat;
            var targetStat = skill.custom.targetStat;

            var operator = skill.custom.operator;
            var value = skill.custom.value;

            var damageBonus = skill.custom.damageBonus || 0;

            var userValue = getStat(active, userStat);
            var targetValue = getStat(passive, targetStat);

            var condition = false;

            if (operator === "greater") {
                condition = (userValue >= targetValue + value);
            }
            else if (operator === "less") {
                condition = (userValue <= targetValue - value);
            }

            if (condition) {
                damage += damageBonus;
            }
        }

        return damage;
    };


    // =========================
    // DEFENSE BONUS
    // =========================

    var aliasDef = DamageCalculator.calculateDefense;

    DamageCalculator.calculateDefense = function (
        active,
        passive,
        weapon,
        isCritical,
        totalStatus,
        trueHitValue
    ) {

        var def = aliasDef.call(
            this,
            active,
            passive,
            weapon,
            isCritical,
            totalStatus,
            trueHitValue
        );

        var skill = SkillControl.getPossessionCustomSkill(
            passive,
            "statcompare"
        );

        if (skill !== null) {

            var userStat = skill.custom.userStat;
            var targetStat = skill.custom.targetStat;

            var operator = skill.custom.operator;
            var value = skill.custom.value;

            var defenseBonus = skill.custom.defenseBonus || 0;

            var userValue = getStat(passive, userStat);
            var targetValue = getStat(active, targetStat);

            var condition = false;

            if (operator === "greater") {
                condition = (userValue >= targetValue + value);
            }
            else if (operator === "less") {
                condition = (userValue <= targetValue - value);
            }

            if (condition) {
                def += defenseBonus;
            }
        }

        return def;
    };


    // =========================
    // GET STAT FUNCTION
    // =========================

    function getStat(unit, stat) {

        switch (stat) {

            case "str":
                return RealBonus.getStr(unit);

            case "mag":
                return RealBonus.getMag(unit);

            case "skl":
                return RealBonus.getSki(unit);

            case "spd":
                return RealBonus.getSpd(unit);

            case "lck":
                return RealBonus.getLuk(unit);

            case "def":
                return RealBonus.getDef(unit);

            case "mdf":
                return RealBonus.getMdf(unit);

            case "mov":
                return RealBonus.getMov(unit);

            case "wlv":
                return RealBonus.getWlv(unit);
        }

        return 0;
    }

})();
