
"use strict";

micro.Animate = new function() {

    function multiAnimator(element, properties, interval, deltas, propValues, targetValues, postfixes) {
        this._element    = element;
        this._properties = properties;
        this._interval   = interval;
        this._deltas     = deltas;
        this._propValues = propValues;
        this._targetVals = targetValues;
        this._postfixes  = postfixes;
        this._intervalID = setInterval(function(self){
            var done = true;
            for(var x = 0; x < self._properties.length; ++x){
                self._propValues[x] += self._deltas[x];
                if(Math.abs(self._targetVals[x] - self._propValues[x]) < 0.00001)
                    self._propValues[x] = self._targetVals[x];
                else
                    done = false;
                if(self._postfixes[x]){
                    self._element.style[self._properties[x]] = self._propValues[x] + self._postfixes[x];
                } else {                    
                    self._element.style[self._properties[x]] = self._propValues[x];
                }
                //console.log(self._element.tag + ' ' + self._properties[x] + ': ' + self._propValues[x]);
            }
            if(done)
                clearInterval(self._intervalID);
        },interval,this)
    };

    function animator(element, property, interval, delta, propValue, targetVal, postfix) {
        this._element   = element;
        this._property  = property;
        this._delta     = delta;
        this._propValue = propValue;
        this._targetVal = targetVal;
        this._postfix   = postfix;
        this._intervalID = setInterval(function(self){
            self._propValue += self._delta;
            if(self._propValue >= self._targetVal)
                self._propValue = self._targetVal;
            if(self._postfix){
                self._element.style[self._property] = self._propValue + postfix;
                console.log(self._element.tag + ' ' + self._property + ': ' + self._propValue);
            }
            else {
                self._element.style[self._property] = self._propValue;
                console.log(self._element.tag + ' ' + self._property + ': ' + self._propValue);
            }
            if(self._propValue == self._targetVal) 
                clearInterval(self._intervalID)
        },interval,this);
    };

    this.createAnimator = function(element, property, target, length, fps) {        
        var _propVal   = parseInt(element.style[property].replace( /[a-zA-Z]+/, '')),
            _propVal   = !!_propVal
                       ? _propVal
                       : 0, 
            _targetVal = typeof(target) == 'number'
                       ? target
                       : parseInt(target.replace( /[a-zA-Z]+/, '')),
            _postfix   = typeof(target) == 'string'
                       ? target.replace( /[0-9]+/g, "")
                       : '',
            _interval  = 1000 / fps,
            _steps     = Math.floor(length / _interval),
            _steps     = _steps <= 0
                       ? 1
                       : _steps,
            _delta     = (_targetVal - _propVal) / _steps;
            return new animator(element, property, _interval, _delta, _propVal, _targetVal, _postfix);            
    };

    function createPropVals(element, properties){
        var results = [];
        for(var x = 0; x < properties.length; ++x){
            results.push(parseInt(element.style[properties[x]].replace( /[a-zA-Z]+/, '')));
            results[x] = !!results[x]
                       ? results[x]
                       : 0;
        }
        return results;
    };

    function createTargetVals(targets){
        var results = [];
        for(var x = 0; x < targets.length; ++x){
            results.push( typeof(targets[x]) == 'number'
                         ? targets[x]
                         : parseInt(targets[x].replace( /[a-zA-Z]+/, '')) 
            );
        }
        return results;
    };

    function createPostfixes(targets){
        var results = [];
        for(var x = 0; x < targets.length; ++x){
            results.push(typeof(targets[x]) == 'string'
                        ? targets[x].replace( /[0-9]+/g, '')
                        : ''
            );
        }
        return results;
    }

    function createDeltas(propertyValues, targetValues, steps){
        var results= [];
        for(var x = 0; x < propertyValues.length; ++x){
            results.push((targetValues[x] - propertyValues[x]) / steps);
        }
        return results;
    }

    this.createMultiAnimator = function(element, properties, targets, length, fps){
        var _interval   = Math.floor(1000 / fps),
            _steps      = Math.floor(length / _interval),
            _steps      = _steps <= 0
                        ? 1
                        : _steps,
            _propVals   = createPropVals(element, properties),
            _targetVals = createTargetVals(targets),
            _postfixes  = createPostfixes(targets),
            _deltas     = createDeltas(_propVals, _targetVals, _steps);
        return new multiAnimator(
           element,
           properties,
           _interval,
           _deltas,
           _propVals,
           _targetVals,
           _postfixes
        ); 
    };

    this.createGenericMultiAnimator = function(element, propObject){
        var props = [],
            vals  = [],
            propertyNames = Object.getOwnPropertyNames(propObject);
        for(var x = 0; x < propertyNames.length; ++x){
            if(propertyNames[x] === 'animatorLength'
            || propertyNames[x] === 'animatorFPS') continue;
            props.push(propertyNames[x]);
            vals.push(propObject[propertyNames[x]]);
        }
        return this.createMultiAnimator(
            element, 
            props, 
            vals,
            propObject.animatorLength || 250,
            propObject.animatorFPS    || 30
        );
    };

    this.applyCreateGenericMultiAnimator = function applyCreateGenericMultiAnimator(applyTo){
        if(applyTo.prototype.animate)
            throw 'Cannot apply CreateGenericMultiAnimator to an object that already' +
                  'defines an animate function.';
        applyTo.prototype.animate = function(animationProperties){
            micro.Animate.createGenericMultiAnimator(this.element, animationProperties);
        }
    };

    (function(self){
        if(micro.queryObject && !micro.queryObject.prototype.animate){
            self.applyCreateGenericMultiAnimator(micro.queryObject);
        }
    })(this);
}