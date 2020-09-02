export const sleep = (timeout: number): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => {
        resolve(true)
    }, timeout));
}