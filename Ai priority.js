/*--------------------------------------------------------------------------
AI Priority Skill Plugin
Created by Karelmx

This plugin adds two AI manipulation skills:

- decoy
  Units with this skill gain extremely high attack priority.
  Enemies will prefer attacking them whenever possible.

- stealth
  Units with this skill gain extremely low attack priority.
  Enemies will avoid attacking them whenever possible.

If a stealth unit is the only available target,
the enemy will still attack normally.

--------------------------------------------------------------------------*/

(function() {

    var DECOY_KEYWORD = 'decoy';
    var STEALTH_KEYWORD = 'stealth';

    var DECOY_BONUS = 10000;
    var STEALTH_PENALTY = -10000;

    // Alias original function
    var alias = AIScorer.Weapon._getTotalScore;

    AIScorer.Weapon._getTotalScore = function(unit, combination) {

        var score = alias.call(this, unit, combination);
        var targetUnit = combination.targetUnit;

        if (!targetUnit) {
            return score;
        }

        // Check for Decoy
        if (SkillControl.getPossessionCustomSkill(targetUnit, DECOY_KEYWORD)) {
            score += DECOY_BONUS;
        }

        // Check for Stealth
        if (SkillControl.getPossessionCustomSkill(targetUnit, STEALTH_KEYWORD)) {
            score += STEALTH_PENALTY;
        }

        return score;
    };

})();
