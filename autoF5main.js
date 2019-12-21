/*
Auto F5 (웹사이트 다중접속기) by HKD.
https://jsfiddle.net/temp191219/2epkfbjm/
autof5@protonmail.com
ver0.10 : 19-12-20 개발시작
ver0.16 : 19-12-21 멀티주소 사용가능
ver0.17 : 19-12-21 아이프레임 적용
ver0.18 : 19-12-21 방문자카운터, 아이프레임 자동삭제기능
*/
var timerid_1; 		// 타이머함수 저장용 
var time 			= 500; 	// 반복시간 (동작주기)
var loop_count 		= 0; 	// 현재 동작 횟수
var addUrl_count 	= 1;
var iframeVer 		= 0;
var iframeCount 	= 0;
console.log(1);
function clear(workUrl, i) 
{
    $("#work_area").css({
        'background-image': ""
    });
    eval("timerid_"+i+"= setTimeout(detailWork, time, workUrl, i);");
	$('#targetVal').html('');
}

function start()
{
	for(var i=1;i<addUrl_count+1;i++)
    {
        var workUrl = $('#targetUrlVal_'+i).val();
        detailWork(workUrl, i);
    }
}

function detailWork(workUrl, i) 
{	
    if (!workUrl) 
    {
        msg('<b>(ERROR) 주소가 입력되지 않았습니다</b>');
        return false;
    }
    
    var randNum = (Math.floor(Math.random() * 1000000) + 1);
    var tempUrl = workUrl + '?' + randNum;
    var setTime = $('#repeatTime').val();
    if (!setTime) 
    {
        msg('<b>(ERROR) 재반복시간이 입력되지않았습니다</b>');
        return false;
    }
    
    if (isNumeric(setTime)) 
    {
        msg('<b>(ERROR) 숫자만 입력해주세요</b>');
        return false;
    }
    
    if (setTime < 9) 
    {
        msg('<b>(ERROR) 최소 10 이상의 시간만 설정 가능합니다</b>');
        return false;
    }
    
    if (iframeVer==1) 
    {
    	if (!isThereStr(tempUrl, 'https')) 
        {
        msg('<b>(ERROR) iframe모드 동작시에서는 https 주소가 반드시 필요합니다</b>');
        return false;
        }
    } 
    
    if (!isThereStr(tempUrl, 'http')) 
    {
        msg('<b>(ERROR) 정상적인 주소가 아닙니다</b>');
        return false;
    } 
    else 
    {
        time = setTime;
        $('#targetVal').append(workUrl+' :: ');
        if(iframeVer)
        {
            $('#work_area').append('<iframe src="'+tempUrl+'"></iframe>');
            iframeCount++;
            if(iframeCount>50)
            	$('#work_area iframe').first().remove();
       	}
        else
        {
        	$('#work_area').css({
            	'background-image': 'url(' + tempUrl + ')'
        	});
        }
        $('#countVal').html(loop_count++);
        eval("timerid_"+i+"= setTimeout(clear, time, workUrl, i);");
        msg('<b class="red">(Running)</b> 현재 동작중입니다');
    }
}

function msg(txt)
{
	$('#msg').html(txt);
}

function stop() 
{
	for(var i=1;i<addUrl_count+1;i++)
    {
        eval("clearTimeout(timerid_"+i+")");
    }
    loop_count = 0;
    msg('현재 모든 동작 중지되었습니다.');
}

function reset() 
{
    $('#countVal').html('');
	for(var i=1;i<addUrl_count+1;i++)
    {
        eval("clearTimeout(timerid_"+i+")");
    }
    loop_count = 0;
    addUrl_count = 1;
    msg('"주소 입력을 대기중입니다..."');
    $('#targetUrlVal').val('');
    $('#targetVal').html('');
    $('#repeatTime').val(500);
    $('#multiUrlArea').html('');
    $('#work_area').html('');
    iframeCount = 0;
}

function addUrl()
{
	if(addUrl_count>4)
   	{
    	msg('"<b>동시접속은 5개까지만 가능합니다</b>"');
        return false;
    }
    addUrl_count++;
    $('#multiUrlArea').append('<input type="text" class="targetUrlform" id="targetUrlVal_'+addUrl_count+'" size="70" />');
    eval("timerid_"+addUrl_count+"= null");
}


/* event */
$('#btn_start').on('click', function() {
    start();
});
$('#btn_stop').on('click', function() {
    stop();
});
$('#btn_reset').on('click', function() {
    reset();
});
$('#btn_add').on('click', function() {
    addUrl();
});
$('#iframeToggle').change(function() {
    if (this.checked) {
        msg('<b>이제 iFrame 모드로 동작합니다 (막힌 사이트 다수), "https" 주소만 사용 </b>');
        iframeVer = 1;
    } else {
        msg('iFrame 동작모드 중지, 일반모드로 전환되었습니다');
        iframeVer = 0;
    }
});


/* UTIL */
function isThereStr(str, find) 
{
    if (str.indexOf(find) !== -1)
        return true;
    else
        return false;
}
function isNumeric(val) 
{
    var num = val.search(/[0-9]/g);
    if (num >= 0) {
        return false;
    } else {
        return true;
    }
}