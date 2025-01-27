exports.formatPageTitle = (page) => {
    return page
        .split(/(?=[A-Z])|_/) 
        .map((word) => word.toLowerCase()) 
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(' '); 
};

exports.formatNumberWithCommas = (x) => {
	x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

exports.convertTime = (value, unit) => {
    const averageDaysInMonth = 30;

    if (unit === 'months') {
        return value * averageDaysInMonth;
    } else if (unit === 'days') {
        const months = Math.floor(value / averageDaysInMonth);
        const remainingDays = value % averageDaysInMonth;
        return months;
    } else {
        return 0;
    }
}