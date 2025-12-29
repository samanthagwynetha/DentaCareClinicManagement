// Utility functions for role-based access control

/**
 * Check if the current user has any of the specified roles
 * @param allowedRoles - Array of roles to check against
 * @returns true if user has one of the allowed roles, false otherwise
 */
export const hasRole = (allowedRoles: string[]): boolean => {
  if (typeof window === 'undefined') return false;
  
  const role = localStorage.getItem('role');
  return role ? allowedRoles.includes(role) : false;
};

/**
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export const isAdmin = (): boolean => {
  return hasRole(['admin']);
};

/**
 * Check if the current user is a dentist
 * @returns true if user is dentist, false otherwise
 */
export const isDentist = (): boolean => {
  return hasRole(['dentist']);
};

/**
 * Check if the current user is a receptionist
 * @returns true if user is receptionist, false otherwise
 */
export const isReceptionist = (): boolean => {
  return hasRole(['receptionist']);
};

/**
 * Get the current user's role
 * @returns the user's role or null if not found
 */
export const getCurrentRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('role');
};

/**
 * Check if user can delete resources (admin only in most cases)
 * @returns true if user can delete, false otherwise
 */
export const canDelete = (): boolean => {
  return isAdmin();
};

/**
 * Check if user can manage users (admin only)
 * @returns true if user can manage users, false otherwise
 */
export const canManageUsers = (): boolean => {
  return isAdmin();
};

/**
 * Check if user can manage billing (admin or receptionist)
 * @returns true if user can manage billing, false otherwise
 */
export const canManageBilling = (): boolean => {
  return hasRole(['admin', 'receptionist']);
};

/**
 * Check if user can create patients (admin or receptionist)
 * @returns true if user can create patients, false otherwise
 */
export const canCreatePatients = (): boolean => {
  return hasRole(['admin', 'receptionist']);
};

/**
 * Check if user can view appointments (all roles)
 * @returns true if user can view appointments, false otherwise
 */
export const canViewAppointments = (): boolean => {
  return hasRole(['admin', 'dentist', 'receptionist']);
};
