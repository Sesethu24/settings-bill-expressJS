const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

module.exports = function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    let actionList = [];

    function setSettings(settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }

    function getSettings
        () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {
       if(!colorStopper()){
        let cost = 0;
        if (action === 'sms') {
            cost = smsCost;
        }
        else if (action === 'call') {
            cost = callCost;
        }

        actionList.push({
            type: action,
            cost,
            timestamp: moment(new Date()).fromNow()
        });
    }
    }
    function actions() {
        return actionList;
    }

    function actionsFor(type) {
        const filteredActions = [];


        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];

            if (action.type === type) {

                filteredActions.push(action);
            }
        }

        return filteredActions;


    }

    function getTotal(type) {
        let total = 0;

        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];

            if (action.type === type) {

                total += action.cost;
            }
        }
        return total;


    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms')
        let callTotal = getTotal('call')

        return {
            smsTotal: smsTotal.toFixed(2),
            callTotal: callTotal.toFixed(2),
            grandTotal: grandTotal().toFixed(2)
        }
    }

    function hasReachedWarningLevel() {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel() {
        const total = grandTotal();
        return total >= criticalLevel;
    }
    function colorChanger() {
        if (totals().grandTotal >= criticalLevel) {
          return "danger";
        } else if (
          totals().grandTotal >= warningLevel &&
          totals().grandTotal <= criticalLevel
        ) {
          return "warning";
        } else {
          return "";
        }
      }
    
      function colorStopper() {
        
        return grandTotal() >= criticalLevel;
      }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        colorChanger,
        colorStopper
    }
}