import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import './LanguageSwitcher.css'
 
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
 
  const changeLanguage = (selectedOption) => {
    const lang = selectedOption.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
 
  const options = [
    { value: 'fr', label: 'FR' },
    { value: 'en', label: 'EN' },
  ];
 
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      width: '80px',
      borderRadius: '5px',
      borderColor: '#ced4da',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#a1a1a1',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 8px',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '14px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : null,
      color: state.isSelected ? 'white' : 'black',
      fontSize: '14px',
      padding: '8px 12px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '5px',
      border: '1px solid #ced4da',
     
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 8px',
     
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };
 
  return (
    <div className="language-switcher">
      <Select
        defaultValue={options.find(option => option.value === i18n.language)}
        options={options}
        onChange={changeLanguage}
        styles={customStyles}
      />
    </div>
  );
};
 
export default LanguageSwitcher;