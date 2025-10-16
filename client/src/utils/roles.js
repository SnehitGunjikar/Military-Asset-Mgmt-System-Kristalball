export const roles = {
  Admin: 'Admin',
  BaseCommander: 'BaseCommander',
  LogisticsOfficer: 'LogisticsOfficer',
  Viewer: 'Viewer',
}

// UI-friendly options: display labels map to server enum values
export const roleOptions = [
  { value: roles.Admin, label: 'Admin' },
  { value: roles.BaseCommander, label: 'Base Commander' },
  { value: roles.LogisticsOfficer, label: 'Logistics Officer' },
  { value: roles.Viewer, label: 'Viewer' },
]