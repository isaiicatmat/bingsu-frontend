
export function subtractDays(date = new Date(), numOfDays: number,) {
    date.setDate(date.getDate() - numOfDays);
    return date;
}

export function addDays(date = new Date(), numOfDays: number,) {
    date.setDate(date.getDate() + numOfDays);
    return date;
}

export function getLastDayOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getDaysBetweenSeconds(startDateSeconds: number, endDateSeconds: number) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const clientTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const startDate = new Date(startDateSeconds * 1000);
    const endDate = new Date(endDateSeconds * 1000);
    const fmtStartDate = new Date(startDate.getTime() + clientTimezoneOffset);
    const fmtEndDate = new Date(endDate.getTime() + clientTimezoneOffset);
    const weekdays = [1, 2, 3, 4, 5];
    const exemptedDates = [
        [1, 1], // January 1st - Año Nuevo
        [5, 1], // May 1st - Día del Trabajo
        [9, 16], // September 16th - Día de la Independencia
        // 1st of December every six years - Transmisión del Poder Ejecutivo Federal
        [12, 1, 2024], // 2024
        [12, 1, 2030], // 2030
        [12, 1, 2036], // 2036
        [12, 1, 2042], // 2042
        [12, 25] // December 25th - Navidad
    ];

    const recurringDates = [
        { month: 2, occurrence: 1, day: 1 }, // First Monday of February - Día de la Constitución
        { month: 3, occurrence: 3, day: 1 }, // Third Monday of March - Natalicio de Benito Juárez
        { month: 11, occurrence: 3, day: 1 }, // Third Monday of November - Día de la Revolución
    ];

    let days = 0;
    let currentDate = fmtStartDate;

    while (currentDate <= fmtEndDate) {
        const dayOfTheMonth = currentDate.getDate();
        if (weekdays.includes(currentDate.getDay())
            && !exemptedDates.some(([month, day, year]) => 
                currentDate.getMonth() + 1 === month 
                && dayOfTheMonth === day
                && (year === undefined || currentDate.getFullYear() === year)
            ) 
            && !recurringDates.some(({month, occurrence, day}) => 
                currentDate.getMonth() + 1 === month && getWeekDayOccurences(currentDate, day, occurrence)
            )
        ) {
            days++;
        }
        currentDate = new Date(currentDate.getTime() + millisecondsPerDay);
    }
    return days;
}

function getWeekDayOccurences (date: Date, targetDay: number, occurrence: number){
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const firstDayOfMonth = new Date(year, month, 1);
    
    if (day === targetDay && firstDayOfMonth.getMonth() === month) {
        if (Math.floor((date.getDate() - 1) / 7) === (occurrence - 1) ) {
            return true;
        }
    }
    return false;
}

export function getWorkDaysBetweenPeriod(startDate: string,lastDate: string) {
    const firstDate = new Date(startDate);
    const endDate = new Date(lastDate);
    const workDates = [];

    while (firstDate.getTime() <= endDate.getTime()) {
        if (firstDate.getDay() >= 0 && firstDate.getDay() < 5) {
            const date = new Date(firstDate.getTime());
            date.setUTCHours(6, 0, 0, 0);
            workDates.push(date);
        }
        firstDate.setDate(firstDate.getDate() + 1)
    }
    return workDates;
}

export function getFmtDate(date: string | Date) {
    return new Date(date).toISOString().slice(0, 10);
}

export function subtractYears(date: string | Date, numberOfYears: number){
    return new Date(date).setFullYear(new Date(date).getFullYear() - numberOfYears);
}

export function addYears(date: string | Date, numberOfYears: number){
    return new Date(date).setFullYear(new Date(date).getFullYear() + numberOfYears);
}

export function getDateFromSeconds(seconds: number){
    return new Date(seconds * 1000);
}

export function getFmtDateWithHours(date: Date){
    return date.toLocaleDateString('es-MX',{ hour: '2-digit', minute: '2-digit', hour12: true })
}

export function getFmtHour(date: Date){
    return date.toLocaleTimeString('ex-MX', {hour:'2-digit', minute: '2-digit' ,hour12: true});
}
