function calculateTotalTarget(startDate, endDate, totalAnnualTarget, excludedDays = [5]) {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Helper function to check if a day is excluded
    function isExcludedDay(date, excludedDays) {
      return excludedDays.includes(date.getDay());
    }
  
    // Function to calculate non-excluded working days in a month
    function getWorkingDaysExcludingSpecified(year, month, excludedDays) {
      let workingDays = 0;
      let daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
  
      for (let day = 1; day <= daysInMonth; day++) {
        let date = new Date(year, month, day);
        if (!isExcludedDay(date, excludedDays)) {
          workingDays++;
        }
      }
      return workingDays;
    }
  
    // Function to get working days for a specific range within a month
    function getWorkedDaysExcludingSpecified(start, end, excludedDays) {
      let workingDays = 0;
      let currentDate = new Date(start);
      while (currentDate <= end) {
        if (!isExcludedDay(currentDate, excludedDays)) {
          workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return workingDays;
    }
  
    let monthlyData = [];
    let totalWorkedDays = 0;
  
    // Loop through each month in the date range
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      let monthStart = (year === start.getFullYear()) ? start.getMonth() : 0;
      let monthEnd = (year === end.getFullYear()) ? end.getMonth() : 11;
  
      for (let month = monthStart; month <= monthEnd; month++) {
        let firstDayOfMonth = new Date(year, month, 1);
        let lastDayOfMonth = new Date(year, month + 1, 0);
  
        // Get total working days for the whole month, excluding specified days
        let workingDaysInMonth = getWorkingDaysExcludingSpecified(year, month, excludedDays);
        
        // Calculate working days within the actual range
        let rangeStart = (start > firstDayOfMonth) ? start : firstDayOfMonth;
        let rangeEnd = (end < lastDayOfMonth) ? end : lastDayOfMonth;
  
        let workedDays = getWorkedDaysExcludingSpecified(rangeStart, rangeEnd, excludedDays);
  
        totalWorkedDays += workedDays;
  
        monthlyData.push({
          month,
          year,
          workingDaysInMonth,
          workedDays
        });
      }
    }
  
    // Calculate the proportional target for each month
    let totalTarget = 0;
    let monthlyTargets = monthlyData.map(data => {
      let proportion = data.workedDays / totalWorkedDays;
      let monthlyTarget = proportion * totalAnnualTarget;
      totalTarget += monthlyTarget;
      return monthlyTarget;
    });
  
    return {
      daysExcludingFridays: monthlyData.map(data => data.workingDaysInMonth),
      daysWorkedExcludingFridays: monthlyData.map(data => data.workedDays),
      monthlyTargets: monthlyTargets,
      totalTarget: totalTarget
    };
  }
  
  // Example usage:
  let result = calculateTotalTarget('2024-01-01', '2024-03-31', 5220);
  console.log(result);
  
  // Example with excluding Sundays (0) instead of Fridays:
  let resultWithSundaysExcluded = calculateTotalTarget('2024-01-01', '2024-03-31', 5220, [0]);
  console.log(resultWithSundaysExcluded);
  