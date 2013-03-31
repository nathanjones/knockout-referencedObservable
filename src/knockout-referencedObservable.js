(function(){
//Referenced observables shadow a property on an underlying viewModel
var referencedObservable = function(property, target, deferred) {
    if (!property || !target) throw new Error('You must pass in a property to be referenced and the model that contains the property');

    var unwrappedTarget = ko.utils.unwrapObservable(target);
    
    if (!unwrappedTarget[property]) throw new Error('The passed-in model has no property ' + property + ' to reference');
    if (!ko.isObservable(unwrappedTarget[property])) throw new Error(property + ' is not an observable');
    
    // if the custom extensions observable exists, use it to pass on the extensions
    var extensions = ko.isObservable(unwrappedTarget[property].extensions)
        ? unwrappedTarget[property].extensions()
        : {};

    deferred = deferred || true;

    var reference = ko.computed({
        read: function() {
            var self = ko.utils.unwrapObservable(this);
            
            if (typeof self[property] == "function") {
                return self[property]();
            } else {
                return undefined;
            }
            
        },  
        write: function(value) {
            var self = ko.utils.unwrapObservable(this);
            
            if (typeof self[property] == "function") {
                return self[property](value);
            } 
        },         
        owner: target,
        deferEvaluation: deferred
    });
    reference.extend(extensions);

    return reference;
};


// add referencedObservable to ko namespace
ko.referencedObservable = referencedObservable;

})();