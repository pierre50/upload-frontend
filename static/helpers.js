import Utils from './helpers/utils'
import Validator from './helpers/validator'
import Config from './helpers/config'

let Helpers = {
    get $utils() {return Utils},
    get $validator() {return Validator},
    get $config() {return Config}
};

export default Helpers