if(!window.eb){
    window.eb = {};
}

window.eb.message = {
    /**
     *  by given module and msgId, return corresponding message
     *  if module is not found, return the default module default string
     *  if message id is not found, return the module default string
     * @param module
     * @param msgId
     * @returns {*}
     */
    get:        function(module, msgId){
        if(this[module]){
            if(this[module][msgId]){
                return this[module][msgId];
            }else{
                return this[module]['DEFAULT'];
            }
        }else{
            return this['default']['DEFAULT'];
        }
    },

    /**
     * the default module
     */
    default:    {
        DEFAULT:    'Global default issue'
    },

    /**
     *  the login module. it includes login, signup, forgot password
     */
    login:      {
        DEFAULT:    'Unknown issue',
        EMAIL_DUP : 'Email is registered already'
    }
};