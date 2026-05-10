/*Item State Skill Plugin
Created by Karelmx

This plugin allows units to gain a state after using an item from a specific item category.

How to Use:

1. Create a Custom Skill.
2. Set the skill keyword to: itemState

3. Add the following Custom Parameters to the skill:

{
itemType: "Item",
stateId: 3
}

Parameter Explanation:

itemType
The exact name of the item's weapon category.
This must match the category name from the Weapon Types database.

Examples:
"Item"
"Staff"

stateId
The ID of the state that will be applied to the user after using a matching item category.

Example:
If stateId is set to 3, the unit will gain State ID 3 after using the specified item category.
*/

(function () {

    var aliasItemUse = UnitCommand.Item._moveUse;

    UnitCommand.Item._moveUse = function () {

        var result = aliasItemUse.call(this);

        // Cuando el item termina de usarse
        if (result === MoveResult.END) {

            var unit = this.getCommandTarget();
            var item = this._itemSelectMenu.getSelectItem();

            // Busca la skill custom
            var skill = SkillControl.getPossessionCustomSkill(unit, 'itemState');

            if (skill && item) {

                // Categoria configurada en la skill
                var allowedType = skill.custom.itemType;

                // Categoria del item usado
                var itemType = item.getWeaponType().getName();

                // ID del estado
                var stateId = skill.custom.stateId;

                // Si coincide la categoria
                if (allowedType === itemType) {

                    // Obtiene el estado
                    var state = root.getBaseData().getStateList().getDataFromId(stateId);

                    // Aplica el estado
                    if (state) {
                        StateControl.arrangeState(unit, state, IncreaseType.INCREASE);
                    }
                }
            }
        }

        return result;
    };

})();
