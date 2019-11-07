
/*------------------------------------------------
jQuery でプログラム的にテーブルを作成する
--------------------------------------------------*/
// jQuery start
// create table
// rows  :500
// cells :6
const memoryTableMaxRow = 500;
const stackTableMaxRow = 200;
$(document).ready(function () {
    //bootstrapのtooltipの初期化
        $('[data-toggle="tooltip"]').tooltip();
    var r_end = memoryTableMaxRow;  // 行数
    var c_end = 8;  // 列数 
    memory_Area = document.getElementById('memory_area');
    stack_Area = document.getElementById('stack_area');
    var tableJQ = $('<table id="Memorytable">');
    for (var r = 0; r < r_end; r++) {
        var r000 = toHex(r);
        var trJQ_r = $('<tr></tr>').appendTo(tableJQ);
        for (var c = 0; c < c_end; c++) {
            var c000 = c;
            if(c == 0){
                $('<td>' + r000 + '</td>').appendTo(trJQ_r);
            }else if(c == 1){
                $('<td>' +  r + ':' + '</td>').appendTo(trJQ_r);
            }else if(c == 2){
                $('<td>#0000</td>').appendTo(trJQ_r);
            }else if(c == 3){
                $('<td>0</td>').appendTo(trJQ_r);
            }else if(c == 4){
                $('<td>0</td>').appendTo(trJQ_r);
            }else if(c == 5){
                $('<td>0000 0000 0000 0000</td>').appendTo(trJQ_r);
            }else if (c==7){
                $('<td hidden> </td>').appendTo(trJQ_r);

            }else{
                $('<td> </td>').appendTo(trJQ_r);

            }            
       }
    }
    $(memory_Area).append(tableJQ);
    var r_end = stackTableMaxRow;
    tableJQ = $('<table id="Stacktable">');
    for (var r = 0; r < (r_end + 1); r++) {
        var r000 = toHex(65537 - ((r_end + 2) - r));
        var trJQ_r = $('<tr></tr>').appendTo(tableJQ);
        for (var c = 0; c < c_end; c++) {
            var c000 = c;
            if(c == 0){
                $('<td>' + r000 + '</td>').appendTo(trJQ_r);
            }else if(c == 1){
                $('<td>#0000</td>').appendTo(trJQ_r);
            }else if(c == 2){
                $('<td>0</td>').appendTo(trJQ_r);
            }else if(c == 3){
                $('<td>0</td>').appendTo(trJQ_r);
            }else if(c == 4){
                $('<td>0000 0000 0000 0000</td>').appendTo(trJQ_r);
            }              
       }
    }
    $(stack_Area).append(tableJQ);
    let stacktable = document.getElementById('Stacktable');
    let stackPosition = stacktable.rows[r_end].offsetTop;
    $(stack_Area).scrollTop(stackPosition);
    //input Modal hide Event
    $('#inputModal').on('hide.bs.modal',function(e){
        let inputdata = $('#input').val();;
        let inputlength = inputdata.length;
        
        memoryAllSet(registerUdecGet(2),inputlength);
        for(let i = 0;i < inputlength && i<=256 ;i++){
            memoryLabelSet(registerUdecGet(1)+i,memoryLabelGet(registerUdecGet(1)+i)+'  "'+inputdata[i]+'"');
            memoryAllSet(registerUdecGet(1)+i,wordcode(inputdata[i]));
        }
    });
});

// toBin 2進数に変換する
// 引数 
// v        :  値
// 戻り値
// string   :  値
function toBin(v) {
    if(v >= 0){
        v = (('0000000000000000' + v.toString(2).toUpperCase()).substr(-16));
    }else{
        v = v >>> 0;
        v = (('0000000000000000' + v.toString(2).toUpperCase()).substr(-16));
    }
    let bin = "";
    for(let i = 1 ; i <= v.length ; i++){
        bin += v[i-1];
        if(i % 4 == 0 && i != v.length){
            bin +=" ";
        }
    }
    return bin
}

// toHex 16進数に変換する
// 引数 
// v        :  値
// 戻り値
// string   :  値
function toHex(v) {
    if(v >= 0){
        return '#' + (('0000' + v.toString(16).toUpperCase()).substr(-4));
    }else{
        v = v >>> 0;
        return '#' + (('0000' + v.toString(16).toUpperCase()).substr(-4));
    }
}

