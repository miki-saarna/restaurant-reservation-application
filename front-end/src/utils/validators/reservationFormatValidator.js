export default function reservationFormatValidator(setFrontendValidationError, formData) {
    // Attempting to submit empty field(s)
    const nullValues = [];
    Object.entries(formData).forEach(([k, v]) => {
        if (!v) nullValues.push(k);
    })
    if (nullValues.length) {
        setFrontendValidationError({
            message: `Do not leave the following field(s) empty: ${nullValues.join(', ')}`
        });
        return true;
    }

    const { mobile_number, people } = formData;
        
    // mobile number contains invalid characters
    const invalidCharacters = mobile_number.replace(/[0-9-()]/g, '');
    if (invalidCharacters.length) {
        setFrontendValidationError({ message: `Only digits, parenthesis, and dashes may be used for mobile-number` });
        return true;
    }
    
    // mobile number doesn't contain 10-digits
    const onlyNumbers = mobile_number.replace(/\D/g, '');
    if (onlyNumbers.length !== 10) {
        setFrontendValidationError({ message: `Mobile number must be exactly 10-digits long`})
        return true;
    }

    // reservation size is less than 1 or not an integer
    if (people < 1 || !Number.isInteger(people)) {
        setFrontendValidationError({ message: 'The reservation size must be a positive integer' })
        return true;
    }
}