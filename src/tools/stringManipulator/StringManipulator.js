import React, { Component } from 'react';

export default class StringManipulator extends Component {
    static toTitleCase = (completeStr) => {
        return completeStr.split(" ").map(str => {
            const titleCaseArr = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            return titleCaseArr;
        }).join(" ")
    }

    static MACAddressFormatter = (mac) => {
        const re = /([a-f0-9]{2})([a-f0-9]{2})/i;
        let str = mac.replace(/[^a-f0-9]/ig, "");

        while (re.test(str)) {
            str = str.replace(re, '$1:$2');
        }

        const formattedMAC = str.slice(0);
        return formattedMAC;
    }

    static serialNumberFormatter = (serialNum) => {
        const lengthOfSN = 10;
        if (serialNum.length >= lengthOfSN){
            let reversed = StringManipulator.reverseString(serialNum).replace(/[^a-z0-9]/ig, "");
            let reversedFormatted =  reversed.slice(0,6) + "-" + reversed.slice(6,8) + "-" + reversed.slice(8);
            return StringManipulator.reverseString(reversedFormatted);
        }
        return serialNum;
    }

    static reverseString = (str) => {
        let reversed = "";
        for (let i = str.length - 1; i >= 0; i--) {
            reversed += str.charAt(i);
        }
        return reversed;
    }
}