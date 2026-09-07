import * as migration_20260826_135808_initial_arcp_schema from './20260826_135808_initial_arcp_schema';
import * as migration_20260907_144404_membership_request_details from './20260907_144404_membership_request_details';

export const migrations = [
  {
    up: migration_20260826_135808_initial_arcp_schema.up,
    down: migration_20260826_135808_initial_arcp_schema.down,
    name: '20260826_135808_initial_arcp_schema',
  },
  {
    up: migration_20260907_144404_membership_request_details.up,
    down: migration_20260907_144404_membership_request_details.down,
    name: '20260907_144404_membership_request_details'
  },
];
