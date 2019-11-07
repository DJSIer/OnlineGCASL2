window.addEventListener('DOMContentLoaded', onLoadExe);
function onLoadExe() {
    // フッター領域
    footerArea = document.getElementById('footer_fixed');
    // 「リセット」ボタンの制御
    document.querySelector('#btnReset').addEventListener('click', () => {
        initMemoryRegister();
    });
    // 「アセンブル」ボタンの制御
    document.querySelector('#btnAssemble').addEventListener('click', () => {
        //メモリレジスタスタック初期化
        initMemoryRegister();
        $.ajax({
            url: 'https://fast-river-46694.herokuapp.com/GCASL',
            type: 'POST',
            dataType: 'json',
            // フォーム要素の内容をハッシュ形式に変換
            data:{
                'code' : editor.getValue(),
            }
          })
          .done(function(data) {
            ajaxJsonToMemoryMap(data);
            editor.selection.moveCursorToPosition({row:0,column:0});
        })
          .fail(function() {
              alert("通信失敗");
              // 通信失敗時の処理を記述
          });
    });
    // 「実行」ボタンの制御
    document.querySelector('#btnExecution').addEventListener('click', () => {
        //let literal = memoryLiteralGet(pr);
        for(i = 3;i != execute();){
            execute();
        }
    });
    // 「ステップ実行」ボタンの制御
    document.querySelector('#btnStepExecution').addEventListener('click', () => {
        execute();
    });
    // 「ステップバック」ボタンの制御
    document.querySelector('#btnStepBack').addEventListener('click', () => {
        //execute();
    });
}


function cometLAD(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let addr = memoryUdecGet(pr+1);
    registerAllSet(r1,addr+registerUdecGet(r2));
    return 2;
}

function cometLD(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    overflowFlagSet(0);
    if(op == '10'){
        let addr = memoryUdecGet(pr+1);
        registerAllSet(r1,memoryUdecGet(addr+registerUdecGet(r2)));
        overflowFlagSet(0);
        
        zeroFlagSet(memoryUdecGet(addr+registerUdecGet(r2)));
        signFlagSet(memoryUdecGet(addr+registerUdecGet(r2)));
        return 2;
    }else{
        registerAllSet(r1,registerUdecGet(r2));
        overflowFlagSet(0);
        zeroFlagSet(registerUdecGet(r2));
        signFlagSet(registerUdecGet(r2));
        return 1;
    }
}

function cometST(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let addr = memoryUdecGet(pr+1);
    memoryAllSet(addr+registerUdecGet(r2),registerUdecGet(r1));
    return 2;
}

