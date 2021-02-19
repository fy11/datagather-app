export default function xmlToJson(xmlStr) {
    xmlStr= xmlStr.replace(/&lt;/g,'<');//防止有转义字符
    xmlStr=  xmlStr.replace(/&gt;/g,'>');
    xmlStr=  xmlStr.replace(/&amp;/g,'&');
    var str1 = "",str2 = "",str3 = "";
    let str =xmlStr;
    let start1 = false;
    let start2 = false;
    var arr = [];
    for(let i =0;i<str.length;i++){
        let s = str[i];
        if(start1&&s!==">"&&s!=='<'){
            str1+=s;
        }else if(str1!==""){
            arr.push(str1);
            str1 = "";
        }
        if(start2&&s!==">"&&s!=='<'){
            str2+=s;
        }else if(str2!==""){
            arr.push(str2);
            str2 = "";
        }
        if(s==='<'){
            start1 = true;
            start2 = false;
        }
        if(s==='>'){
            start1 = false;
            start2 = true;
        }


    }
    var json = {};
    for(let i = 0;i<arr.length-2;i++){
        let strtemp = arr[i+2];



        if(strtemp.length>2 && strtemp===("/"+arr[i])){

            strtemp =strtemp.substring(1,strtemp.length);

            if(arr[i] === strtemp){
                json[arr[i]]=arr[i+1];
            }
        };
    }

    return json;
}
