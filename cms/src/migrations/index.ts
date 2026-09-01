import * as migration_20260826_135808_initial_arcp_schema from './20260826_135808_initial_arcp_schema';

export const migrations = [
  {
    up: migration_20260826_135808_initial_arcp_schema.up,
    down: migration_20260826_135808_initial_arcp_schema.down,
    name: '20260826_135808_initial_arcp_schema'
  },
];