// toSdecOver 符号あり10進数のオーバーフローを検知、整形する
// 引数 
// v        :  値
// 戻り値
// string   :  値
function toSdecOver(v){
    v = v&0xFFFF;
    if(v > 0 &&v <= 0x7FFF){
        v = '+' + v;
    }
    else{
        v = ((~v+1)&0xFFFF);
        if(v >0){
            v='-'+v;
        }
    }
    return v
}

// toUdecOver 符号なし10進数のオーバーフローを検知、整形する
// 引数 
// v        :  値
// 戻り値
// v        :  値
function toUdecOver(v){
    if(v > 65535){
        v = (v - 1) % 65535;
    }else if(v < 0){
        v = 65535 + (v + 1)%65535;
    }
    return v&0xFFFF
}

// registerHexSet Registertableの16進数の値を書き換える
// 引数 
// address  :  Registertableの番地
// value    :  値
function registerHexSet(address,value){
    let table = document.getElementById('Registertable');
    table.rows[ address ].cells[ 1 ].firstChild.data = toHex(value);
}

// registerUdecSet Registertableの符号なし10進数の値を書き換える
// 引数 
// address  :  Registertableの番地
// value    :  値
function registerUdecSet(address,value){
    let table = document.getElementById('Registertable');
    table.rows[ address ].cells[ 2 ].firstChild.data = toUdecOver(value);
}

// registerSdecSet Registertableの符号あり10進数の値を書き換える
// 引数 
// address  :  Registertableの番地
// value    :  値
function registerSdecSet(address,value){
    let table = document.getElementById('Registertable');
    table.rows[ address ].cells[ 3 ].firstChild.data = toSdecOver(value);
}

// registerBinSet Registertableの2進数の値を書き換える
// 引数 
// address  :  Registertableの番地
// value    :  値
function registerBinSet(address,value){
    let table = document.getElementById('Registertable');
    table.rows[ address ].cells[ 4 ].firstChild.data = toBin(value);
}

// registerScrollset Registertableの要素位置にスクロールを設定する
// 引数 
// address  :  Registertableの番地
function registerScrollset(address){
    let table = document.getElementById('Registertable');
    let register_Area = document.getElementById('register_area');
    let position;
    if(address >= 0 && address <= 7){
        position = table.rows[address+3].offsetTop
    }else if(address == 8||address == 9){
        position = table.rows[address-7].offsetTop
    }else if(address == 10){
        position = table.rows[address-10].offsetTop
    }
    $(register_Area).scrollTop(position);
}

// registerAllSet Registertableの2進数、符号なし10進数、符号あり10進数、16進数の値を書き換える
// 引数 
// address  :  Registertableの番地
// value    :  値
function registerAllSet(address,value){
    let adr = parseInt(address, 10);
    if(address >= 0 && address <= 7){
        adr += 3;
    }else if(address == 8||address == 9){
        adr -= 7;
    }
    registerHexSet(adr,value);
    registerUdecSet(adr,value);
    registerSdecSet(adr,value);
    registerBinSet(adr,value);
}

// registerHexGet Registertableの16進数の値を取得する
// 引数 
// address  :  Registertableの番地
// 戻り値
// string   :  値
function registerHexGet(address){
    if(address >= 0 && address <= 7){
        address += 3;
    }else if(address == 8||address == 9){
        address -= 7;
    }
    let table = document.getElementById('Registertable');
    var v = table.rows[ address ].cells[ 1 ].firstChild.data;
    v = parseInt(v.replace('#',''), 16);
    return v
}

