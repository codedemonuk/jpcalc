function FineCalculatorViewModel() {

    "use strict";
    
	this.courtCosts = ko.observable(85);
	this.percentage = ko.observable(1.50);
	this.discount = ko.observable(1.0);
	this.other = ko.observable(0.0);
	this.fineLevel = ko.observable(5);
	this.rounding = ko.observable(true);
	this.income = ko.observable(400);
	this.incomePeriod = ko.observable('weekly');

	this.weeklyIncome = ko.computed(function () {
		if (this.incomePeriod() === 'annual') {
			return this.income() / 52;
		} else if (this.incomePeriod() === 'monthly') {
			return this.income() * 12 / 52;
		}
		return this.income();
	}, this);

	this.fine = ko.computed(function () {
		var calculatedFine = this.weeklyIncome() * this.percentage() * this.discount(),
		    totalShouldBeRounded = this.rounding();

		if (totalShouldBeRounded) {
			calculatedFine = 5 * Math.round(calculatedFine / 5);
		}
			
		switch (Number(this.fineLevel())) {
        case 1:
            return calculatedFine < 200 ? calculatedFine : 200;
        case 2:
            return calculatedFine < 500 ? calculatedFine : 500;
        case 3:
            return calculatedFine < 1000 ? calculatedFine : 1000;
        case 4:
            return calculatedFine < 2500 ? calculatedFine : 2500;
        default: // Level 5
            return calculatedFine < 5000 ? calculatedFine : 5000;
		}
	}, this);

	this.victimSurcharge = ko.computed(function () {
		var calculated = Math.round(this.fine() * 0.1);
		if (calculated < 20) {
			return 20;
		}
		if (calculated > 120) {
			return 120;
		}
		return calculated;
	}, this);

	this.total = ko.computed(function () {
		return Number(this.fine()) + Number(this.other()) +  Number(this.courtCosts()) + Number(this.victimSurcharge());
	}, this);

	// methods
	this.defaultIncome = function () {
		this.income(400);
		this.incomePeriod('weekly');
	};

	this.defaultUnemployedIncome = function () {
		this.income(110);
		this.incomePeriod('weekly');
	};
}

ko.applyBindings(new FineCalculatorViewModel());