function cometADDA(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '20'){
        let addr = memoryUdecGet(pr+1);
        ans = registerSdecGet(r1) + memorySdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        ofSdecFlagSet(ans);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerSdecGet(r1) + registerSdecGet(r2);
        registerAllSet(r1,ans);
        ofSdecFlagSet(ans);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometSUBA(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '21'){
        let addr = memoryUdecGet(pr+1);
        ans = registerSdecGet(r1) - memorySdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        ofSdecFlagSet(ans);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerSdecGet(r1) - registerSdecGet(r2);
        registerAllSet(r1,ans);
        ofSdecFlagSet(ans);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometADDL(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '22'){
        let addr = memoryUdecGet(pr+1);
        ans = registerUdecGet(r1) + memoryUdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        ofUdecFlagSet(ans);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerUdecGet(r1) + registerUdecGet(r2);
        registerAllSet(r1,ans);
        ofUdecFlagSet(ans);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometSUBL(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0;
    let ans2 = 0; 

    if(op == '23'){
        let addr = memoryUdecGet(pr+1);
        ans = registerUdecGet(r1) - memoryUdecGet(addr+registerUdecGet(r2));
        ans2 = registerSdecGet(r1) - memorySdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        ofUdecFlagSet(ans2);
        zeroFlagSet(ans2);
        signFlagSet(ans2);
        return 2;
    }else{
        ans = registerUdecGet(r1) - registerUdecGet(r2);
        ans2 = registerSdecGet(r1) - registerSdecGet(r2);
        registerAllSet(r1,ans);
        ofUdecFlagSet(ans2);
        zeroFlagSet(ans2);
        signFlagSet(ans2);
        return 1;
    }
}

function cometAND(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '30'){
        let addr = memoryUdecGet(pr+1);
        ans = registerUdecGet(r1) & memoryUdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        overflowFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerUdecGet(r1) & registerUdecGet(r2);
        registerAllSet(r1,ans);
        overflowFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometOR(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '31'){
        let addr = memoryUdecGet(pr+1);
        ans = registerUdecGet(r1) | memoryUdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        overflowFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerUdecGet(r1) | registerUdecGet(r2);
        registerAllSet(r1,ans);
        overflowFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometXOR(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '32'){
        let addr = memoryUdecGet(pr+1);
        ans = registerUdecGet(r1) ^ memoryUdecGet(addr+registerUdecGet(r2));
        registerAllSet(r1,ans);
        overflowFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerUdecGet(r1) ^ registerUdecGet(r2);
        registerAllSet(r1,ans);
        overflowFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometCPA(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '40'){
        let addr = memoryUdecGet(pr+1);
        ans = registerSdecGet(r1) - memorySdecGet(addr+registerUdecGet(r2));
        ofSdecFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerSdecGet(r1) - registerSdecGet(r2);
        ofSdecFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometCPL(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let op=opcode[1]+opcode[2];
    let ans = 0; 

    if(op == '41'){
        let addr = memoryUdecGet(pr+1);
        ans = registerUdecGet(r1) - memoryUdecGet(addr+registerUdecGet(r2));
        ofUdecFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 2;
    }else{
        ans = registerUdecGet(r1) - registerUdecGet(r2);
        ofUdecFlagSet(0);
        zeroFlagSet(ans);
        signFlagSet(ans);
        return 1;
    }
}

function cometSLA(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let ans = 0;
    let sign = 0; 
    let addr = memoryUdecGet(pr+1);

    ans = registerSdecGet(r1) << (addr+registerUdecGet(r2));
    sign = registerSdecGet(r1) & 0x8000;
    if(sign == 0x8000){
        ans = ans | sign;
    }else{
        ans = ans & 0x17FFF;
    }
    if((ans & 0x10000) == 0x10000){
        overflowFlagSet(1);
    }else{
        overflowFlagSet(0);
    }
    registerAllSet(r1,ans);
    zeroFlagSet(ans);
    signFlagSet(ans);
    return 2;
}

function cometSRA(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let ans = 0;
    let sign = 0; 
    let addr = memoryUdecGet(pr+1);

    ans = registerSdecGet(r1);
    sign = registerSdecGet(r1) & 0x8000;
    if(sign == 0x8000){
        ans = ans | 0x80000000;
    }else{
        ans = ans & 0x0000FFFF;
    }
    ans = registerSdecGet(r1) >> (addr+registerUdecGet(r2));
    if((registerSdecGet(r1) >>> (addr+registerUdecGet(r2)-1)) & 0x0001 == 0x0001){
        overflowFlagSet(1);
    }else{
        overflowFlagSet(0);
    }
    registerAllSet(r1,ans);
    zeroFlagSet(ans);
    signFlagSet(ans);
    return 2;
}

function cometSLL(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let ans = 0;
    let addr = memoryUdecGet(pr+1);

    ans = registerSdecGet(r1) << (addr+registerUdecGet(r2));
    if((ans & 0x10000) == 0x10000){
        overflowFlagSet(1);
    }else{
        overflowFlagSet(0);
    }
    ans = ans & 0xFFFF;
    registerAllSet(r1,ans);
    zeroFlagSet(ans);
    signFlagSet(ans);
    return 2;
}

function cometSRL(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let r2 = opcode[4];
    let ans = 0;
    let addr = memoryUdecGet(pr+1);

    ans = registerSdecGet(r1) & 0x0000FFFF;
    ans = ans >>> (addr+registerUdecGet(r2));
    if((registerSdecGet(r1) >>> (addr+registerUdecGet(r2)-1)) & 0x0001 == 0x0001){
        overflowFlagSet(1);
    }else{
        overflowFlagSet(0);
    }
    registerAllSet(r1,ans);
    zeroFlagSet(ans);
    signFlagSet(ans);
    return 2;
}

function cometJUMP(pr){
    let opcode = memoryHexGet(pr);
    let r2 = opcode[4];
    let addr = memoryUdecGet(pr+1);
    let address = addr+registerUdecGet(r2);
    if(address > memoryTableMaxRow){
        errorModal("実行時エラー：<br>分岐命令で異常な値を検知しました。</br>"+pr+"行目の命令");
        return 0;
    }
    memoryScrollset(address);
    
    return address-pr;
}

function cometJPL(pr){
    if(signFlagGet() == 0 && zeroFlagGet() == 0){
        return cometJUMP(pr);
    }
    return 2;
}

function cometJMI(pr){
    if(signFlagGet() == 1){
        return cometJUMP(pr);
    }
    return 2;
}

function cometJNZ(pr){
    if(zeroFlagGet() == 0){
        return cometJUMP(pr);
    }
    return 2;
}

function cometJZE(pr){
    if(zeroFlagGet() == 1){
        return cometJUMP(pr);
    }
    return 2;
}

function cometJOV(pr){
    if(overflowFlagGet() == 1){
        return cometJUMP(pr);
    }
    return 2;
}

function cometPUSH(pr){
    let opcode = memoryHexGet(pr);
    let r2 = opcode[4];
    let addr = memoryUdecGet(pr+1);
    let address = addr+registerUdecGet(r2);
    let sp = registerUdecGet(9);
    sp -= 1;
    stackAllSet(sp,address);
    registerAllSet(9,sp);
    
    
    return 2;
}

function cometPOP(pr){
    let opcode = memoryHexGet(pr);
    let r1 = opcode[3];
    let sp = registerUdecGet(9);
    let val = stackUdecGet(sp);

    if(sp != 0xFFFF){
        sp += 1;
        registerAllSet(9,sp);
        registerAllSet(r1,val);
    }else if(sp == 0xFFFE){
        sp += sp;
    }else{
        errorModal("実行時エラー：<br>スタックポインタが0xFFFFのためPOPできません<br>動作を終了します");
        return 0;
    }
    
    return 1;
}

function cometCALL(pr){
    let opcode = memoryHexGet(pr);
    let r2 = opcode[4];
    let addr = memoryUdecGet(pr+1);
    let address = addr+registerUdecGet(r2);
    let sp = registerUdecGet(9);
    sp -= 1;
    stackAllSet(sp,pr+2);
    registerAllSet(9,sp);
    
    return address-pr;
}

function cometRET(pr){
    let opcode = memoryHexGet(pr);
    let addr = memoryUdecGet(pr+1);
    let sp = registerUdecGet(9);
    let address =stackUdecGet(sp)
    
    if(sp != 0xFFFF){
        registerAllSet(9,sp+1);
    }else if(sp == 0xFFFE){
        sp += sp
    }else{
        infoModal("プログラムが終了しました");
        return 0x10000;
    }
    return address-pr;
}

function cometSVC(pr){
    let adr = memoryHexGet(pr+1);
    let opcode1 = registerUdecGet(1);
    let opcode2 = registerUdecGet(2);
    switch(adr){
        case "#703A":
            $('#inputModal').modal('show');

            break;
        case "#02AB":
            let word = "";
            for(let i = opcode1,index = 0 ; i < opcode1 + memoryUdecGet(opcode2) && index <= 256 ; i++,index++){
                word = word + hexToWord(memoryUdecGet(i));
            }
            infoModal(word);
            break;
        default://IN,OUT以外はNOP
            break;
    }
    return 2;
}


let beforePC=0;

function execute(){
    let pr = prUdecGet();
    let literal = memoryLiteralGet(pr);
    let length;

    beforePC=pr;
    switch (literal){
        case "LD":
            length = cometLD(pr);
            break;
        case "LAD":
            length = cometLAD(pr);
            break;
        case "ST":
            length = cometST(pr);
            break;
        case "ADDA":
            length = cometADDA(pr);
            break;
        case "SUBA":
            length = cometSUBA(pr);
            break;
        case "ADDL":
            length = cometADDL(pr);
            break;
        case "SUBL":
            length = cometSUBL(pr);
            break;
        case "AND":
            length = cometAND(pr);
            break;  
        case "OR":
            length = cometOR(pr);
            break; 
        case "XOR":
            length = cometXOR(pr);
            break; 
        case "CPA":
            length = cometCPA(pr);
            break;
        case "CPL":
            length = cometCPL(pr);
            break; 
        case "SLA":
            length = cometSLA(pr);
            break;
        case "SRA":
            length = cometSRA(pr);
            break;
        case "SLL":
            length = cometSLL(pr);
            break;
        case "SRL":
            length = cometSRL(pr);
            break;
        case "JUMP":
            length = cometJUMP(pr);
            break;
        case "JPL":
            length = cometJPL(pr);
            break;
        case "JMI":
            length = cometJMI(pr);
            break;
        case "JNZ":
            length = cometJNZ(pr);
            break;
        case "JZE":
            length = cometJZE(pr);
            break;
        case "JOV":
            length = cometJOV(pr);
            break;
        case "PUSH":
            length = cometPUSH(pr);
            break;
        case "POP":
            length = cometPOP(pr);
            break;
        case "CALL":
            length = cometCALL(pr);
            break;
        case "SVC":
            length = cometSVC(pr);
            break;
        case "RET":
            length = cometRET(pr);
            if(length == 0x10000){
                length = 0;
                pr = 0;
                return 3;
            }
            break;
        case "END":
            length = 0;
            pr = 0;
            return 3;
        default:
            //NOP命令
            length = 1;
        break;
    }
    prValueSet(abs(length+ prUdecGet()));
}

function hexToWord(value){
    switch(value){
        case 0x0020:
            return " ";
        case 0x0021:
            return "!";
        case 0x0022:
            return "\"";
        case 0x0023:
            return "#";
        case 0x0024:
            return "$";
        case 0x0025:
            return "%";
        case 0x0026:
            return "&";
        case 0x0027:
            return "\'";
        case 0x0028:
            return "(";
        case 0x0029:
            return ")"; 
        case 0x002A:
            return "*";
        case 0x002B:
            return "+";
        case 0x002C:
            return ",";
        case 0x002D:
            return "-";
        case 0x002E:
            return ".";
        case 0x002F:
            return "/";
        case 0x0030:
            return "0";
        case 0x0031:
            return "1";
        case 0x0032:
            return "2";
        case 0x0033:
            return "3";
        case 0x0034:
            return "4";
        case 0x0035:
            return "5";
        case 0x0036:
            return "6";
        case 0x0037:
            return "7";
        case 0x0038:
            return "8";
        case 0x0039:
            return "9";
        case 0x003A:
            return ":";
        case 0x003B:
            return ";";
        case 0x003C:
            return "<";
        case 0x003D:
            return "=";
        case 0x003E:
            return ">";
        case 0x003F:
            return "?";
        case 0x0040:
            return "@";
        case 0x0041:
            return "A";
        case 0x0042:
            return "B";
        case 0x0043:
            return "C";
        case 0x0044:
            return "D";
        case 0x0045:
            return "E";
        case 0x0046:
            return "F";
        case 0x0047:
            return "G";
        case 0x0048:
            return "H";
        case 0x0049:
            return "I";
        case 0x004A:
            return "J";
        case 0x004B:
            return "K";
        case 0x004C:
            return "L";
        case 0x004D:
            return "M";
        case 0x004E:
            return "N";
        case 0x004F:
            return "O";
        case 0x0050:
            return "P";
        case 0x0051:
            return "Q";
        case 0x0052:
            return "R";
        case 0x0053:
            return "S";
        case 0x0054:
            return "T";
        case 0x0055:
            return "U";
        case 0x0056:
            return "V";
        case 0x0057:
            return "W";
        case 0x0058:
            return "X";
        case 0x0059:
            return "Y";
        case 0x005A:
            return "Z";
        case 0x005B:
            return "[";
        case 0x005C:
            return "\\";
        case 0x005D:
            return "]";
        case 0x005E:
            return "^";
        case 0x005F:
            return "_";
        case 0x0060:
            return "`";
        case 0x0061:
            return "a";
        case 0x0062:
            return "b";
        case 0x0063:
            return "c";
        case 0x0064:
            return "d";
        case 0x0065:
            return "e";
        case 0x0066:
            return "f";
        case 0x0067:
            return "g";
        case 0x0068:
            return "h";
        case 0x0069:
            return "i";
        case 0x006A:
            return "j";
        case 0x006B:
            return "k";
        case 0x006C:
            return "l";
        case 0x006D:
            return "m";
        case 0x006E:
            return "n";
        case 0x006F:
            return "o";
        case 0x0070:
            return "p";
        case 0x0071:
            return "q";
        case 0x0072:
            return "r";
        case 0x0073:
            return "s";
        case 0x0074:
            return "t";
        case 0x0075:
            return "u";
        case 0x0076:
            return "v";
        case 0x0077:
            return "w";
        case 0x0078:
            return "x";
        case 0x0079:
            return "y";
        case 0x007A:
            return "z";
        case 0x007B:
            return "{";
        case 0x007C:
            return "|";
        case 0x007D:
            return "}";
        case 0x007E:
            return "~";
        default:
            return "";
    }
}

function wordcode(value){
    switch(value){
        case " ":
            return 0x0020;
        case "!":
            return 0x0021;
        case "\"":
            return 0x0022;
        case "#":
            return 0x0023;
        case "$":
            return 0x0024;
        case "%":
            return 0x0025;
        case "&":
            return 0x0026;
        case "\'":
            return 0x0027;
        case "(":
            return 0x0028;
        case ")":
            return 0x0029; 
        case "*":
            return 0x002A;
        case "+":
            return 0x002B;
        case ",":
            return 0x002C;
        case "-":
            return 0x002D;
        case ".":
            return 0x002E;
        case "/":
            return 0x002F;
        case "0":
            return 0x0030;
        case "1":
            return 0x0031;
        case "2":
            return 0x0032;
        case "3":
            return 0x0033;
        case "4":
            return 0x0034;
        case "5":
            return 0x0035;
        case "6":
            return 0x0036;
        case "7":
            return 0x0037;
        case "8":
            return 0x0038;
        case "9":
            return 0x0039;
        case ":":
            return 0x003A;
        case ";":
            return 0x003B;
        case "<":
            return 0x003C;
        case "=":
            return 0x003D;
        case ">":
            return 0x003E;
        case "?":
            return 0x003F;
        case "@":
            return 0x0040;
        case "A":
            return 0x0041;
        case "B":
            return 0x0042;
        case "C":
            return 0x0043;
        case "D":
            return 0x0044;
        case "E":
            return 0x0045;
        case "F":
            return 0x0046;
        case "G":
            return 0x0047;
        case "H":
            return 0x0048;
        case "I":
            return 0x0049;
        case "J":
            return 0x004A;
        case "K":
            return 0x004B;
        case "L":
            return 0x004C;
        case "M":
            return 0x004D;
        case "N":
            return 0x004E;
        case "O":
            return 0x004F;
        case "P":
            return 0x0050;
        case "Q":
            return 0x0051;
        case "R":
            return 0x0052;
        case "S":
            return 0x0053;
        case "T":
            return 0x0054;
        case "U":
            return 0x0055;
        case "V":
            return 0x0056;
        case "W":
            return 0x0057;
        case "X":
            return 0x0058;
        case "Y":
            return 0x0059;
        case "Z":
            return 0x005A;
        case "[":
            return 0x005B;
        case "\\":
            return 0x005C;
        case "]":
            return 0x005D;
        case "^":
            return 0x005E;
        case "_":
            return 0x005F;
        case "`":
            return 0x0060;
        case "a":
            return 0x0061;
        case "b":
            return 0x0062;
        case "c":
            return 0x0063;
        case "d":
            return 0x0064;
        case "e":
            return 0x0065;
        case "f":
            return 0x0066;
        case "g":
            return 0x0067;
        case "h":
            return 0x0068;
        case "i":
            return 0x0069;
        case "j":
            return 0x006A;
        case "k":
            return 0x006B;
        case "l":
            return 0x006C;
        case "m":
            return 0x006D;
        case "n":
            return 0x006E;
        case "o":
            return 0x006F;
        case "p":
            return 0x0070;
        case "q":
            return 0x0071;
        case "r":
            return 0x0072;
        case "s":
            return 0x0073;
        case "t":
            return 0x0074;
        case "u":
            return 0x0075;
        case "v":
            return 0x0076;
        case "w":
            return 0x0077;
        case "x":
            return 0x0078;
        case "y":
            return 0x0079;
        case "z":
            return 0x007A;
        case "{":
            return 0x007B;
        case "|":
            return 0x007C;
        case "}":
            return 0x007D;
        case "~":
            return 0x007E;
        case "":
            return 0x007F;
        default:
            errorModal("文字コードに存在しない文字です");
            return 0;
    }
}