// registerUdecGet Registertableの符号なし10進数の値を取得する
// 引数 
// address  :  Registertableの番地
// 戻り値
// string   :  値
function registerUdecGet(address){
    let adr = parseInt(address,10);
    if(address >= 0 && address <= 7){
        adr += 3;
    }else if(address == 8||address == 9){
        adr -= 7;
    }
    let table = document.getElementById('Registertable');
    var v = table.rows[ adr ].cells[ 2 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}
// prUdecGet PrograCounter get value 
// 戻り値
// int   :  値
function prUdecGet(){
    return parseInt(registerUdecGet(8),10);
}
function prValueSet(value){
    let pr = prUdecGet();
    memoryTableRowColorSet(pr,"#FFFFFF");
    memoryTableRowColorSet(value,"#FF0000");
    memoryScrollset(value);
    registerAllSet(8,value);
    selectLine(memoryLineGet(pr));
}
// registerSdecGet Registertableの符号あり10進数の値を取得する
// 引数 
// address  :  Registertableの番地
// 戻り値
// string   :  値
function registerSdecGet(address){
    let adr = parseInt(address,10);
    if(address >= 0 && address <= 7){
        adr += 3;
    }else if(address == 8||address == 9){
        adr -= 7;
    }
    let table = document.getElementById('Registertable');
    var v = table.rows[ adr ].cells[ 3 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// registerBinGet Registertableの2進数の値を取得する
// 引数 
// address  :  Registertableの番地
// 戻り値
// string   :  値
function registerBinGet(address){
    if(address >= 0 && address <= 7){
        address += 3;
    }else if(address == 8||address == 9){
        address -= 7;
    }
    let table = document.getElementById('Registertable');
    var v = table.rows[ address ].cells[ 4 ].firstChild.data;
    v = parseInt(v.replace(/ /g,''), 2);
    return v
}

// memoryHexSet Memorytableの16進数の値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryHexSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 2 ].firstChild.data = toHex(value);
}
// memoryUdecSet Memorytableの符号なし10進数の値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryUdecSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 3 ].firstChild.data = toUdecOver(value);
}

// memorySdecSet Memorytableの符号あり10進数の値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memorySdecSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 4 ].firstChild.data = toSdecOver(value);
}

// memoryBinSet Memorytableの2進数の値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryBinSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 5 ].firstChild.data = toBin(value);
    
}

// memoryLiteralSet MemorytableのLiteralの値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryLiteralSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 6 ].firstChild.data = value;
}

// memoryScrollset Memorytableの要素位置にスクロールを設定する
// 引数 
// address  :  Memorytableの番地
function memoryScrollset(address){
    let table = document.getElementById('Memorytable');
    let memory_Area = document.getElementById('memory_area');
    if(address-5 >=0){
        address-=5;
    }else{
        address=0;
    }
    let position = table.rows[address].offsetTop;
    $(memory_Area).scrollTop(position);
}

// memoryAllSet Memorytableの2進数、符号なし10進数、符号あり10進数、16進数の値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryAllSet(address,value){
    
    memoryHexSet(address,value);
    memoryUdecSet(address,value);
    memorySdecSet(address,value);
    memoryBinSet(address,value);
}

// memoryLabelSet Memorytableのラベルを書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryLabelSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 1 ].firstChild.data = value + ":";
}

// memoryLineSet Memorytableのラインを書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function memoryLineSet(address,value){
    let table = document.getElementById('Memorytable');
    table.rows[ address ].cells[ 7 ].firstChild.data = value;
}

// memoryLabelGet Memorytableのラベルを取得
// 引数 
// address  :  Memorytableの番地
function memoryLabelGet(address){
    let table = document.getElementById('Memorytable');
    return table.rows[ address ].cells[ 1 ].firstChild.data;
}

// memoryHexGet Memorytableの16進数の値を取得する
// 引数 
// address  :  Memorytableの番地
// 戻り値
// string   :  値
function memoryHexGet(address){
    let table = document.getElementById('Memorytable');
    return table.rows[ address ].cells[ 2 ].firstChild.data;
}

