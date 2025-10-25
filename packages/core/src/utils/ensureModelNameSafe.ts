

/**
 * Ensures that the provided model name is a valid, non-empty string.
 * Throws an error if the model name is invalid.
 *
 * @param {string} modelName - The model name to validate.
 * @returns {string} - The validated model name.
 * @throws {Error} - If the model name is invalid.
 * @example
 * const safeModelName = ensureModelNameSafe('MyModel123');
 */
export const ensureModelNameSafe = (modelName: string): string => {
  if (!modelName || typeof modelName !== 'string') {
    throw new Error('Model name must be a non-empty string');
  }

  const trimmedName = modelName.trim();
  if (trimmedName.length === 0) {
    throw new Error('Model name cannot be just whitespace');
  }

  // Optional: Enforce allowed characters (letters, numbers, underscores)
  const nameRegex = /^[A-Za-z0-9_]+$/;
  if (!nameRegex.test(trimmedName)) {
    throw new Error('Model name must only contain letters, numbers, and underscores');
  }

  return trimmedName;
}
