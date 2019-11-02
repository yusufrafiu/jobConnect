$(document).on('ready', function(e) {

    // personal details
    var pdForm      = $('#pd-form'); // pd form
    var diPd        = $('#di-pd'); // display pd
    var edPd        = $('#ed-pd'); // edit pd (btn)
    var diPdF       = $('#di-pd-f'); // display pd form (container)
    var caPdF       = $('#ca-pd-f'); // cancel pd form
    var pdErrors    = $('#pd-errors'); // pd errors ul


    // career summary
    var caCsF       = $('#ca-cs-f'); // cancel cs form
    var csErrors    = $('#cs-errors'); 
    var diCsF       = $('#di-cs-f');
    var diCs        = $('#di-cs');
    var edCs        = $('#ed-cs');
    var csForm      = $('#cs-form');

    // education
    var diEdu       = $('#di-edu');
    var edEdu       = $('#ed-edu');
    var diEduF       = $('#di-edu-f');
    var caEduF       = $('#ca-edu-f');
    var EduErrors    = $('#edu-errors');
    //var diEduF       = $('#di-edu-f');




    function postNewValues (values, section) {
        var posts = section.find('[data-post]');

        for(i=0; i < posts.length; i++) {
            var post = $(posts[i]);
            var property = post.data("post");

            if(values[property]) {
                post.text(values[property]);

            }
        }

    }

    function openEdit(open, close) {
        open.show(100);
        close.hide(100);
    }

    function closeEdit(open, close) {
        open.hide(100);
        close.show(100);
    }

    function hideErrors(errors) {
        if(errors.children().length > 0) {
            errors.html("");
            errors.parent().hide();
        }
    }

    function displayErrors(errorUL, form, errors) {
        hideErrors(errorUL);

        var inputs = form.find("input");
        var selects = form.find('select');

        var AttrArray = [];

        for(i=0; i < inputs.length; i++) {
            var input = inputs[i];
            var property = input.getAttribute('name');
            AttrArray.push(property);
        }
        for(i=0; i < selects.length; i++) {
            var select = selects[i];
            var property = select.getAttribute('name');
            AttrArray.push(property);
        }

        for(i=0; i < AttrArray.length; i++) {
            var key = AttrArray[i];
            if(errors[key]) {
                errorUL.append('<li>' + errors[key] + '</li>');
                errorUL.parent().show();

            }
        }

    }

    function completeAjaxCall(form, initialDisplay, errorUL) {
        form.on('submit', function(e) {
            e.preventDefault();

            // get all inputs in the form
            var inputs = form.find("input, select, textarea, button");

            var action = form.attr('action');
            var formData = form.serialize();

            // disable form inputs
            inputs.prop("disabled", true);

            $.ajax({
                url     : action,
                type    : 'POST',
                data    : formData,
                dataType: 'json',
                success : function(result) {
                    if(result != 2) { // success
                        if(result.hasOwnProperty('errors')) {
                            displayErrors(errorUL, form, result.errors);
                        } else {

                            postNewValues (result, initialDisplay);

                            closeEdit(form.parent(), initialDisplay);
                        }

                        //re-enable form inputs
                        inputs.prop("disabled", false);

                    }
                }

            });


        });

    }

    function openEditForm(editForm,editFormContainer,initialDisplay) {
        editForm.on('click', function(e) {
            e.preventDefault();

            openEdit(editFormContainer, initialDisplay);

        });
    }

    function cancelEditForm(cancelBtn,errors,editFormContainer, initialDisplay) {
        cancelBtn.on('click', function(e) {
            e.preventDefault();

            hideErrors(errors);
            closeEdit(editFormContainer, initialDisplay);

        });

    }


    // personal details     
    openEditForm(edPd,diPdF,diPd);
    completeAjaxCall(pdForm, diPd, pdErrors);
    cancelEditForm(caPdF,pdErrors,diPdF, diPd);

    // career summary 
    openEditForm(edCs,diCsF,diCs);
    completeAjaxCall(csForm, diCs, csErrors);
    cancelEditForm(caCsF,csErrors,diCsF, diCs);

    // education 
    openEditForm(edEdu,diEduF,diEdu);
    cancelEditForm(caEduF,EduErrors,diEduF, diEdu);



});