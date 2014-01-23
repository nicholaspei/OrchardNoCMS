// bootstrap validation
(function() {
  var validateTextField;

  validateTextField = function($field) {
    var $helpContainer, error, maxLength, minLength, pattern, required, func,validateName, value,remoteval;
    value = $field.val();
    error = false;
      //alert(value);
  
    $helpContainer = $field.siblings('.help-inline');
    if (!$helpContainer.length)
    {
        if (!$field.parent().is('span')) {           
            $field.parent().append('<span class="help-inline"></span>');
        }
        $helpContainer = $field.siblings('.help-inline');  
    }    
      validateName = $field.attr('data-validatename') || $field.attr('msg') || '字段';
      required = $field.attr('required') === 'required';
      minLength = parseInt($field.attr('data-minlength'));
      if (isNaN(minLength)) {
        minLength = 0;
      }
      maxLength = parseInt($field.attr('maxlength'));
      if (isNaN(maxLength)) {
        maxLength = false;
      }      
      pattern = $field.attr('reg');
      if (pattern === '') {
        pattern = void 0;
      }
     
      func = $field.attr('func');
      if (func === '') {
          func = void 0;
      }
      
      if (!(required === true) && value === "" && func === void 0) {
          $field.siblings('.help-inline').remove();
          $field.closest('.control-group').addClass('success').removeClass('error');
          return false;
      }
      debugger;
      if (required === true && value === '') {
          error = validateName + '不能为空';
      } else {
          if (error === false && pattern !== void 0) {

              var reg = new RegExp(pattern, 'ig');
              if (!reg.test(value)) {
                  error = validateName + '格式不正确';
                  if ($field.attr('formatmsg'))
                      error += " ," + $field.attr('formatmsg');
              }
          }
          if (value !== '') {
              if (error === false && minLength !== 0) {
                  if (!(value.length >= minLength)) {
                      error = validateName + ' 长度不够';
                  }
              }
              if (error === false && maxLength !== false) {
                  if (!(value.length <= maxLength)) {
                      error = validateName + ' 长度过长';
                  }
              }
          }
      }
      if (error === false && func !== void 0) {            
          remoteval = window[func]();
          if (remoteval.state===false )
          {
              error =  remoteval.msg;
          }
      }
     
      if (error !== false) {
        $field.closest('.control-group').addClass('error').removeClass('success');
        $helpContainer.html('<i class="icon-remove icon-red"></i> ' + error);
      } else {
        $field.closest('.control-group').addClass('success').removeClass('error');
        $helpContainer.html('<i class="icon-ok icon-green"></i>');
      }
      //alert(error);
    return error;
  };

    (function ($) {
        var errors;
        
        errors = [];
        $.fn.bootstrapValidate = function () {
            var result = true;            
      if (this.is('form')) {
          //throw new Error('Boostrap Validate Expects A Form');
          $('input, textarea, select', $(this)).not('[type="radio"]').not('[type="button"]').not('[type="checkbox"]').each(function (i, el) {
              var error;           
              if (!$(el).is(":visible"))
                  return;
              if (error = validateTextField($(el))) {
                  result = false;                 
                  return errors.push(error);
              }
          });
      }
      //this.attr('novalidate', 'novalidate').on('click', function(submitEvent) {        
      //  $('input, textarea', $(this)).not('[type="radio"]').not('[type="checkbox"]').each(function(i, el) {
      //    var error;
      //    if (error = validateTextField($(el))) {             
      //      return errors.push(error);
      //    }
      //  });
      //  if (errors.length !== 0) {
      //    submitEvent.stopImmediatePropagation();
      //    return false;
      //  }
      //});
      $('input, textarea, select', this).not('[type="radio"]').not('[type="button"]').not('[type="checkbox"]').on('click', function (changeEvent) {
        return validateTextField($(this));
      });
      $('input, textarea, select', this).not('[type="radio"]').not('[type="button"]').not('[type="checkbox"]').on('keyup', function (keyupEvent) {
          var $this, timeout;         
        $this = $(this);
        timeout = $this.data('keyup-timeout');
        if (timeout !== void 0) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
          return validateTextField($this);
        }, 750);
        return $this.data('keyup-timeout', timeout);
      });    
      // check whether the error info exist
      $(".help-inline").each(function () {         
          if ($(this).html().length > 34)
              result = false;        
      });   
      return result;
    };
  })(jQuery);

  jQuery(function() {
      return jQuery('.form-horizontal').bootstrapValidate();
  });

}).call(this);

function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
}