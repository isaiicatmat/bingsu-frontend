/* eslint-disable @typescript-eslint/no-explicit-any */
export function getFmtAmount(amount: number) {
    return new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(amount);
}

export function getFmtDate(date: any) {
    return new Date(date._seconds * 1000).toISOString().substr(0, 10);
}
