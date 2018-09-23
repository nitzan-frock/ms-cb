import React, {
    Component
} from 'react';

export default class StringManipulator extends Component {
    static toTitleCase(completeStr) {
        return completeStr.split(" ").map(str => {
            const titleCaseArr = str.charAt(0).toUpperCase() + str.slice(1);
            return titleCaseArr;
        }).join(" ")
    }

    static MACAddressFormatter(mac) {
        const re = /([a-f0-9]{2})([a-f0-9]{2})/i;
        let str = mac.replace(/[^a-f0-9]/ig, "");

        while (re.test(str)) {
            str = str.replace(re, '$1:$2');
        }

        const formattedMAC = str.slice(0);
        return formattedMAC;
    }

    static serialNumberFormatter(serialNum) {
        let reversed = "";
        console.log("snformatter: " + serialNum.length);
        for (let i = serialNum.length-1; i >= 0; i--){
            reversed += serialNum.charAt(i);
        }
        console.log(reversed);
        let reversedFormatted;
        if (reversed.charAt(6) !== "-") {
            reversedFormatted = reversed.slice(0,6) + "-" + reversed.slice(6);
        }
        if (reversed.charAt(9) !== "-"){
            reversedFormatted = reversedFormatted.slice(0,9) + "-" + reversed.slice(8);
        }
        return reversedFormatted;
    }
}