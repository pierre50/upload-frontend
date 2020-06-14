let Validator = {
    validatePassword(rule, value, callback) {
        if (value.length < 6) {
            callback(new Error('Your password must be at least 6 characters long!'));
        } else {
            callback();
        }
    },
    validateDirname(rule, value, callback) {
        if (Helpers.$utils.isValidFilename(value)){
            if (value.length < 50){
                callback();
            }else{
                callback(new Error('Directory name cannot exceed 50 characters.'));
            }
        } else {
            callback(new Error('Directory name has an invalid character.'));
        }
    },
    validateFilename(rule, value, callback) {
        if (Helpers.$utils.isValidFilename(value)){
            if (value.length < 250){
                callback();
            }else{
                callback(new Error('File name cannot exceed 250 characters.'));
            }
        } else {
            callback(new Error('File name has an invalid character.'));
        }
    }
};

export default Validator;