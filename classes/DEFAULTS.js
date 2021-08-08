//  a class of static methods to easily set undefined variables to their desired default value
class DEFAULTS{

    static value(default_val, property){
        return (property == null) ? default_val : property
    }

    static true(property){
        return DEFAULTS.value(true, property)
    }

    static false(property){
        return DEFAULTS.value(false, property)
    }

    static zero(property){
        return DEFAULTS.value(0, property)
    }
}
exports.DEFAULTS = DEFAULTS