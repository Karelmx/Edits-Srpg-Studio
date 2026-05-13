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
"mhp" = Max HP
"lvl" = Level
"bld" = Build/Constitution

Supported values:
"greater"
"less"

damageBonus/defenseBonus
Bonus damage dealt if the condition is met.
Can be positive, negative, or 0.

Optional Parameters:
damageBonus and defenseBonus are optional.
If omitted, they automatically default to 0.
*/

(function () {

    // =========================
    // DAMAGE BONUS
    // =========================

    var aliasDamage = DamageCalculator.calculateDamage;

    DamageCalculator.calculateDamage = function (
        active,
        passive,
        weapon,
        isCritical,
        activeTotalStatus,
        passiveTotalStatus,
        trueHitValue
    ) {

        var damage = aliasDamage.call(
            this,
            active,
            passive,
            weapon,
            isCritical,
            activeTotalStatus,
            passiveTotalStatus,
            trueHitValue
        );

        var skill = SkillControl.getPossessionCustomSkill(
            active,
            "statcompare"
        );

        if (skill !== null && checkCondition(active, passive, skill)) {

            damage += skill.custom.damageBonus || 0;
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

        if (skill !== null && checkCondition(passive, active, skill)) {

            def += skill.custom.defenseBonus || 0;
        }

        return def;
    };


    // =========================
    // HIT BONUS
    // =========================

    var aliasHit = HitCalculator.calculateHit;

    HitCalculator.calculateHit = function (
        active,
        passive,
        weapon,
        activeTotalStatus,
        passiveTotalStatus
    ) {

        var hit = aliasHit.call(
            this,
            active,
            passive,
            weapon,
            activeTotalStatus,
            passiveTotalStatus
        );

        var skill = SkillControl.getPossessionCustomSkill(
            active,
            "statcompare"
        );

        if (skill !== null && checkCondition(active, passive, skill)) {

            hit += skill.custom.hitBonus || 0;
        }

        return hit;
    };


    // =========================
    // AVOID BONUS
    // =========================

    var aliasAvoid = HitCalculator.calculateAvoid;

    HitCalculator.calculateAvoid = function (
        active,
        passive,
        weapon,
        totalStatus
    ) {

        var avo = aliasAvoid.call(
            this,
            active,
            passive,
            weapon,
            totalStatus
        );

        var skill = SkillControl.getPossessionCustomSkill(
            passive,
            "statcompare"
        );

        if (skill !== null && checkCondition(passive, active, skill)) {

            avo += skill.custom.avoidBonus || 0;
        }

        return avo;
    };


    // =========================
    // CRITICAL BONUS
    // =========================

    var aliasCrit = CriticalCalculator.calculateCritical;

    CriticalCalculator.calculateCritical = function (
        active,
        passive,
        weapon,
        activeTotalStatus,
        passiveTotalStatus
    ) {

        var crt = aliasCrit.call(
            this,
            active,
            passive,
            weapon,
            activeTotalStatus,
            passiveTotalStatus
        );

        var skill = SkillControl.getPossessionCustomSkill(
            active,
            "statcompare"
        );

        if (skill !== null && checkCondition(active, passive, skill)) {

            crt += skill.custom.criticalBonus || 0;
        }

        return crt;
    };


    // =========================
    // CRITICAL AVOID BONUS
    // =========================

    var aliasCritAvoid = CriticalCalculator.calculateCriticalAvoid;

    CriticalCalculator.calculateCriticalAvoid = function (
        active,
        passive,
        weapon,
        totalStatus
    ) {

        var cav = aliasCritAvoid.call(
            this,
            active,
            passive,
            weapon,
            totalStatus
        );

        var skill = SkillControl.getPossessionCustomSkill(
            passive,
            "statcompare"
        );

        if (skill !== null && checkCondition(passive, active, skill)) {

            cav += skill.custom.criticalAvoidBonus || 0;
        }

        return cav;
    };


    // =========================
    // CONDITION CHECK
    // =========================

    function checkCondition(user, target, skill) {

        var userStat = skill.custom.userStat;
        var targetStat = skill.custom.targetStat;

        var operator = skill.custom.operator;
        var value = skill.custom.value;

        var userValue = getStat(user, userStat);
        var targetValue = getStat(target, targetStat);

        if (operator === "greater") {
            return (userValue >= targetValue + value);
        }
        else if (operator === "less") {
            return (userValue <= targetValue - value);
        }

        return false;
    }


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

            case "mhp":
                return RealBonus.getMhp(unit);

            case "lvl":
                return unit.getLv();

            case "bld":
                return RealBonus.getBld(unit);
        }

        return 0;
    }

})();
