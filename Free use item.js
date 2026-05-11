/* 
Created by Karelmx
Custom Skill Keyword:
freeItem

Custom Parameters:
{
    freeItemType: "Item"
}

Description:
Allows the unit to use one item per turn without ending its action, as long as the item's category matches the specified freeItemType.

freeItemType must match the exact name of the item's weapon category in the Weapon Types database.
Examples:
"Item"
"Staff"
*/


(function () {

    // =========================
    // ITEM USE
    // =========================

    UnitCommand.Item._moveUse = function () {

        if (this._itemUse.moveUseCycle() !== MoveResult.CONTINUE) {

            var unit = this.getCommandTarget();
            var item = this._itemSelectMenu.getSelectItem();

            var skill = SkillControl.getPossessionCustomSkill(unit, 'freeItem');

            var alreadyUsed = unit.custom.freeItemUsed;

            var canFreeUse = false;

            if (skill && !alreadyUsed) {

                // Categoria configurada en la skill
                var allowedType = skill.custom.freeItemType;

                // Categoria del item usado
                var itemType = item.getWeaponType().getName();

                // Coinciden
                if (allowedType === itemType) {
                    canFreeUse = true;
                }
            }

            if (canFreeUse) {

                unit.custom.freeItemUsed = true;

                this.setExitCommand(this);
                this.rebuildCommand();
            }
            else {
                this.endCommandAction();
            }

            return MoveResult.END;
        }

        return MoveResult.CONTINUE;
    };


    // =========================
    // RESET EACH TURN
    // =========================

    var aliasTurnStart = TurnChangeStart.doLastAction;

    TurnChangeStart.doLastAction = function () {

        var list = PlayerList.getAliveList();
        var count = list.getCount();

        for (var i = 0; i < count; i++) {

            var unit = list.getData(i);

            unit.custom.freeItemUsed = false;
        }

        aliasTurnStart.call(this);
    };

})();
