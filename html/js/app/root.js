$(function(){
    $('#cameraWrap').camera({
        height: '600px',
        pagination: true,
        navigation: false,
        hover: false,
        playPause: false,
        transPeriod: 500,
        onEndTransition: function(){
            var ind = $('#cameraWrap').find('.camera_target .cameraSlide.cameracurrent').index() + 1,
                $li = $('#slimmenu .menu-item').find('li:nth-child(' + ind + ')');

            //update the menu
            $('#mainNavBar>li').removeClass('active');
            $('#mainNavBar>li:nth-child(' + ind + ')').addClass('active');
        }
    });

    $('#mainNavBar a, #footList a.foot-menu-item').click(function(e){
        var $ahref  = $(e.target),
        seq     = $ahref.attr('seq');

        e.stopPropagation();

        //highlight the menu active menu item
        $('#mainNavBar>li').removeClass('active');
        $('#mainNavBar>li:nth-child(' + seq + ')').addClass('active');

        //stop the slideshow
        $('#cameraWrap').cameraStop();

        //tell the slideshow to go to the right slide
        switch(seq){
        case '1':
        $('.camera_pag li:first-child','#cameraWrap').click();
        break;
        case '2':
        $('.camera_pag li:nth-child(2)','#cameraWrap').click();
        break;
        case '3':
        $('.camera_pag li:nth-child(3)','#cameraWrap').click();
        break;
        case '4':
        $('.camera_pag li:nth-child(4)','#cameraWrap').click();
        break;
        }
    });

    $('#loginButton').click(function(){
        $('#loginPanel').toggleClass('collapse').toggleClass('collapsing');
        $('#signupPanel').addClass('collapse').removeClass('collapsing');
        $('#forgotPasswordPanel').addClass('collapse').removeClass('collapsing');
        });
    $('#signupButton').click(function(){
        $('#loginPanel').addClass('collapse').removeClass('collapsing');
        $('#signupPanel').toggleClass('collapse').toggleClass('collapsing');
        $('#forgotPasswordPanel').addClass('collapse').removeClass('collapsing');
        });
    $('#forgotPasswordLink').click(function(){
        $('#loginPanel').addClass('collapse').removeClass('collapsing');
        $('#signupPanel').addClass('collapse').removeClass('collapsing');
        $('#forgotPasswordPanel').toggleClass('collapse').toggleClass('collapsing');
        });


    //login form js
    ({
        showError : function($el, strError){
            $el.parent().addClass('has-error');
            $el.prev().removeClass('sr-only').html(strError);
        },
        hideError : function($el){
            $el.parent().removeClass('has-error');
            $el.prev().addClass('sr-only');
        },
        validateEmailField: function($email){
            if(this.validateEmailFormat($email.val())){
                this.hideError($email);
            }else{
                this.showError($email, 'invalid email address');
            }
        },
        validateEmailFormat: function(email){
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
        },
        attachListners: function(){
            var me = this;
            $('#loginForm input.plain-required').keydown(function(){
                me.hideError($(this));
            });
            $('#loginEmail').blur(function(){
                me.validateEmailField($(this));
            });
        },
        createAjaxForm: function(){
            var me = this;

            $('#loginForm').ajaxForm({
                beforeSubmit: function(arr, $form, options){
                    (function validation(){
                        var requiredFieldIds = ['loginEmail', 'loginPassword'], i, $one;
                        for(i in requiredFieldIds){
                            $one = $('#' + requiredFieldIds[i]);
                            if(!$one.val()){    //if no input yet
                                me.showError($one, 'no value input');
                            }
                        }

                        //validate email address
                        me.validateEmailField($('#loginEmail'));
                    })();

                    if($('#loginPanel .has-error').length > 0){
                        return false;
                    }

                    $('#loginSubmit').button('loading');
                },
                error: function(){

                },
                success: function(data){
                    if(data.status == 'fail'){
                        var message = eb.message.get('login', data.message);
                        me.showError($('#loginEmail'), message);
                    }else{
                        alert('about to redirect to home page');
                    }
                },
                complete: function(xhr, text){
                    $('#loginSubmit').button('reset');
                },
                dataType: 'json'
            })
        },

        exec: function(){
            this.attachListners();
            this.createAjaxForm();
        }
    }).exec();

    //signup form js
    ({
        showError : function($el, strError){
            $el.parent().addClass('has-error');
            $el.prev().removeClass('sr-only').html(strError);
        },
        hideError : function($el){
            $el.parent().removeClass('has-error');
            $el.prev().addClass('sr-only');
        },
        matchSecondEmail : function(){
            if($('#signupEmail2').val() == $('#signupEmail').val()){
                this.hideError($('#signupEmail2'));
            }else{
                this.showError($('#signupEmail2'), 'not matched');
            }
        },
        validateEmailField: function($email){
            if(this.validateEmailFormat($email.val())){
                this.hideError($email);
            }else{
                this.showError($email, 'invalid email address');
            }
        },
        validateEmailFormat: function(email){
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
        },
        attachListners: function(){
            var me = this;
            $('#signupForm input.plain-required').keydown(function(){
                me.hideError($(this));
            });
            $('#signupEmail2').keyup(function(){
                me.matchSecondEmail();
            });
            $('#signupEmail').blur(function(){
                me.validateEmailField($(this));
            });
        },
        createAjaxForm: function(){
            var me = this;

            $('#signupForm').ajaxForm({
                beforeSubmit: function(arr, $form, options) {
                    (function validation(){
                        //validate required fields
                        var requiredFieldIds = ['signupFirstName','signupLastName','signupEmail','signupEmail2','signupPassword'],
                        i, $one;
                        for(i in requiredFieldIds){
                            $one = $('#' + requiredFieldIds[i]);
                            if(!$one.val()){    //if no input yet
                                me.showError($one, 'no value input');
                            }
                        }

                        //validate email format
                        me.validateEmailField($('#signupEmail'));
                        me.validateEmailField($('#signupEmail2'));

                        //validate the second email should be same as the first one
                        me.matchSecondEmail();
                    })();

                    if($('#signupPanel .has-error').length > 0){
                        return false;
                    }

                    $('#signupSubmit').button('loading');
                },
                error: function(){

                },
                success: function(data){
                    if(data.status == 'fail'){
                        var message = eb.message.get('login', data.message);
                        if(data.message == 'EMAIL_DUP'){
                            me.showError($('#signupEmail'), message);
                        }else{
                            me.showError($('#signupErrorPlaceholder'), message);
                            setTimeout(function(){
                                me.hideError($('#signupErrorPlaceholder'));
                            }, 5000);
                        }
                    }else{
                        alert('about to redirect to home page');
                    }
                },
                complete: function(xhr, text){
                    $('#signupSubmit').button('reset');
                },
                dataType: 'json'
            });
        },

        exec: function(){
            this.attachListners();
            this.createAjaxForm();
        }
    }).exec();

});