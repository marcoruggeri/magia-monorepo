export enum HUDState {
  MAP,
  MOVE_UNIT = 'Select land to move to',
  ATTACK = 'Select land to attack',
  DEPLOY_UNIT = 'Deploying unit',
  NEEDS_TO_REGISTER = 'Register your hero to the map to play',
  PICK_UNITS_TO_SHIELD = 'Select which units to shield',
  CAST_HEALING = 'Casting healing',
  CAST_ATTACK = 'Casting attack',
  CAST_PYROBLAST_START = 'Casting pyroblast',
  CAST_PYROBLAST_CONFIRM = 'Confirm blast radius',
  CAST_SUMMON = 'Casting summon',
  CAST_CONVERT = 'Select a unit to convert',
  CAST_TELEPORT_FROM = 'Casting teleport. Select a unit.',
  CAST_TELEPORT_TO = 'Casting teleport. Select a destination.',
}
