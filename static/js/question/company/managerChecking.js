/**
 * Created by lujiaju on 16/2/29.
 */
var showV;
var _answer;

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var mockData = [
    {
        user:'tom1',
        content:'问卷第二题编辑有错',
        time:'2016-2-12-11:30 AM'
    },
    {
        user:'tom2',
        content:'问卷第二题编辑有错',
        time:'2016-2-12-11:30 AM'
    },
    {
        user:'tom3',
        content:'问卷第二题编辑有错',
        time:'2016-2-12-11:30 AM'
    }
]
var questionnaireId,participateID,status,commentsData;
$(function(){
    //发送数据
    var tmp = location.href;
    var indexNum = tmp.substring(tmp.indexOf('id')+3);

    $.get('/questionnaire/ajaxQuestionnaireAuditDetail?id='+indexNum,function(data){
        console.log(JSON.parse(data));
        _answer = JSON.parse(data).elements;
        var renderData = JSON.parse(data);

        questionnaireId = renderData.questionnaireId;
        participateID = renderData.participate.id;
        commentsData = renderData.audits;
        status = renderData.participate.status;

        var content = renderData.elements;
        showV = content;
        //渲染标题
        $('#title').text(renderData.title);
        //渲染题目
        renderMyQuestions(content);
        /*渲染评论*/
        renderComments(commentsData);
    });
    /*发送评论*/
    $('#adminPosting').on('click',function(){
        var comments = $('#comments').val();
        $.post('/questionnaire/audit',{questionnaireId:questionnaireId,participateId:participateID,status:status,content:comments,type:'Audit',csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]").val()},function(success){
            console.log('success');
        })
    });
    /*审核成功*/
    $('#auditSuccess').on('click',function(e){
        e.preventDefault();
        var newAnswer = getVisitorAnswer();
        for(var i=0;i<_answer.length;i++){
            if(_answer[i].type=='question7'){
                console.log('7')
                _answer[i].modifyDescrption = '';
            }
            else if(_answer[i].results[0].answer == newAnswer[i]){
                console.log('same');
                _answer[i].modifyDescrption = '';
            }else {
                 _answer[i].modifyDescrption = '原来是'+_answer[i].results[0].answer+';现在是'+newAnswer[i];
                _answer[i].results[0].answer=newAnswer[i];
            }

        }
        console.log(_answer)
        $('#formContent2').val(questionnaireId);
        $('#formContent1').val(JSON.stringify(_answer));
        if(confirm("审核成功后报酬将打给访客，确认审核成功吗")){
            $("#auditForm input[name=status]").val("S")
            $("#auditForm").submit();
        }

    });
});
function renderComments(data){
    var len = data.length;
    var time,user,content,text,tmpTime;
    for(var i=0;i<len;i++){
        text = '';
        time = data[i].gmtCreate;
        tmpTime = new Date();
        tmpTime.setTime(time*1000);
        time = tmpTime.Format("yyyy-MM-dd HH:mm:ss");
        user = data[i].userName;
        content = data[i].content;
        text+='<li><div class="talkTop"><div class="avatar"><img src="/static/images/avatar/avatar_man.png"></div><div class="operate"><p class="time">';
        text+=time;
        text+='</p><p class="action"><span class="editorUsers">';
        text+=user;
        text+='</span>编辑了问卷</p></div><div class="clear"></div></div><div class="desc"><div class="descTitle">说明: </div><div class="memo">';
        text+=content;
        text+='</div></div></li>';
        $('#qwe').append(text);
    }
}
function renderMyQuestions(data){
    var len = data.length;
    //console.log('题目长度'+len);
    for(var i=0;i<len;i++){
        //console.log('题目类型');
        //console.log(data[i].type);
        switch (data[i].type){
            case 'question1':
                $('.formBody').append($('.action1').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.singlyText-input input').val(data[i].results[0].answer);

                break;
            case 'question2':
                $('.formBody').append($('.action2').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.singlyText-input input').val(data[i].results[0].answer);
                break;
            case 'question3':
                $('.formBody').append($('.action3').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.singlyText-input textarea').val(data[i].results[0].answer);
                break;
            case 'question4':
                $('.formBody').append($('.action4').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.myDrop>option').eq(j).val(data[i].options[j].option);
                  if(data[i].options[j].option==data[i].results[0].answer){
                    $('.editorAction').eq(7+i).find('.myDrop').val(data[i].results[0].answer);
                  }
                }
                break;
            case 'question5':
                $('.formBody').append($('.action5').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                //$('.editorAction').eq(7+i).find('.checkItem>input').attr('disabled','disabled');
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('name',i);
                  if(data[i].options[j].option==data[i].results[0].answer){
                    $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('checked','checked');
                  }
                }
                break;
            case 'question6':
                $('.formBody').append($('.action6').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                //$('.editorAction').eq(7+i).find('.checkItem>input').attr('disabled','disabled');
                for(var j = 0;j<3;j++){
                  $('.editorAction').eq(7+i).find('.checkItem>span').eq(j).text(data[i].options[j].option);
                  $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).val(data[i].options[j].option);
                  if(data[i].results[0].answer.indexOf(data[i].options[j].option)>0){
                      $('.editorAction').eq(7+i).find('.checkItem>input').eq(j).attr('checked','checked');

                  }

                }
                break;
            case 'question7':
                $('.formBody').append($('.action7').eq(0).clone().removeClass('hidden'));
                $('.editorAction').eq(7+i).find('label').text(data[i].title);
                $('.editorAction').eq(7+i).find('.singlyText-description p').text(data[i].description);
                $('.editorAction').eq(7+i).find('.uploadFile a').attr('href','/'+data[i].results[0].answer);
                break;
        }
    }
}
function compareAnswer(e,i,arr){

}
function getVisitorAnswer(){
    var len = $('.editorAction').length;
    var answer = [];
    for(var i=7;i<len;i++){
        var obj = $('.editorAction').eq(i);
        if(obj.hasClass('action1')||obj.hasClass('action2')){
            answer.push(obj.find('input').val());
        }
        if(obj.hasClass('action3')){
            answer.push(obj.find('textarea').val());
        }
        if(obj.hasClass('action4')){
            answer.push(obj.find('.myDrop').val());
        }
        if(obj.hasClass('action5')){
            answer.push(obj.find('input:radio[name="'+(parseInt(i)-7)+'"]:checked').val());
        }
        if(obj.hasClass('action6')){
            var tmp = [];
            obj.find('input:checkbox[name="1th"]').each(function(){
                if($(this).is(':checked')){
                    tmp.push($(this).val());
                }
            });
            answer.push(tmp);
        }
        if(obj.hasClass('action7')){
            answer.push('附件');
        }
    }
    return answer;
}
