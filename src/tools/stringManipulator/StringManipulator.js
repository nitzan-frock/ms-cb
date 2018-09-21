export default class StringManipulator {
    static toTitleCase (completeStr) {
        return completeStr.split(" ").map(str => {
            const titleCaseArr = str.charAt(0).toUpperCase() + str.slice(1);
            return titleCaseArr;
        }).join(" ")
    }
}