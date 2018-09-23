export default class StringManipulator {
    static toTitleCase (completeStr) {
        return completeStr.split(" ").map(str => {
            const titleCaseArr = str.charAt(0).toUpperCase() + str.slice(1);
            return titleCaseArr;
        }).join(" ")
    }

    static MACAddressFormatter (mac) {
        const re = /([a-f0-9]{2})([a-f0-9]{2})/i;
        let str = mac.replace(/[^a-f0-9]/ig, "");

        while(re.test(str)){
            str = str.replace(re, '$1:$2');
        }
        
        const formattedMAC = str.slice(0);
        return formattedMAC;
    }

    static serialNumberFormatter (serialNum) {
        const regexPrefix = /(pa|pa2|pa4|ca|vpa|vf)/i;
        const regexYear = /[0-9]{2}/;
        const regexNumber = /([0-9]{6})|([a-z][0-9]{5})/i;
        let str = serialNum.replace(/[\W\s\._\-]+/ig, "");
        const derp = [2, 3, 1,5 ,3];
        console.log("derp: " + derp[3]);
        const productPrefix = str.match(regexPrefix);
        const productYear = str.match(regexYear);
        const productNumber = str.match(regexNumber);
        console.log(productPrefix);
    }
}