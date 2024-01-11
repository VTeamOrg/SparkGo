function objectsEqual(obj1, obj2) {
    if (!obj1 || !obj2) {
        return false;
    }
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i];
        if (key !== keys2[i]) {
            return false;
        }

        const val1 = obj1[key];
        const val2 = obj2[key];

        const areObjects = (typeof val1 === 'object' && val1 !== null) && (typeof val2 === 'object' && val2 !== null);
        if (areObjects && !objectsEqual(val1, val2) || !areObjects && val1 !== val2) {
            return false;
        }
    }

    return true;
}

module.exports = objectsEqual;