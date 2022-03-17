import { UserLogin } from "../interfaces";

const KEY = ''

export const setToLocalStorage = (key: string, value: any) => {
    key = `${KEY}${key}`;
    localStorage.setItem(key, value);
}

export const getLocalStorage = (key: string): string | null => {
    key = `${KEY}${key}`;
    return localStorage.getItem(key);
}

export const removeLocalStorageItem = (key: string) => {
    key = `${KEY}${key}`;
    localStorage.removeItem(key);
}

export const getUserLogin = (): UserLogin | null => {
    const userLogin = getLocalStorage('userLogin');
    if (userLogin) {
        return JSON.parse(userLogin);
    }
    return null;
}

export const setUserLogin = (userLogin: UserLogin) => {
    localStorage.setItem('userLogin', JSON.stringify(userLogin));
}

export const removeUserLogin = () => {
    localStorage.removeItem('userLogin');

}