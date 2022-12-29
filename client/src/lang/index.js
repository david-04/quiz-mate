import {setTranslations, setDefaultLanguage, setLanguage} from 'react-switch-lang';
import pl from './pl.json'
import en from './en.json'

export const languages = ['pl', 'en'];

export const currentLang = localStorage.getItem('lang') || languages.find(el => navigator.language.startsWith(el)) || 'en';

setTranslations({pl, en});
setDefaultLanguage('en');
setLanguage(currentLang);

export const changeLanguage = key => {
    localStorage.setItem('lang', key);
    window.location.reload();
};