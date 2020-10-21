export function validate(validatable) {
    const { value, required, minLength, maxLength, min, max } = validatable;
    let isValid = true;
    if (required) {
        isValid = isValid && value.toString().trim().length !== 0;
    }
    if (minLength != null && typeof value === 'string') {
        isValid = isValid && value.trim().length > minLength;
    }
    if (maxLength != null && typeof value === 'string') {
        isValid = isValid && value.trim().length < maxLength;
    }
    if (min != null && typeof value === 'number') {
        isValid = isValid && value > min;
    }
    if (max != null && typeof value === 'number') {
        isValid = isValid && value < max;
    }
    return isValid;
}
//# sourceMappingURL=Validation.js.map