// memoryUdecGet Memorytableの符号なし10進数の値を取得する
// 引数 
// address  :  Memorytableの番地
// 戻り値
// string   :  値
function memoryUdecGet(address){
    let table = document.getElementById('Memorytable');
    var v = table.rows[ address ].cells[ 3 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// memorySdecGet Memorytableの符号あり10進数の値を取得する
// 引数 
// address  :  Memorytableの番地
// 戻り値
// string   :  値
function memorySdecGet(address){
    let table = document.getElementById('Memorytable');
    var v = table.rows[ address ].cells[ 4 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// memoryBinGet Memorytableの2進数の値を取得する
// 引数 
// address  :  Memorytableの番地
// 戻り値
// string   :  値
function memoryBinGet(address){
    let table = document.getElementById('Memorytable');
    var v = table.rows[ address ].cells[ 5 ].firstChild.data;
    v = parseInt(v.replace(/ /g,''), 2);
    return v
}

// memoryLiteralGet MemorytableのLiteralの値を取得
// 引数 
// address  :  Memorytableの番地
function memoryLiteralGet(address){
    let table = document.getElementById('Memorytable');
    return table.rows[ address ].cells[ 6 ].firstChild.data
}

// memoryLineGet Memorytableのラインを取得
// 引数 
// address  :  Memorytableの番地
function memoryLineGet(address){
    let table = document.getElementById('Memorytable');
    return parseInt( table.rows[ address ].cells[ 7 ].firstChild.data)-1;
}

// toOverflowFlagSet Overflow Flagを設定する
// 引数 
// v        :  値
function overflowFlagSet(value){
    let table = document.getElementById('Flagtable');
    if(value == 0){
        table.rows[ 1 ].cells[ 4 ].firstChild.data = 0;
        table.rows[ 1 ].cells[ 1 ].firstChild.data = '〇';
    }else{
        table.rows[ 1 ].cells[ 4 ].firstChild.data = 1;
        table.rows[ 1 ].cells[ 1 ].firstChild.data = '☆';
    }
}

// ofSdecFlagSet Overflow FlagをSdecの数字の範囲を判定して設定する
// 引数 
// value        :  値
function ofSdecFlagSet(value){
    if(value <= 32767 && value >= -32768){
        overflowFlagSet(0);
    }else{
        overflowFlagSet(1);
    }
}

// ofUdecFlagSet Overflow FlagをUdecの数字の範囲を判定して設定する
// 引数 
// value        :  値
function ofUdecFlagSet(value){
    if(value <= 65535 && value >= 0){
        overflowFlagSet(0);
    }else{
        overflowFlagSet(1);
    }
}

// toOverflowFlagGet RegistertableのOverflow Flagの値を取得する
// 戻り値
// string   :  値
function overflowFlagGet(){
    let table = document.getElementById('Flagtable');
    var v = table.rows[ 1 ].cells[ 4 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// SignFlagSet Sign Flagを設定する
// 引数 
// v        :  値
function signFlagSet(value){
    let table = document.getElementById('Flagtable');
    value = value & 0x8000;
    if(value == 0){
        table.rows[ 1 ].cells[ 5 ].firstChild.data = 0;
        table.rows[ 1 ].cells[ 2 ].firstChild.data = '正';
    }else{
        table.rows[ 1 ].cells[ 5 ].firstChild.data = 1;
        table.rows[ 1 ].cells[ 2 ].firstChild.data = '負';
    }
}

// toSignFlagGet RegistertableのSign Flagの値を取得する
// 戻り値
// string   :  値
function signFlagGet(){
    let table = document.getElementById('Flagtable');
    var v = table.rows[ 1 ].cells[ 5 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// toZeroFlagSet Zero Flagを設定する
// 引数 
// v        :  値
function zeroFlagSet(value){
    let table = document.getElementById('Flagtable');
    if(value){
        table.rows[ 1 ].cells[ 6 ].firstChild.data = 0;
        table.rows[ 1 ].cells[ 3 ].firstChild.data = 'NonZ';
    }else{
        table.rows[ 1 ].cells[ 6 ].firstChild.data = 1;
        table.rows[ 1 ].cells[ 3 ].firstChild.data = 'Zero';
    }
}

// toZeroFlagGet RegistertableのZero Flagの値を取得する
// 戻り値
// string   :  値
function zeroFlagGet(){
    let table = document.getElementById('Flagtable');
    var v = table.rows[ 1 ].cells[ 6 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// stackHexSet Stacktableの16進数の値を書き換える
// 引数 
// address  :  Stacktableの番地
// value    :  値
function stackHexSet(address,value){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    table.rows[ r_end-address ].cells[ 1 ].firstChild.data = toHex(value);
}

// stackUdecSet Stacktableの符号なし10進数の値を書き換える
// 引数 
// address  :  Stacktableの番地
// value    :  値
function stackUdecSet(address,value){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    table.rows[ r_end-address ].cells[ 2 ].firstChild.data = toUdecOver(value);
}

// stackSdecSet Stacktableの符号あり10進数の値を書き換える
// 引数 
// address  :  Stacktableの番地
// value    :  値
function stackSdecSet(address,value){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    table.rows[ r_end-address ].cells[ 3 ].firstChild.data = toSdecOver(value);
}

// stackSdecSet Stacktableの2進数の値を書き換える
// 引数 
// address  :  Stacktableの番地
// value    :  値
function stackBinSet(address,value){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    table.rows[ r_end-address ].cells[ 4 ].firstChild.data = toBin(value);
}

// stackScrollset Stacktableの要素位置にスクロールを設定する
// 引数 
// address  :  stacktableの番地
function stackScrollset(address){
    let table = document.getElementById('Stacktable');
    let stack_Area = document.getElementById('stack_area');
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let position = table.rows[r_end-address].offsetTop;
    $(stack_Area).scrollTop(position);
    
}

// stackAllSet Stacktableの2進数、符号なし10進数、符号あり10進数、16進数の値を書き換える
// 引数 
// address  :  Memorytableの番地
// value    :  値
function stackAllSet(address,value){
    stackHexSet(address,value);
    stackUdecSet(address,value);
    stackSdecSet(address,value);
    stackBinSet(address,value);
}

// stackHexGet Stacktableの16進数の値を取得する
// 引数 
// address  :  Stacktableの番地
// 戻り値
// string   :  値
function stackHexGet(address){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    var v = table.rows[ r_end-address ].cells[ 1 ].firstChild.data;
    v = parseInt(v.replace('#',''), 16);
    return v
}

// stackUdecGet Stacktableの符号なし10進数の値を取得する
// 引数 
// address  :  Stacktableの番地
// 戻り値
// string   :  値
function stackUdecGet(address){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    var v = table.rows[ r_end-address ].cells[ 2 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// stackUdecGet Stacktableの符号あり10進数の値を取得する
// 引数 
// address  :  Stacktableの番地
// 戻り値
// string   :  値
function stackSdecGet(address){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    var v = table.rows[ r_end-address ].cells[ 3 ].firstChild.data;
    v = parseInt(v, 10);
    return v
}

// stackBinGet stacktableの2進数の値を取得する
// 引数 
// address  :  Stacktableの番地
// 戻り値
// string   :  値
function stackBinGet(address){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    var v = table.rows[ r_end-address ].cells[ 4 ].firstChild.data;
    v = parseInt(v.replace(/ /g,''), 2);
    return v
}

// ajaxJsonToMemoryMap memorytableにバイナリを読み込む
// 引数 
// obj  :  data type:json
function ajaxJsonToMemoryMap(obj){
    
    if(obj["result"]==undefined){
        alert("Result is undefined");
    }else if(obj["result"]=="OK"){
        let address= 0;
        let jsonparse = JSON.parse(obj["code"]);
        let message = "";

        jsonparse.forEach(element => {

            memoryAllSet(address,element.Code);
            memoryLiteralSet(address,element.Token.Literal);
            memoryLineSet(address,element.Token.Line);
            if(element.Label != undefined){
                memoryLabelSet(address,element.Label.Label);
            }
            if(element.Token.Literal=="DC"){
                memoryAllSet(address,element.Addr); 
            }
            if(element.Length == 2){
                memoryAllSet(address+1,element.Addr); 
            }
            address += element.Length;
        });
        successModal("アセンブル成功");
    }else{
        let jsonparseerror = JSON.parse(obj["error"]);
        jsonparseerror.forEach(element => {
            message = element.Line+"行目</br>"+element.Message+" <br> ";
            errorModal(message);
            
        });
    }
}

// jsonParseToMemoryMap memorytableにjsonファイルの値を読み込む
// 引数 
// json  :  文字列
function jsonParseToMemoryMap(json){
    let mox = json;
    mox.replace(/\\n/g, "\\n")  
    .replace(/\\'/g, "")
    .replace(/\//g, "")
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");
    obj = JSON.parse(mox);
    if(obj["result"]==undefined){
        alert("Result is undefined");
    }else if(obj["result"]=="OK"){
        let address= 0;
        obj["code"].forEach(element => {
            memoryAllSet(address,element.Code);
            memoryLiteralSet(address,element.Token.Literal);
            if(element.Label != undefined){
                memoryLabelSet(address,element.Label.Label);
            }
            if(element.Token.Literal=="DC"){
                memoryAllSet(address,element.Addr); 
            }
            if(element.Length == 2){
                memoryAllSet(address+1,element.Addr); 
            }
            address += element.Length;
        });
    }else{
        let address= 0;
        obj["error"].forEach(element => {
            alert(element.Message);
        });
    }
}

// memoryTableRowColorSet Memorytableの行の色を変更する
// 引数 
// address  :  Memorytableの番地
// color    :  値
function memoryTableRowColorSet(address,color){
    let table = document.getElementById('Memorytable');
    table.rows[address].style.backgroundColor=color;
}

// registerTableRowColorSet Registertableの行の色を変更する
// 引数 
// address  :  Registertableの番地
// color    :  値
function registerTableRowColorSet(address,color){
    let table = document.getElementById('Registertable');
    if(address >= 0 && address <= 7){
        table.rows[address+3].style.backgroundColor=color;
    }else if(address == 8||address == 9){
        table.rows[address-7].style.backgroundColor=color;
    }
}

// stackTableRowColorSet Stacktableの行の色を変更する
// 引数 
// address  :  Stacktableの番地
// color    :  値
function stackTableRowColorSet(address,color){
    address = 0xFFFF-address;
    let r_end = stackTableMaxRow;
    let table = document.getElementById('Stacktable');
    table.rows[r_end-address].style.backgroundColor=color;
}

// initMemoryRegister 全てのテーブルの値、色、スクロールのリセット
function initMemoryRegister(){
    for(var i = 0 ; i < memoryTableMaxRow ; i++){
        memoryLabelSet(i,i);
        memoryAllSet(i,0);
        memoryLiteralSet(i,"");
        memoryTableRowColorSet(i,"#FFFFFF");
    }
    for(i = 0 ; i < stackTableMaxRow ; i++){
        stackAllSet(0xFFFF-i,0);
        stackTableRowColorSet(0xFFFF-i,"#FFFFFF");
    }
    for(i = 0 ; i < 10 ; i++){
        registerAllSet(i,0);
        registerTableRowColorSet(i,"#FFFFFF");
    }
    memoryScrollset(0);
    registerScrollset(11);
    stackScrollset(0xFFFF);
    registerAllSet(9,65535);
    registerTableRowColorSet(8,"#00BCD4");
    registerTableRowColorSet(9,"#EEBCD4");
    zeroFlagSet(1);
    signFlagSet(0);
    ofSdecFlagSet(0);
    ofSdecFlagSet(0);
}

// errorModal Modalを利用してアラートの表示
// 引数 
// message    :  値
function errorModal(message){
    if(Math.random()*100%100<1){
        message=message+'<img src="losecat.jpg"  alt="losecat" class="img-fluid">';
    }
    $('#errorModal').on('shown.bs.modal',function(){
        $('#okButton').trigger('focus');
        
    })
    $('#errorModal').find('.modal-title').text("Error");
    $('#errorModal').find('.modal-body').html(message);
    $('#errorModal').modal('show');
}

// successModal Modalを利用してアラートの表示
// 引数 
// message    :  値
function successModal(message){
    if(Math.random()*100%100<1){
        message=message+'<img src="successcat.jpg"  alt="successcat" class="img-fluid">';
    }
    $('#successModal').on('shown.bs.modal',function(){
        $('#okButton2').trigger('focus');
    })
    $('#successModal').find('.modal-title').text("Success");
    $('#successModal').find('.modal-body').html(message);
    $('#successModal').modal('show');
}

// infoModal Modalを利用してアラートの表示
// 引数 
// message    :  値
function infoModal(message){
    $('#infoModal').on('shown.bs.modal',function(){
        $('#okButton3').trigger('focus');
    })
    $('#infoModal').find('.modal-title').text("Information");
    $('#infoModal').find('.modal-body').text((message));
    $('#infoModal').modal('show');
}

