const assert = require('assert');
const SettingsBill = require('../settings-bill');

describe('settings-bill', function(){

    const settingsBill = SettingsBill();

    it('should be able to keep track of the calls made', function(){
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        assert.equal(2, settingsBill.actionsFor('call').length);
    });

    it('should be able to keep track of the smss made', function(){
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(3, settingsBill.actionsFor('sms').length);
    });

     it('should calculate the totals for sms, call and the grand total', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 0.75,
            callCost: 2.75,
            warningLevel: 10,
            criticalLevel: 20
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(0.75, settingsBill.totals().smsTotal);
        assert.equal(2.75, settingsBill.totals().callTotal);
        assert.equal(3.50, settingsBill.totals().grandTotal);

    });
    it('should calculate the total for calls made and smss sent', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 0.75,
            callCost: 2.75,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(1.50, settingsBill.totals().smsTotal);
        assert.equal(5.50, settingsBill.totals().callTotal);
        assert.equal(7.00, settingsBill.totals().grandTotal);

    });

    it('should return true when the warning level is reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('should return true when the critical level is reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });
});